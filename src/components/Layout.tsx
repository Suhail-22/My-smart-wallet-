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
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import InstallButton from './InstallButton';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useApp();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // كشف حجم الشاشة
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // إغلاق الشريط الجانبي عند تغيير الصفحة على الجوال
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile, isSidebarOpen]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const menuItems = [
    { path: '/', label: 'الرئيسية', icon: <Home size={20} /> },
    { path: '/add', label: 'إضافة معاملة', icon: <PlusCircle size={20} /> },
    { path: '/transactions', label: 'المعاملات', icon: <CreditCard size={20} /> },
    { path: '/budget', label: 'الميزانية', icon: <PieChart size={20} /> },
    { path: '/wallets', label: 'المحافظ', icon: <Wallet size={20} /> },
    { path: '/debts', label: 'الديون', icon: <Calendar size={20} /> },
    { path: '/investments', label: 'الاستثمارات', icon: <TrendingUp size={20} /> },
    { path: '/zakat', label: 'الزكاة', icon: <Target size={20} /> },
    { path: '/settings', label: 'الإعدادات', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-800 dark:text-dark-200 flex flex-col md:flex-row">
      {/* زر القائمة للجوال */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-xl"
        aria-label="فتح القائمة"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* شريط عنوان للجوال */}
      <div className="md:hidden fixed top-0 right-0 left-0 z-40 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 p-4 flex items-center justify-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Wallet className="text-white" size={18} />
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">محفظتي الذكية</h1>
        </div>
      </div>

      {/* الشريط الجانبي */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:relative
        top-0 bottom-0
        w-64 md:w-56 h-full
        bg-white dark:bg-dark-800
        shadow-xl md:shadow-none
        z-40
        transition-transform duration-300 ease-in-out
        flex flex-col
        mt-16 md:mt-0
      `}>
        {/* رأس الشريط الجانبي (للشاشات الكبيرة) */}
        <div className="hidden md:flex p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Wallet className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">محفظتي الذكية</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">إدارة مالية ذكية</p>
            </div>
          </div>
        </div>

        {/* قائمة التنقل */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => {
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-colors
                    ${location.pathname === item.path
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* تذييل الشريط الجانبي */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
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
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              الإصدار 1.0.0
            </p>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        {/* غطاء شفاف لإغلاق الشريط الجانبي على الجوال */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children || <Outlet />}
        </div>
      </main>

      {/* زر التثبيت */}
      <InstallButton />
    </div>
  );
};

export default Layout;