// app/api/refine/route.js
// ─────────────────────────────────────────────────────────────────────────────
// Context-aware AI refinement endpoint
// Extracts design system from the full website HTML before sending to Gemini,
// so every refined section perfectly inherits the site's palette, fonts,
// spacing, and component patterns.
// ─────────────────────────────────────────────────────────────────────────────

import { validateOutput } from '@/lib/gemini/outputValidator'

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Pull the :root CSS-variable block out of a full HTML string.
 * Returns a compact string like "--bg:#0a0f1e; --accent:#00d4ff; ..."
 * Falls back to an empty string if nothing is found.
 */
function extractCssVariables(fullHtml) {
  if (!fullHtml) return ''
  // Grab everything inside :root { … }
  const match = fullHtml.match(/:root\s*\{([^}]+)\}/)
  if (!match) return ''
  return match[1]
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('--'))
    .join(' ')
    .substring(0, 1500) // safety cap — no need to flood the prompt
}

/**
 * Extract the @import Google Fonts line so the refined section uses
 * the same fonts even if they are only in <head>.
 */
function extractFontImport(fullHtml) {
  if (!fullHtml) return ''
  const match = fullHtml.match(/@import url\([^)]+\);/)
  return match ? match[0] : ''
}

/**
 * Find which section tag wraps sectionHtml inside the full page.
 * Returns the id attribute string, e.g. "id=\"hero\"", or ''.
 */
function detectSectionId(sectionHtml) {
  const m = sectionHtml?.match(/<(?:section|header|footer|nav|div)[^>]*id="([^"]+)"/)
  return m ? m[1] : ''
}

/**
 * Strip common Gemini pollution from output:
 *   - ```html … ``` fences
 *   - <!DOCTYPE … </html> wrappers (full page when we only want a section)
 *   - Leading/trailing whitespace
 *   - "Here is the updated section:" preamble lines
 */
function sanitizeGeminiOutput(raw) {
  if (!raw) return ''

  let html = raw.trim()

  // Remove markdown fences (```html, ```, ~~~)
  html = html.replace(/^```[\w]*\n?/gm, '').replace(/^```$/gm, '').replace(/^~~~[\w]*\n?/gm, '').replace(/^~~~$/gm, '')

  // Remove full-page wrapper if Gemini returned a complete HTML document
  if (/<html[\s>]/i.test(html)) {
    // Try to extract just the <body> content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      html = bodyMatch[1].trim()
    } else {
      // Strip opening/closing html/head/body tags
      html = html
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<\/?html[^>]*>/gi, '')
        .replace(/<head[\s\S]*?<\/head>/gi, '')
        .replace(/<\/?body[^>]*>/gi, '')
        .trim()
    }
  }

  // Remove any preamble lines that are pure text (not HTML)
  html = html.replace(/^[A-Za-z][^\n<]{0,120}\n/, '').trim()

  // Remove trailing plain-text lines after the last closing tag
  const lastTag = html.lastIndexOf('</')
  if (lastTag !== -1) {
    html = html.substring(0, lastTag + html.substring(lastTag).indexOf('>') + 1)
  }

  return html.trim()
}

/**
 * Validate that the returned HTML looks like a section fragment,
 * not a script or style injection.
 */
