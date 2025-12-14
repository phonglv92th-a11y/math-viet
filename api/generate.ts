
import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold } from "@google/genai";

export const config = {
  runtime: 'edge', 
};

const problemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The question text. For Math, use LaTeX wrapped in $ signs for formulas.",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 4 possible answers.",
    },
    correctAnswerIndex: {
      type: Type.INTEGER,
      description: "The index (0-3) of the correct answer.",
    },
    explanation: {
      type: Type.STRING,
      description: "A short explanation in Vietnamese.",
    },
    difficulty: {
      type: Type.STRING,
      enum: ["Easy", "Medium", "Hard"],
      description: "The difficulty level.",
    }
  },
  required: ["question", "options", "correctAnswerIndex", "explanation", "difficulty"],
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { prompt, modelId } = await req.json();

    // SERVER-SIDE CHECK: Access API Key securely from Vercel Env
    if (!process.env.API_KEY) {
      console.error("API_KEY is missing in environment variables.");
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Use a safety config that doesn't block educational content unnecessarily
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ];

    const response = await ai.models.generateContent({
      model: modelId || 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: problemSchema
        },
        safetySettings: safetySettings,
        temperature: 0.7,
      },
    });

    if (!response.text) {
        throw new Error("Empty response from AI model");
    }

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate content', details: error.message }), { status: 500 });
  }
}
