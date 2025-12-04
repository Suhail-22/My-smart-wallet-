import React, { useState, useRef } from 'react';
import { Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import { analyzeReceiptImage } from '../services/geminiService';

interface OCRUploaderProps {
  onScanComplete: (data: { amount: number; date: string; description: string; category: string }) => void;
}

export const OCRUploader: React.FC<OCRUploaderProps> = ({ onScanComplete }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Strip prefix (e.g., "data:image/jpeg;base64,") for API if needed, 
        // but @google/genai usually handles the base64 part of inlineData well.
        // The Service expects just the base64 data usually, let's strip if it exists.
        const base64Data = base64String.split(',')[1];
        
        const result = await analyzeReceiptImage(base64Data);
        if (result) {
          onScanComplete(result);
        } else {
          alert('تعذر استخراج البيانات من الصورة. يرجى المحاولة مرة أخرى.');
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('حدث خطأ أثناء المعالجة.');
    }
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-primary-300 bg-primary-50 text-primary-700 p-4 rounded-xl hover:bg-primary-100 transition disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            <span>جاري التحليل بالذكاء الاصطناعي...</span>
          </>
        ) : (
          <>
            <Camera size={20} />
            <span>مسح إيصال / فاتورة (AI)</span>
          </>
        )}
      </button>
    </div>
  );
};