function isSafeFragment(html) {
  if (!html || html.length < 20) return false
  // Must start with an opening tag
  if (!/^\s*<[a-zA-Z]/.test(html)) return false
  // Reject anything with <script> tags (security)
  if (/<script[\s>]/i.test(html)) return false
  return true
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req) {
  try {
    // ── 1. Parse request ─────────────────────────────────────────────────────
    const body = await req.json().catch(() => null)

    if (!body) {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const {
      websiteId,
      refinement,
      sectionHtml,
      fullHtml,       // ← NEW: full page HTML for context extraction
      userId,
      industry,       // ← NEW: optional, passed from frontend
      paletteName,    // ← NEW: optional, e.g. "Deep Ocean"
    } = body

    // ── 2. Input validation ───────────────────────────────────────────────────
    if (!refinement?.trim()) {
      return Response.json({ error: 'refinement text is required' }, { status: 400 })
    }
    if (!sectionHtml?.trim()) {
      return Response.json({ error: 'sectionHtml is required' }, { status: 400 })
    }
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    // ── 3. Extract design context from the full page ──────────────────────────
    const cssVars   = extractCssVariables(fullHtml || sectionHtml)
    const fontLine  = extractFontImport(fullHtml || sectionHtml)
    const sectionId = detectSectionId(sectionHtml)

    const hasDesignContext = cssVars.length > 0

    // ── 4. Build context-aware prompt ────────────────────────────────────────
    const designBlock = hasDesignContext
      ? `
═══════════════════════════════════════════════
DESIGN SYSTEM (YOU MUST FOLLOW THIS EXACTLY)
═══════════════════════════════════════════════
These CSS custom properties are already defined globally on :root in the page.
Use ONLY these variables for all colors, never hardcode hex values:

${cssVars}

${fontLine ? `Font import already in <head>: ${fontLine}` : ''}
${paletteName ? `Palette name: ${paletteName}` : ''}
${industry ? `Industry: ${industry}` : ''}

CRITICAL COLOR RULE:
- Background colors  → var(--bg) or var(--surface)
- Primary text       → var(--text)
- Muted/subtle text  → var(--muted)
- Accent highlights  → var(--accent)
- CTA buttons        → var(--cta)
- Hover glows        → var(--highlight)
- NEVER output literal hex codes like #ff0000 or rgb() values
- NEVER introduce new colors not in this palette

CRITICAL TYPOGRAPHY RULE:
- All headings: font-family: var(--font-heading)
- All body text: font-family: var(--font-body)
- Match the heading weight/size scale of the existing section

CRITICAL SPACING RULE:
- Match padding/margin rhythm already in the section
- Sections use padding: clamp(4rem, 8vw, 7rem) 0
- Cards use the same border-radius as existing cards in the section
`
      : `
NOTE: Full page HTML was not provided. Preserve all existing inline styles,
classes, and CSS variables already present in the section. Do NOT introduce
new color values or fonts — match whatever is already used.
`

    const interactivityBlock = `
═══════════════════════════════════════════════
INTERACTIVITY REQUIREMENTS
═══════════════════════════════════════════════
- If you add new cards or items, add data-reveal="fade-up" and a staggered
  style="transition-delay: Xs" (0.1s increments) so the existing
  IntersectionObserver scroll-reveal JS picks them up automatically.
- If you add stat numbers, use data-count="NUMBER" data-suffix="SYMBOL"
  so the counter animation JS fires on them.
- If you add new cards, include class="card" so the mouse-glow effect works.
- Do NOT add <script> tags — all JS is already in the page.
- Do NOT add <style> tags with :root overrides — use the existing variables.
- Hover states: use the same transition: all 0.3s ease pattern as the rest of the site.
`

    const prompt = `
You are a world-class UI/UX engineer performing a surgical refinement on ONE
section of an existing website. Your output must be seamlessly indistinguishable
from the rest of the page — same palette, same typography, same spacing, same
interaction patterns.

${designBlock}
${interactivityBlock}

═══════════════════════════════════════════════
CURRENT SECTION HTML${sectionId ? ` (id="${sectionId}")` : ''}
═══════════════════════════════════════════════
${sectionHtml}

═══════════════════════════════════════════════
USER REFINEMENT REQUEST
═══════════════════════════════════════════════
${refinement}

═══════════════════════════════════════════════
ABSOLUTE OUTPUT RULES — VIOLATION = FAILURE
═══════════════════════════════════════════════
1. Return ONLY the updated section HTML fragment — nothing else
2. Start your output with the opening tag of the section (e.g. <section or <header)
3. End your output with the matching closing tag
4. NO markdown fences (\`\`\`html or \`\`\`)
5. NO <!DOCTYPE>, <html>, <head>, or <body> tags
6. NO <script> or <style> tags
7. NO explanations, comments to me, or preamble text
8. NO hardcoded hex colors — use CSS variables only
9. Preserve the section's id attribute and all existing class names
10. Keep ALL existing responsive breakpoints (media queries inside existing <style> sections are fine only if they were already there)
11. If the request is ambiguous, make the most visually compelling interpretation

Return ONLY raw HTML starting with the section's opening tag.
`.trim()

    // ── 5. Call Gemini ────────────────────────────────────────────────────────
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,          // lower = more faithful to design system
            topP: 0.9,
            maxOutputTokens: 8192,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text().catch(() => '')
      return Response.json(
        { error: `Gemini HTTP ${geminiResponse.status}: ${errText.substring(0, 300)}` },
        { status: 502 }
      )
    }

    const geminiData = await geminiResponse.json().catch(() => null)

    if (!geminiData) {
      return Response.json({ error: 'Failed to parse Gemini response JSON' }, { status: 502 })
    }

    // ── 6. Handle Gemini-level errors ─────────────────────────────────────────
    if (geminiData.error) {
      return Response.json(
        { error: `Gemini API error: ${geminiData.error.message}` },
        { status: 500 }
      )
    }

    // Check for safety blocks or empty candidates
    const candidate = geminiData?.candidates?.[0]
    if (!candidate) {
      return Response.json({ error: 'Gemini returned no candidates' }, { status: 500 })
    }

    if (candidate.finishReason === 'SAFETY') {
      return Response.json(
        { error: 'Gemini blocked the request due to safety filters. Try rephrasing your refinement.' },
        { status: 422 }
      )
    }

    if (candidate.finishReason === 'MAX_TOKENS') {
      // Partial output — still try to use it
      console.warn('[refine] Gemini hit MAX_TOKENS — output may be truncated')
    }

    const rawOutput = candidate?.content?.parts?.[0]?.text

    if (!rawOutput) {
      return Response.json(
        { error: 'Gemini returned empty output. Try a more specific refinement request.' },
        { status: 500 }
      )
    }

    // ── 7. Sanitize output ────────────────────────────────────────────────────
    let html = sanitizeGeminiOutput(rawOutput)

    // Run project-level validator if available
    try {
      const validation = validateOutput(html)
      if (validation?.valid && validation?.html) {
        html = validation.html
      } else if (validation && !validation.valid) {
        console.warn('[refine] validateOutput failed:', validation?.error)
        // Don't crash — use sanitized version
      }
    } catch (validationError) {
      console.warn('[refine] validateOutput threw:', validationError?.message)
    }

    // ── 8. Final safety check ──────────────────────────────────────────────────
    if (!isSafeFragment(html)) {
      console.error('[refine] Output failed safety check. Raw:', rawOutput.substring(0, 300))
      // Last resort: return original section unchanged rather than broken HTML
      return Response.json(
        {
          html: sectionHtml,
          warning: 'Refinement produced invalid output. The section was not changed. Try rephrasing your request.',
        },
        { status: 200 }
      )
    }

    // ── 9. Return ─────────────────────────────────────────────────────────────
    return Response.json({ html })

  } catch (err) {
    console.error('[refine] Unhandled error:', err)
    return Response.json(
      { error: err?.message || 'Unknown server error' },
      { status: 500 }
    )
  }
}