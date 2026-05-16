import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini/geminiclient';
import { parseIntent } from '@/lib/gemini/intentParser';
import { buildPrompt } from '@/lib/gemini/promptBuilder';
import { validateOutput } from '@/lib/gemini/outputValidator';

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
    
    // Validate output (will return default template if validation fails)
    const finalHTML = validateOutput(generatedHTML);
    console.log("Final HTML length:", finalHTML.length);
    
    // Return response WITHOUT database save for now (to test)
    // Database save will be added after fixing Supabase server client
    
    return NextResponse.json({
      websiteId: `temp_${Date.now()}`,
      html: finalHTML,
      intent: intent,
      generated: !!generatedHTML,
      note: "Website generated successfully! Save feature coming soon."
    });
    
  } catch (error) {
    console.error("Fatal error:", error);
    
    // Return a fallback HTML so the user sees something
    const fallbackHTML = getEmergencyTemplate();
    
    return NextResponse.json({
      websiteId: null,
      html: fallbackHTML,
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