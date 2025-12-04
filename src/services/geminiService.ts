// src/services/geminiService.ts

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Fallback إذا لم يكن Gemini متاحًا
const isGeminiAvailable = API_KEY && typeof window !== 'undefined';

export async function getFinancialAdvice(prompt: string): Promise<string> {
  if (!isGeminiAvailable) {
    // إرجاع نص بديل إذا لم يكن Gemini متاحًا
    return "نصيحة مالية ذكية: حاول توفير 20% من دخلك وادفع ديونك فورًا.";
  }

  try {
    // استيراد ديناميكي لتجنب مشاكل التحزيم
    const { GoogleGenerativeAI } = await import('@google/genai');
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "عذرًا، حدث خطأ في الحصول على النصيحة المالية. حاول مرة أخرى لاحقًا.";
  }
}

export async function analyzeSpendingPattern(transactions: any[]): Promise<string> {
  const prompt = `
    تحليل الأنماط المالية:
    ${JSON.stringify(transactions.slice(0, 10))}
    
    قدم تحليلًا باللغة العربية عن:
    1. أبرز أنماط الصرف
    2. نصائح للتحسين
    3. فرص التوفير
  `;
  
  return getFinancialAdvice(prompt);
}

export async function getInvestmentAdvice(investments: any[]): Promise<string> {
  const prompt = `
    تحليل استثماري:
    ${JSON.stringify(investments)}
    
    قدم نصائح استثمارية باللغة العربية.
  `;
  
  return getFinancialAdvice(prompt);
}