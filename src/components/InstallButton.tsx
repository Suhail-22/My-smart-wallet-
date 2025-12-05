// src/components/InstallButton.tsx
import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
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
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // الكشف عن iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);
    
    // التعامل مع حدث beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // عرض إرشادات iOS إذا لم يكن التطبيق مثبتاً
    if (ios && !window.navigator.standalone) {
      setTimeout(() => setShowIOSGuide(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('تم قبول التثبيت');
        setDeferredPrompt(null);
      }
    }
  };

  if (isIOS && showIOSGuide) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-dark-800 dark:bg-dark-700 text-white p-4 rounded-xl shadow-2xl border border-primary-500">
        <div className="flex items-start gap-3">
          <Smartphone className="w-6 h-6 mt-1 flex-shrink-0 text-primary-400" />
          <div className="flex-1">
            <h3 className="font-bold text-lg">📱 تثبيت التطبيق على iOS</h3>
            <p className="text-sm mt-1 text-gray-300">
              1. انقر على زر المشاركة <span className="inline-block px-2 bg-gray-700 rounded">⎋</span><br />
              2. مرر لأسفل واختر <span className="text-primary-300">"أضف إلى الشاشة الرئيسية"</span><br />
              3. انقر على <span className="text-primary-300">"إضافة"</span>
            </p>
          </div>
          <button
            onClick={() => setShowIOSGuide(false)}
            className="text-gray-400 hover:text-white text-2xl p-1"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  if (deferredPrompt) {
    return (
      <button
        onClick={handleInstallClick}
        className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-primary-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
      >
        <Download className="w-5 h-5" />
        <span className="font-bold">تثبيت التطبيق</span>
      </button>
    );
  }

  return null;
};

export default InstallButton;