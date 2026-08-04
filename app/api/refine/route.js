import { validateOutput } from '@/lib/gemini/outputValidator'
import { supabase } from '@/lib/supabase/client'
import { callGemini } from '@/lib/gemini/geminiclient'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(req) {
  try {
    const {
      websiteId,
      refinement,
      sectionHtml,
      userId
    } = await req.json()

    console.log('=== REFINE REQUEST ===')
    console.log('websiteId:', websiteId)
    console.log('userId:', userId)
    console.log('sectionHtml length:', sectionHtml?.length)

    const prompt = `
You are a professional UI designer.

Current HTML section:

${sectionHtml}

User request:

${refinement}

STRICT RULES:
- Return ONLY valid HTML
- Return ONLY the updated section
- Do NOT return a full HTML page
- No markdown
- No backticks
- No explanations
- Preserve layout unless the request requires changing it
- Keep responsive design
- Use clean semantic HTML

Return ONLY raw HTML.
`.trim()

    const rawHtml = await callGemini(prompt, 'gemini-2.5-flash')

    if (!rawHtml) {
      return Response.json(
        {
          error: `Gemini returned no HTML.`
        },
        { status: 500 }
      )
    }

    console.log('=== RAW HTML ===')
    console.log(rawHtml.substring(0, 500))

    let html = rawHtml

    try {
      const validation = validateOutput(rawHtml)

      if (validation?.valid) {
        html = validation.html
      } else {
        console.warn('Validation failed:', validation?.error)
      }
    } catch (validationError) {
      console.error(
        'Validation Error:',
        validationError
      )
    }

    // Save refinement to history
    if (websiteId) {
      try {
        const adminClient = getSupabaseAdmin();
        if (adminClient) {
          const { data } = await adminClient
            .from('prompts')
            .select('refined_prompts')
            .eq('website_id', websiteId)
            .single();

          if (data) {
            const currentRefined = Array.isArray(data.refined_prompts) ? data.refined_prompts : [];
            await adminClient
              .from('prompts')
              .update({ refined_prompts: [...currentRefined, refinement] })
              .eq('website_id', websiteId);
          }
        }
      } catch (dbError) {
        console.error('Failed to save refinement to db:', dbError.message);
      }
    }

    return Response.json({
      html
    })
  } catch (err) {
    console.error('=== REFINE ERROR ===')
    console.error(err)

    return Response.json(
      {
        error:
          err?.message || 'Unknown server error'
      },
      { status: 500 }
    )
  }
}