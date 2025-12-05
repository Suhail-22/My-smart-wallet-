import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
}

const InstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // منع المتصفح من عرض رسالة التثبيت التلقائية
      e.preventDefault();
      // حفظ الحدث لاستخدامه لاحقًا
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // عرض زر التثبيت الخاص بنا
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // تحقق مما إذا كان التطبيق مثبتًا بالفعل
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone;
    
    if (isStandalone) {
      setShowButton(false);
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
        console.log('تم تثبيت التطبيق');
        setDeferredPrompt(null);
        setShowButton(false);
      }
    }
  };

  if (!showButton) return null;

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