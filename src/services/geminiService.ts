// geminiService.ts - بدون استخدام @google/genai
export async function analyzeReceiptImage(imageBase64: string): Promise<string> {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';
  
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: "Extract the total amount, date, and merchant name from this receipt. Return the data in JSON format with keys: total, date, merchant."
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: imageBase64
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    throw error;
  }
}