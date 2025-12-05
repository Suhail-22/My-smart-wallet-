import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, // الأيقونة التي سنستخدمها لزر الزائد
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
  ArrowRightLeft, // للمدينات
  HelpCircle,
  LogOut, // لتسجيل الخروج
  MenuSquare,
  ClipboardList
} from 'lucide-react'; // تم تصحيح استيراد الأيقونات
import { useApp } from '../context/AppContext';
import InstallButton from './InstallButton';
// استيراد نموذج المعاملة
import { TransactionForm } from '../pages/TransactionForm'; 

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useApp();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // *** تم إضافة هذه الحالة الجديدة لفتح وإغلاق نموذج المعاملة (FAB Modal) ***
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false); 

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
    { path: '/', label: 'الرئيسية', icon: Home },
    // تم إزالة خيار 'إضافة معاملة' من القائمة الجانبية لأنه سيتم عبر الزر العائم
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
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className='text-gray-600 dark:text-gray-300 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition'
          title='القائمة'
        >
          <Menu size={24} />
        </button>
        <h1 className='text-xl font-bold text-gray-800 dark:text-white'>محفظتي الذكية</h1>
        <InstallButton />
      </header>

      {/* الشريط الجانبي (القائمة) */}
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

          {/* الثيم والفوتر */}
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
              onClick={() => console.log('Logout')} // أضف منطق تسجيل الخروج هنا
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
        {/* غطاء شفاف لإغلاق الشريط الجانبي على الجوال */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {children}
      </main>
      
      {/* *** الزر العائم (Floating Action Button - FAB) *** */}
      {/* تم وضعه في أسفل الوسط ليكون كالواجهة القديمة */}
      <button
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-primary-500 text-white rounded-full shadow-2xl shadow-primary-500/50 z-30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        onClick={() => setIsTransactionFormOpen(true)}
        title='إضافة معاملة جديدة'
      >
        <PlusCircle size={30} strokeWidth={2.5} />
      </button>

      {/* *** نافذة نموذج المعاملة المنبثقة (Modal) *** */}
      {isTransactionFormOpen && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-end md:items-center justify-center transition-opacity duration-300">
          <div className="bg-white dark:bg-dark-900 rounded-t-2xl md:rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative p-6 shadow-2xl animate-slide-up md:animate-zoom-in">
            {/* تم تمرير onClose كخاصية مطلوبة */}
            <TransactionForm onClose={() => setIsTransactionFormOpen(false)} /> 
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
