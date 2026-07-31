import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini/geminiclient';
import { parseIntent } from '@/lib/gemini/intentParser';
import { buildPrompt } from '@/lib/gemini/promptBuilder';
import { validateOutput } from '@/lib/gemini/outputValidator';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using service role key
// This bypasses RLS and works in API routes
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request) {
  try {
    const { prompt, userId, templateId } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    console.log("🚀 Starting generation for prompt:", prompt.substring(0, 100));
    
    // Parse intent with safe fallback
    let intent;
    try {
      intent = parseIntent(prompt);
      console.log("Intent parsed:", intent);
    } catch (intentError) {
      console.error("Intent parsing failed:", intentError);
      intent = {
        industry: 'general',
        style: 'modern',
        sections: ['header', 'hero', 'content', 'footer'],
        colors: ['#ffffff', '#333333']
      };
    }
    
    // Build prompt
    const geminiPrompt = buildPrompt(prompt, intent);
    console.log("Prompt built, length:", geminiPrompt.length);
    
    // Call Gemini
    let generatedHTML;
    try {
      generatedHTML = await callGemini(geminiPrompt);
      console.log("Gemini success, HTML length:", generatedHTML?.length || 0);
    } catch (geminiError) {
      console.error("Gemini failed:", geminiError);
      generatedHTML = null;
    }
    
    // Validate output or use local fallback
    let finalHTML;
    if (generatedHTML) {
      finalHTML = validateOutput(generatedHTML);
    } else {
      finalHTML = validateOutput(null); // original emergency fallback
    }
    console.log("Final HTML length:", finalHTML.length);
    
    // Save to Supabase using service role key
    let websiteId = null;
    try {
      const supabaseAdmin = getSupabaseAdmin()
      
      // Check if service role key exists
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY not set - skipping DB save")
      } else {
        // Generate a URL-friendly slug
        const safeIndustry = intent.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const randomString = Math.random().toString(36).substring(2, 6);
        const generatedSlug = `${safeIndustry}-${randomString}`;

        const { data, error } = await supabaseAdmin
          .from('websites')
          .insert({
            user_id: userId || null,
            title: `Generated - ${intent.industry}`,
            html: finalHTML,
            source: 'generated',
            template_id: templateId || null,
            slug: generatedSlug
          })
          .select('id, slug')
          .single()

        if (error) {
          console.warn("DB save failed:", error.message)
        } else {
          websiteId = data.id
          console.log("✅ Saved to DB with ID:", websiteId)

          // Save prompt record
          await supabaseAdmin
            .from('prompts')
            .insert({
              website_id: websiteId,
              user_id: userId || null,
              original_prompt: prompt,
              refined_prompts: []
            })
          console.log("✅ Prompt saved")
        }
      }
    } catch (dbError) {
      console.warn("DB error:", dbError.message)
    }

    return NextResponse.json({
      websiteId: websiteId || `temp_${Date.now()}`,
      html: finalHTML,
      intent: intent,
      generated: !!generatedHTML,
      savedToDB: !!websiteId
    });
    
  } catch (error) {
    console.error("Fatal error:", error);
    return NextResponse.json({
      websiteId: null,
      html: getEmergencyTemplate(),
      error: error.message,
      intent: { industry: 'general', style: 'modern', sections: ['header', 'content', 'footer'] }
    });
  }
}

function getEmergencyTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Website Generator</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        h1 { color: #333; }
        .alert { background: #fee; color: #c00; padding: 15px; border-radius: 10px; margin: 20px 0; }
        button { background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✨ Website Generator</h1>
        <div class="alert">
            <strong>Note:</strong> This is a fallback template. The AI generation is being set up.
        </div>
        <p>Your request is being processed. Please try again in a moment.</p>
        <button onclick="location.reload()">Try Again</button>
    </div>
</body>
</html>`;
}