
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

export interface ImageInput {
  base64: string;
  mimeType: string;
}

export const parseMenuImages = async (images: ImageInput[]): Promise<MenuItem[]> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API Key 缺失。請在 Vercel 設定環境變數並執行 Redeploy。");
  }

  // 每次呼叫時初始化，確保讀取最新狀態
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = "這是同一份菜單的幾張照片（可能含手寫）。請整合所有圖片內容，精準翻譯並轉成 JSON 格式。包含：name_jp (日文), name_zh (繁體中文), price (數字), description (口味或成分, 10字內)。若有重複項目請自動合併。";

  try {
    // 建構多張圖片的 payload
    const imageParts = images.map(img => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64
      }
    }));

    const response = await ai.models.generateContent({
      // 使用 Flash 模型，速度快且支援多模態輸入
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          ...imageParts,
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

    const text = response.text || "{\"items\":[]}";
    const result = JSON.parse(text);
    return (result.items || []).map((item: any, index: number) => ({
      ...item,
      id: `item-${index}-${Date.now()}`
    }));
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    if (error.message?.includes('API key')) {
      throw new Error("API Key 無效或未授權，請檢查 Vercel 設定。");
    }
    
    throw new Error(`Gemini 錯誤 (${error.status || 'Unknown'}): ${error.message || '服務繁忙，請稍後再試。'}`);
  }
};
