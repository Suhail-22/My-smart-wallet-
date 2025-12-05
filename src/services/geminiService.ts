// هذا الملف سيكون متاحاً عندما تضيف مفتاح API من Google Gemini
// يمكنك الحصول على المفتاح من: https://makersuite.google.com/app/apikey

interface GeminiAnalysisResult {
  amount: number;
  date: string;
  description: string;
  category: string;
}

export const analyzeReceiptImage = async (base64Image: string): Promise<GeminiAnalysisResult | null> => {
  try {
    // تحقق من وجود مفتاح API
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Gemini API key is not configured');
      return null;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "قم بتحليل صورة الإيصال واعطيني البيانات التالية بتنسيق JSON: المبلغ، التاريخ، الوصف، والفئة. الفئات المتاحة: الطعام، التسوق، الفواتير، المواصلات، الصحة، الترفيه، المنزل، التعليم، أخرى." },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // استخراج JSON من النص
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
};