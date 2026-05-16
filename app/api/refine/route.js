import { validateOutput } from '@/lib/gemini/outputValidator'
import { supabase } from '@/lib/supabase/client'

export async function POST(req) {
  try {
    const { websiteId, refinement, currentHtml, userId } = await req.json()

    const prompt = `
You are editing an existing website.
Here is the current HTML:

${currentHtml}

The user wants this change: "${refinement}"

STRICT RULES:
- Return ONLY the complete updated HTML
- Keep everything the user did NOT ask to change
- NO markdown, NO backticks, NO explanations
- Return the full HTML document
    `.trim()

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const geminiData = await geminiResponse.json()
    const rawHtml = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawHtml) {
      return Response.json(
        { error: 'Gemini returned empty response' },
        { status: 500 }
      )
    }

    const { valid, html, error } = validateOutput(rawHtml)
    if (!valid) {
      return Response.json({ error }, { status: 400 })
    }

    // Update website in Supabase
    await supabase
      .from('websites')
      .update({ html })
      .eq('id', websiteId)

    // Append refinement to prompts table
    const { data: existingPrompt } = await supabase
      .from('prompts')
      .select('refined_prompts')
      .eq('website_id', websiteId)
      .single()

    if (existingPrompt) {
      const updated = [...(existingPrompt.refined_prompts || []), refinement]
      await supabase
        .from('prompts')
        .update({ refined_prompts: updated })
        .eq('website_id', websiteId)
    }

    return Response.json({ html })

  } catch (err) {
    return Response.json(
      { error: 'Something went wrong: ' + err.message },
      { status: 500 }
    )
  }
}