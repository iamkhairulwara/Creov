import { validateOutput } from '@/lib/gemini/outputValidator'
import { supabase } from '@/lib/supabase/client'

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
    console.log('Gemini key exists:', !!process.env.GEMINI_API_KEY)

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

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    )

    const geminiData = await geminiResponse.json()

    console.log('=== GEMINI RESPONSE ===')
    console.log('Status:', geminiResponse.status)
    console.log(JSON.stringify(geminiData, null, 2))

    // Gemini API returned an error
    if (geminiData.error) {
      return Response.json(
        {
          error: `Gemini Error: ${geminiData.error.message}`
        },
        { status: 500 }
      )
    }

    const rawHtml =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawHtml) {
      return Response.json(
        {
          error: `Gemini returned no HTML. Response: ${JSON.stringify(
            geminiData
          )}`
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