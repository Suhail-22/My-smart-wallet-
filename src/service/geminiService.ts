import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

// Helper to get AI instance safely
const getAI = () => {
  // Use process.env.API_KEY exclusively as per guidelines.
  // We assume process.env.API_KEY is valid and accessible.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    // console.warn("API Key not found"); 
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeReceiptImage = async (base64Image: string): Promise<{ amount: number; date: string; description: string; category: string } | null> => {
  // Check for internet connection first
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    alert("لا يوجد اتصال بالإنترنت. خدمة تحليل الصور تتطلب اتصالاً نشطاً.");
    return null;
  }

  try {
    const ai = getAI();
    if (!ai) return null;

    const modelId = "gemini-2.5-flash"; 

    const prompt = `
      Analyze this receipt image. Extract the total amount, date, a short description (merchant name), and a category.
      Categories must be one of: "Food", "Transport", "Shopping", "Bills", "Health", "Other".
      Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
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
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING, description: "YYYY-MM-DD format" },
            description: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["amount", "date", "description", "category"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;

  } catch (error) {
    // Suppress console error for cleaner preview experience
    // console.error("Gemini OCR Error:", error); 
    return null;
  }
};

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return "خدمة المساعد المالي تتطلب اتصالاً بالإنترنت.";
  }

  try {
    const ai = getAI();
    if (!ai) return "خدمة الذكاء الاصطناعي غير مفعلة.";
    
    const modelId = "gemini-2.5-flash";

    const summary = transactions.slice(0, 50).map(t => `${t.date}: ${t.type} ${t.amount} (${t.category})`).join('\n');

    const prompt = `
      Based on the following recent financial transactions (in user's local currency), provide a brief, helpful financial insight or tip in Arabic. 
      Focus on spending habits or saving opportunities. Keep it under 50 words. Be encouraging.
      
      Data:
      ${summary}
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "لا توجد بيانات كافية للتحليل حالياً.";
  } catch (error) {
    // Suppress console error
    return "خدمة المساعد المالي غير متاحة حالياً.";
  }
};