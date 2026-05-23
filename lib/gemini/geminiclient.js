import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the working key from your test.html
const WORKING_API_KEY = " ";

// Initialize the client with working key
const genAI = new GoogleGenerativeAI(WORKING_API_KEY);

export async function callGemini(prompt, model = "gemini-2.5-flash") {
  try {
    console.log("📡 Calling Gemini API with prompt length:", prompt.length);
    
    // Get the model
    const generativeModel = genAI.getGenerativeModel({ model });
    
    // Generate content
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ Gemini response received, length:", text.length);
    return text;
    
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    throw new Error(`Gemini API failed: ${error.message}`);
  }
}

// Alternative: Use streaming for longer responses
export async function callGeminiStream(prompt, onChunk, model = "gemini-pro") {
  try {
    const generativeModel = genAI.getGenerativeModel({ model });
    const result = await generativeModel.generateContentStream(prompt);
    
    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) onChunk(chunkText);
    }
    
    return fullText;
  } catch (error) {
    console.error("❌ Gemini stream error:", error);
    throw error;
  }
}