import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_BACKUP,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY4,
  process.env.GEMINI_API_KEY5,
  process.env.GEMINI_API_KEY6,
  process.env.GEMINI_API_KEY7
].filter(Boolean);

export async function callGemini(prompt, model = "gemini-2.5-flash") {
  let lastError;
  
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const genAI = new GoogleGenerativeAI(API_KEYS[i]);
      const generativeModel = genAI.getGenerativeModel({ model });
      
      console.log(`📡 Calling Gemini API (Key ${i + 1}/${API_KEYS.length}) with prompt length:`, prompt.length);

      const result = await generativeModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("✅ Gemini response received, length:", text.length);
      return text;
    } catch (error) {
      console.error(`❌ Gemini API Key ${i + 1} failed:`, error.message);
      lastError = error;
      // Continue to next key if this one fails
    }
  }

  throw new Error(`Gemini API failed on all keys. Last error: ${lastError?.message}`);
}

// Alternative: Use streaming for longer responses
export async function callGeminiStream(prompt, onChunk, model = "gemini-1.5-pro") {
  let lastError;
  
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const genAI = new GoogleGenerativeAI(API_KEYS[i]);
      const generativeModel = genAI.getGenerativeModel({ model });
      
      console.log(`📡 Calling Gemini API Stream (Key ${i + 1}/${API_KEYS.length})`);
      
      const result = await generativeModel.generateContentStream(prompt);

      let fullText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        if (onChunk) onChunk(chunkText);
      }

      return fullText;
    } catch (error) {
      console.error(`❌ Gemini stream Key ${i + 1} failed:`, error.message);
      lastError = error;
    }
  }
  
  throw new Error(`Gemini stream failed on all keys. Last error: ${lastError?.message}`);
}