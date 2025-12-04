
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, ArrowDown, ArrowUp, HandCoins, Plus, Wallet, PieChart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showFabMenu, setShowFabMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setDefaultTransactionType } = useApp();

  // Desktop Nav Items
  const navItems = [
    { path: '/', label: 'الرئيسية', icon: LayoutDashboard },
    { path: '/budget', label: 'الميزانية', icon: PieChart }, 
    { path: '/wallets', label: 'المحافظ', icon: Wallet },
    { path: '/debts', label: 'الديون', icon: Users },
    { path: '/settings', label: 'الإعدادات', icon: Settings },
  ];

  const handleFabAction = (type: 'INCOME' | 'EXPENSE' | 'DEBT') => {
      setShowFabMenu(false);
      if (type === 'DEBT') {
          navigate('/debts');
      } else {
          setDefaultTransactionType(type === 'INCOME' ? TransactionType.INCOME : TransactionType.EXPENSE);
          navigate('/add');
      }
  };

  return (
    <div className={`${theme} min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 font-sans`}>
      <div className="flex h-screen overflow-hidden">
        
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="fixed inset-y-0 right-0 z-30 w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 hidden lg:block transition-colors">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">محفظتي</h1>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-emerald-50 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 font-bold' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-700">
            <Link 
              to="/add" 
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/30"
            >
              <Plus size={20} />
              <span>معاملة جديدة</span>
            </Link>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Desktop Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between lg:hidden transition-colors">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
               {navItems.find(i => i.path === location.pathname)?.label || 'محفظتي'}
            </h1>
            <Link to="/settings" className="text-gray-500 dark:text-gray-300 hover:text-emerald-600">
              <Settings size={24} />
            </Link>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8 text-gray-800 dark:text-gray-100">
            <div className="max-w-md mx-auto w-full lg:max-w-5xl">
              {children}
            </div>
          </main>
        </div>

        {/* --- MOBILE FAB MENU OVERLAY --- */}
        {showFabMenu && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-end pb-28" onClick={() => setShowFabMenu(false)}>
                <div className="flex flex-col gap-4 w-full max-w-xs px-6">
                    <button onClick={() => handleFabAction('INCOME')} className="bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl flex items-center gap-4 shadow-xl transform transition hover:scale-105">
                        <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full"><ArrowUp size={24}/></div>
                        <span className="font-bold text-lg">تسجيل دخل</span>
                    </button>
                    <button onClick={() => handleFabAction('EXPENSE')} className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-center gap-4 shadow-xl transform transition hover:scale-105">
                        <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full"><ArrowDown size={24}/></div>
                        <span className="font-bold text-lg">تسجيل مصروف</span>
                    </button>
                     <button onClick={() => handleFabAction('DEBT')} className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 p-4 rounded-2xl flex items-center gap-4 shadow-xl transform transition hover:scale-105">
                        <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full"><HandCoins size={24}/></div>
                        <span className="font-bold text-lg">تسجيل دين</span>
                    </button>
                </div>
            </div>
        )}

        {/* --- MOBILE BOTTOM NAVIGATION (Masareef Style) --- */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 pb-safe transition-colors">
          <div className="grid grid-cols-5 items-end h-16 relative">
            
            {/* 1. Home (Right) */}
            <Link 
              to="/"
              className={`flex flex-col items-center justify-center h-full pb-2 ${location.pathname === '/' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <LayoutDashboard size={24} className={location.pathname === '/' ? 'fill-current opacity-20' : ''} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">الرئيسية</span>
            </Link>

            {/* 2. Budget (Right-Center) */}
            <Link 
              to="/budget"
              className={`flex flex-col items-center justify-center h-full pb-2 ${location.pathname === '/budget' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <PieChart size={24} className={location.pathname === '/budget' ? 'fill-current opacity-20' : ''} strokeWidth={location.pathname === '/budget' ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">الميزانية</span>
            </Link>

            {/* 3. FAB (Center) */}
            <div className="relative h-full flex items-center justify-center pointer-events-none">
               <div className="absolute -top-6 pointer-events-auto">
                  <button 
                    onClick={() => setShowFabMenu(!showFabMenu)}
                    className={`bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 border-4 border-gray-50 dark:border-gray-900 transform active:scale-95 transition ${showFabMenu ? 'rotate-45 bg-red-500' : ''}`}
                  >
                    <Plus size={32} />
                  </button>
               </div>
            </div>

            {/* 4. Wallets (Left-Center) */}
             <Link 
              to="/wallets"
              className={`flex flex-col items-center justify-center h-full pb-2 ${location.pathname === '/wallets' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <Wallet size={24} className={location.pathname === '/wallets' ? 'fill-current opacity-20' : ''} strokeWidth={location.pathname === '/wallets' ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">المحافظ</span>
            </Link>

            {/* 5. Debts (Left) */}
            <Link 
              to="/debts"
              className={`flex flex-col items-center justify-center h-full pb-2 ${location.pathname === '/debts' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <Users size={24} className={location.pathname === '/debts' ? 'fill-current opacity-20' : ''} strokeWidth={location.pathname === '/debts' ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">الديون</span>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};
