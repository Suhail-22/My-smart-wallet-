import React, { useState, useRef } from 'react';
import { Camera, Loader2, Image as ImageIcon } from 'lucide-react';

interface OCRUploaderProps {
  onScanComplete: (data: { amount: number; date: string; description: string; category: string }) => void;
}

export const OCRUploader: React.FC<OCRUploaderProps> = ({ onScanComplete }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeReceiptImage = async (base64Image: string): Promise<{
    amount: number;
    date: string;
    description: string;
    category: string;
  } | null> => {
    // محاكاة لتحليل الصورة باستخدام الذكاء الاصطناعي
    // في الإصدار الحقيقي، سيتم استدعاء Gemini API هنا
    
    try {
      // محاكاة التأخير في المعالجة
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // بيانات وهمية للاختبار
      return {
        amount: Math.floor(Math.random() * 500) + 50,
        date: new Date().toISOString().split('T')[0],
        description: getRandomDescription(),
        category: getRandomCategory()
      };
    } catch (error) {
      console.error('Error analyzing receipt:', error);
      return null;
    }
  };

  const getRandomDescription = () => {
    const descriptions = [
      'شراء بقالة من السوبرماركت',
      'فاتورة مطعم',
      'تسوق ملابس',
      'دفع فاتورة كهرباء',
      'تعبئة وقود',
      'رسوم اشتراك إنترنت',
      'دفع فاتورة هاتف',
      'شراء أدوية من الصيدلية',
      'تسوق إلكترونيات',
      'دفع فواتير المياه'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const getRandomCategory = () => {
    const categories = [
      'الطعام',
      'التسوق',
      'الفواتير',
      'المواصلات',
      'الصحة',
      'الترفيه',
      'المنزل',
      'التعليم'
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // استخراج الجزء الأساسي من base64
        const base64Data = base64String.split(',')[1] || base64String;
        
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
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-dark-800 text-primary-700 dark:text-primary-300 p-4 rounded-xl hover:bg-primary-100 dark:hover:bg-dark-700 transition disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>جاري التحليل بالذكاء الاصطناعي...</span>
          </>
        ) : (
          <>
            <Camera size={20} />
            <span>مسح إيصال / فاتورة (AI)</span>
          </>
        )}
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
        قم بتحميل صورة الإيصال لتحليلها تلقائياً باستخدام الذكاء الاصطناعي
      </p>
    </div>
  );
};