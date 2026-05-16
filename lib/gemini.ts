import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

export function getGeminiClient() {
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

export async function generateWithGemini(
  prompt: string,
  fallback: string
): Promise<string> {
  const client = getGeminiClient();
  if (!client) {
    console.warn('GEMINI_API_KEY not set, using fallback');
    return fallback;
  }
  const model = client.getGenerativeModel({
    model: 'gemini-1.5-flash'
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
