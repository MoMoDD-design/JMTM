
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

export const parseMenuImage = async (base64Image: string): Promise<MenuItem[]> => {
  // Use gemini-3-pro-preview for high-quality multimodal reasoning (OCR + translation)
  // Always use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = "辨識這張日文菜單照片（可能含手寫）。請精準翻譯並轉成 JSON 格式。包含：name_jp (日文), name_zh (繁體中文), price (數字), description (口味或成分, 10字內)。";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name_jp: { type: Type.STRING },
                  name_zh: { type: Type.STRING },
                  price: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["name_jp", "name_zh", "price"]
              }
            }
          }
        }
      }
    });

    // Directly access the .text property of GenerateContentResponse
    const text = response.text || "{\"items\":[]}";
    const result = JSON.parse(text);
    return (result.items || []).map((item: any, index: number) => ({
      ...item,
      id: `item-${index}-${Date.now()}`
    }));
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error("辨識失敗：Gemini 服務暫時無法回應，請稍後重試。");
  }
};
