// src/components/Layout.tsx - النسخة المحدثة والنهائية

import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle,
  CreditCard, 
  TrendingUp, 
  Settings, 
  Calendar,
  Wallet,
  PieChart,
  Moon,
  Sun,
  Menu,
  X,
  Target,
  ArrowRightLeft,
  HelpCircle,
  LogOut,
  MenuSquare,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import InstallButton from './InstallButton';
import { TransactionForm } from '../pages/TransactionForm'; 

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useApp();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false); 

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile, isSidebarOpen]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const menuItems = [
    { path: '/', label: 'الرئيسية', icon: Home },
    { path: '/transactions', label: 'المعاملات', icon: ClipboardList },
    { path: '/budget', label: 'الميزانية', icon: Target },
    { path: '/wallets', label: 'المحافظ', icon: Wallet },
    { path: '/debts', label: 'الديون والمدينات', icon: ArrowRightLeft },
    { path: '/investments', label: 'الاستثمارات', icon: TrendingUp },
    { path: '/settings', label: 'الإعدادات', icon: Settings },
    { path: '/help', label: 'المساعدة', icon: HelpCircle },
  ];

  return (
    <div className={`flex flex-col h-screen max-w-lg mx-auto ${theme === 'dark' ? 'dark' : ''}`}>
      {/* الشريط العلوي الثابت */}
      <header className='fixed top-0 left-0 right-0 max-w-lg mx-auto bg-white dark:bg-dark-800 shadow-md z-40 p-4 flex items-center justify-between'>
        {/* زر الإعدادات (الترس) */}
        <Link to="/settings" className='text-gray-600 dark:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition' title='الإعدادات'>
          <Settings size={24} />
        </Link>
        <h1 className='text-xl font-bold text-gray-800 dark:text-white'>محفظتي الذكية</h1>
        <InstallButton />
      </header>

      {/* الشريط الجانبي */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-dark-900 shadow-xl transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 border-b pb-3 border-gray-100 dark:border-dark-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">القائمة</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
              title='إغلاق'
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center p-3 rounded-xl transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                <item.icon size={20} className="ml-3" />
                <span className='font-medium'>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={20} className="text-yellow-500" />
                  <span className="font-medium">الوضع النهاري</span>
                </>
              ) : (
                <>
                  <Moon size={20} className="text-blue-400" />
                  <span className="font-medium">الوضع الليلي</span>
                </>
              )}
            </button>
            <button
              onClick={() => console.log('Logout')}
              className="flex items-center justify-center gap-2 w-full p-3 mt-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition"
            >
              <LogOut size={20} />
              <span className='font-medium'>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {children}
      </main>

      {/* شريط التنقل السفلي */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white dark:bg-dark-900 shadow-xl z-50">
        <div className="flex justify-around items-center p-2">
          {/* زر الديون */}
          <Link to="/debts" className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === '/debts' ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300'}`}>
            <Users size={24} />
            <span className="text-xs mt-1">الديون</span>
          </Link>

          {/* زر المحافظ */}
          <Link to="/wallets" className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === '/wallets' ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300'}`}>
            <Wallet size={24} />
            <span className="text-xs mt-1">المحافظ</span>
          </Link>

          {/* زر الزائد (+) في المنتصف */}
          <button
            onClick={() => setIsTransactionFormOpen(true)}
            className="bg-primary-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl"
          >
            <PlusCircle size={30} strokeWidth={2.5} />
          </button>

          {/* زر الميزانية */}
          <Link to="/budget" className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === '/budget' ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300'}`}>
            <PieChart size={24} />
            <span className="text-xs mt-1">الميزانية</span>
          </Link>

          {/* زر الرئيسية */}
          <Link to="/" className={`flex flex-col items-center p-2 rounded-lg ${location.pathname === '/' ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300'}`}>
            <Target size={24} />
            <span className="text-xs mt-1">الرئيسية</span>
          </Link>
        </div>
      </div>

      {/* نافذة نموذج المعاملة المنبثقة (Modal) */}
      {isTransactionFormOpen && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-end md:items-center justify-center transition-opacity duration-300">
          <div className="bg-white dark:bg-dark-900 rounded-t-2xl md:rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative p-6 shadow-2xl animate-slide-up md:animate-zoom-in">
            <TransactionForm onClose={() => setIsTransactionFormOpen(false)} /> 
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;