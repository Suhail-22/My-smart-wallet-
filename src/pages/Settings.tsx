// src/pages/Settings.tsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Moon, Sun, Smartphone, Fingerprint, Shield, 
  Mail, Upload, Download, Palette, 
  ChevronRight, User, LogOut 
} from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, setTheme } = useApp();
  const [email, setEmail] = useState<string>('');
  const [biometricAuth, setBiometricAuth] = useState<boolean>(false);
  const [autoLock, setAutoLock] = useState<'off' | '30s' | '1m' | '5m'>('off');

  // دوال وهمية مؤقتة — يمكنك ربطها بالـ backend لاحقًا
  const handleSaveEmail = () => {
    alert(`تم حفظ البريد: ${email}`);
  };

  const toggleBiometricAuth = () => {
    setBiometricAuth(!biometricAuth);
    alert(biometricAuth ? 'تم تعطيل المصادقة البيومترية' : 'تم تفعيل المصادقة البيومترية');
  };

  return (
    <div className="p-4 pt-20 pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">الإعدادات</h1>

      {/* === الحساب والمزامنة === */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <h2 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
          <User size={18} /> الحساب
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">البريد الإلكتروني</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="flex-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleSaveEmail}
                className="bg-blue-500 text-white px-3 rounded-lg"
              >
                حفظ
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              لاستلام نسخ احتياطية وتقارير دورية
            </p>
          </div>
        </div>
      </div>

      {/* === الخصوصية والأمان === */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <h2 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
          <Shield size={18} /> الخصوصية والأمان
        </h2>
        <div className="space-y-4">
          {/* المصادقة البيومترية */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Fingerprint className="text-blue-500" size={20} />
              <div>
                <p className="font-medium">المصادقة البيومترية</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">استخدم البصمة أو الوجه لفتح التطبيق</p>
              </div>
            </div>
            <button
              onClick={toggleBiometricAuth}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${biometricAuth ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${biometricAuth ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* القفل التلقائي */}
          <div>
            <p className="font-medium">قفل التطبيق تلقائيًا</p>
            <select
              value={autoLock}
              onChange={(e) => setAutoLock(e.target.value as any)}
              className="mt-2 w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="off">لا</option>
              <option value="30s">بعد 30 ثانية</option>
              <option value="1m">بعد دقيقة</option>
              <option value="5m">بعد 5 دقائق</option>
            </select>
          </div>
        </div>
      </div>

      {/* === العرض والمظهر === */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <h2 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
          <Palette size={18} /> العرض والمظهر
        </h2>
        <div className="space-y-3">
          <button
            onClick={() => setTheme('light')}
            className={`w-full flex justify-between items-center p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700'}`}
          >
            <span>الوضع النهاري</span>
            {theme === 'light' && <Sun className="text-yellow-500" size={20} />}
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`w-full flex justify-between items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700'}`}
          >
            <span>الوضع الليلي</span>
            {theme === 'dark' && <Moon className="text-blue-400" size={20} />}
          </button>
          <button
            onClick={() => setTheme('system')}
            disabled
            className="w-full flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
          >
            <span>اتبع إعدادات النظام</span>
            <Smartphone size={20} />
          </button>
        </div>
      </div>

      {/* === البيانات === */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <h2 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4">
          <Upload size={18} /> النسخ الاحتياطي والبيانات
        </h2>
        <div className="space-y-3">
          <button className="w-full flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            <span>تصدير البيانات (PDF / Excel)</span>
            <Download size={20} />
          </button>
          <button className="w-full flex justify-between items-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
            <span>استيراد بيانات من ملف</span>
            <Upload size={20} />
          </button>
        </div>
      </div>

      {/* === التخصيص المتقدم === */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
        <h2 className="font-bold text-gray-700 dark:text-gray-300 mb-4">التخصيص المتقدم</h2>
        <a
          href="#/settings/categories"
          className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <span>إدارة الرموز والفئات</span>
          <ChevronRight size={20} className="text-gray-400" />
        </a>
      </div>

      {/* === تسجيل الخروج === */}
      <div className="pt-4">
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium">
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Settings;