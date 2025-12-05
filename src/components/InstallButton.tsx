import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

// إضافة تعريفات TypeScript
declare global {
  interface Window {
    MSStream?: any;
  }
  interface Navigator {
    standalone?: boolean;
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // التحقق مما إذا كان التطبيق مثبتاً بالفعل
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    if (isStandalone) {
      console.log('التطبيق مثبت بالفعل');
      return;
    }

    // استمع لحدث التثبيت
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // الكشف عن iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !(window.navigator as any).standalone) {
      setShowButton(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // الكشف عن الجهاز
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
      // إرشادات تثبيت iOS
      alert(`
📱 تثبيت التطبيق على iPhone/iPad:
1. انقر على زر المشاركة (⎋)
2. مرر لأسفل واختر "أضف إلى الشاشة الرئيسية"
3. انقر على "إضافة"

بعد التثبيت، سيكون التطبيق متاحاً على الشاشة الرئيسية.
      `);
      return;
    }

    if (isAndroid && deferredPrompt) {
      try {
        deferredPrompt.prompt();
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

  if (!showButton) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-primary-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
    >
      <Download className="w-5 h-5" />
      <span className="font-bold">📱 تثبيت التطبيق</span>
    </button>
  );
};

export default InstallButton;