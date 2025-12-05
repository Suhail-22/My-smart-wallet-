import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallButton: React.FC = () => {
  const [showButton, setShowButton] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // كشف إذا كان التطبيق مثبتاً
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
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // عرض الدليل اليدوي بعد 8 ثواني
    const timer = setTimeout(() => {
      const hasSeenGuide = localStorage.getItem('install_guide_seen');
      if (!hasSeenGuide) {
        setShowManualGuide(true);
      }
    }, 8000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowButton(false);
        setShowManualGuide(false);
      }
    }
  };

  const closeManualGuide = () => {
    setShowManualGuide(false);
    localStorage.setItem('install_guide_seen', 'true');
  };

  if (!showButton && !showManualGuide) return null;

  return (
    <>
      {showButton && (
        <button
          onClick={handleInstall}
          className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-primary-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 animate-bounce"
        >
          <Download className="w-5 h-5" />
          <span className="font-bold">📱 تثبيت التطبيق</span>
        </button>
      )}

      {showManualGuide && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-dark-800 shadow-2xl rounded-xl p-4 border border-primary-300 animate-pulse">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-primary-700 dark:text-primary-300">
              📱 كيفية تثبيت التطبيق
            </h3>
            <button 
              onClick={closeManualGuide}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">1.</span>
              <span>انقر على قائمة النقاط الثلاث ⋮ في أعلى المتصفح</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">2.</span>
              <span>اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">3.</span>
              <span>انقر على <strong>"إضافة"</strong></span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-dark-700">
            <p className="text-xs text-gray-500 text-center">
              سيظهر التطبيق كتطبيق عادي على شاشتك الرئيسية
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;