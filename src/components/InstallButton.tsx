import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

// تعريف النوع لحدث beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// تعريف للنافذة الموسعة
declare global {
  interface Window {
    MSStream?: unknown;
  }
}

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // الكشف عن iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);
    
    // الكشف عن تطبيق مثبت
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // إذا كان مثبتاً بالفعل، لا تعرض الزر
    if (standalone) {
      console.log('التطبيق مثبت بالفعل');
      return;
    }

    // استمع لحدث التثبيت (لـ Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // إذا كان iOS ولم يكن مثبتاً، اعرض الزر بعد تأخير
    if (ios && !standalone) {
      setTimeout(() => setShowButton(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // إرشادات تثبيت iOS
      alert(`
📱 تثبيت التطبيق على iPhone/iPad:

1. انقر على زر المشاركة (⏍) في Safari
2. مرر لأسفل واختر "أضف إلى الشاشة الرئيسية"
3. انقر على "إضافة"

بعد التثبيت، سيكون التطبيق متاحاً على الشاشة الرئيسية.
      `);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('تم قبول التثبيت');
          setShowButton(false);
          setDeferredPrompt(null);
        }
      } catch (error) {
        console.error('حدث خطأ أثناء التثبيت:', error);
      }
    }
  };

  if (!showButton || isStandalone) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-primary-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 animate-pulse"
    >
      <Download className="w-5 h-5" />
      <span className="font-bold">📱 تثبيت التطبيق</span>
    </button>
  );
};

export default InstallButton;