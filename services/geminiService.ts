
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

export const parseMenuImage = async (base64Image: string, mimeType: string = "image/jpeg"): Promise<MenuItem[]> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API Key 缺失。請在 Vercel 設定環境變數並執行 Redeploy。");
  }

  // 每次呼叫時初始化，確保讀取最新狀態
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = "辨識這張日文菜單照片（可能含手寫）。請精準翻譯並轉成 JSON 格式。包含：name_jp (日文), name_zh (繁體中文), price (數字), description (口味或成分, 10字內)。";

  try {
    const response = await ai.models.generateContent({
      // 改用 Flash 模型，速度更快且配額較寬鬆，適合大多數圖像辨識任務
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          // 使用傳入的 mimeType，避免因格式錯誤導致的解析失敗
          { inlineData: { mimeType: mimeType, data: base64Image } },
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
    
    // 如果是 API Key 相關錯誤
    if (error.message?.includes('API key')) {
      throw new Error("API Key 無效或未授權，請檢查 Vercel 設定。");
    }
    
    // 拋出真實的錯誤訊息，方便除錯
    throw new Error(`Gemini 錯誤 (${error.status || 'Unknown'}): ${error.message || '服務繁忙，請稍後再試。'}`);
  }
};
