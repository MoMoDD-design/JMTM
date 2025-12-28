import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert Japanese translator and OCR specialist capable of reading complex handwritten Japanese menus (Izakaya, Sushi, traditional styles).
Your task is to identify menu items from an image and return them in a structured JSON format.
Translate the Japanese name to Traditional Chinese (Taiwan usage).
If a price is visible, extract it (format as string, e.g. "500", "時価"). If not found, use "-".
Add a very brief description (max 10 words) in Traditional Chinese explaining what the dish is if the name isn't obvious, otherwise leave empty.
`;

export const parseMenuImage = async (base64Image: string): Promise<MenuItem[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-pro-preview for best OCR and reasoning on handwriting
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Extract all menu items from this image. Return strictly JSON."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name_jp: { type: Type.STRING, description: "Original Japanese name from menu" },
                  name_zh: { type: Type.STRING, description: "Traditional Chinese translation" },
                  price: { type: Type.STRING, description: "Price of the item" },
                  description: { type: Type.STRING, description: "Short description of ingredients or style" },
                  category: { type: Type.STRING, description: "Category like 'Drink', 'Food', 'Dessert' if inferable" }
                },
                required: ["name_jp", "name_zh", "price"]
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No text returned from Gemini");

    const parsed = JSON.parse(jsonText);
    
    // Add unique IDs to items for React keys
    return parsed.items.map((item: any, index: number) => ({
      ...item,
      id: `item-${index}-${Date.now()}`
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};