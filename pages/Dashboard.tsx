
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUp, ArrowDown, Wallet, BellRing, ArrowRight, CreditCard } from 'lucide-react';
import { generateSmartAlerts } from '../services/offlineAIService';
import { TransactionType } from '../types';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { transactions, debts, categories, currency, wallets } = useApp();
  
  // Offline Alerts State
  const [smartAlerts, setSmartAlerts] = useState<string[]>([]);
  
  // --- Expense Summary Calculations ---
  const todayDate = new Date();
  const currentYear = todayDate.getFullYear();
  const todayStr = todayDate.toISOString().split('T')[0];
  
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const currentMonthStr = todayStr.slice(0, 7); // YYYY-MM
  
  // Calculate Start of Week (Saturday as start)
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = (day + 1) % 7; 
    d.setDate(d.getDate() - diff);
    return d.toISOString().split('T')[0];
  };
  const startOfWeekStr = getStartOfWeek(todayDate);

  const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);

  const expenseToday = expenses
    .filter(t => t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseYesterday = expenses
    .filter(t => t.date === yesterdayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseWeek = expenses
    .filter(t => t.date >= startOfWeekStr && t.date <= todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseMonth = expenses
    .filter(t => t.date.startsWith(currentMonthStr))
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseYear = expenses
      .filter(t => t.date.startsWith(currentYear.toString()))
      .reduce((sum, t) => sum + t.amount, 0);

  // -------------------------------------

  // Filter Visible Wallets logic
  const visibleWallets = wallets.filter(w => !w.isHidden);

  // Total Balance (Only from visible wallets)
  const totalBalance = visibleWallets.reduce((sum, w) => sum + w.balance, 0);
  
  useEffect(() => {
    const alerts = generateSmartAlerts(transactions, categories, debts);
    setSmartAlerts(alerts);
  }, [transactions.length, categories, debts]); 
  
  return (
    <div className="space-y-6">
      
      {/* 0. Expense Summary Cards (Small Grid at Top) */}
      <div className="grid grid-cols-5 gap-2">
        <SummaryCard label="اليوم" amount={expenseToday} currency={currency} bg="bg-blue-50 dark:bg-blue-900/20" text="text-blue-700 dark:text-blue-300" />
        <SummaryCard label="أمس" amount={expenseYesterday} currency={currency} bg="bg-gray-100 dark:bg-gray-800" text="text-gray-700 dark:text-gray-300" />
        <SummaryCard label="أسبوع" amount={expenseWeek} currency={currency} bg="bg-indigo-50 dark:bg-indigo-900/20" text="text-indigo-700 dark:text-indigo-300" />
        <SummaryCard label="شهر" amount={expenseMonth} currency={currency} bg="bg-purple-50 dark:bg-purple-900/20" text="text-purple-700 dark:text-purple-300" />
        <SummaryCard label="سنة" amount={expenseYear} currency={currency} bg="bg-orange-50 dark:bg-orange-900/20" text="text-orange-700 dark:text-orange-300" />
      </div>

      {/* 1. Main Balance Section (Below Summaries) */}
      <div className="flex flex-col items-center justify-center p-6 bg-primary-600 rounded-3xl text-white shadow-xl shadow-primary-600/20">
          <p className="text-primary-100 text-sm mb-1 font-medium">الرصيد الكلي (المحافظ الظاهرة)</p>
          <div className="text-4xl font-bold mb-4" dir="ltr">
             {totalBalance.toLocaleString()} <span className="text-lg opacity-80">{currency}</span>
          </div>
          
          <div className="flex gap-4 w-full">
               {/* Wallets Horizontal Scroll */}
               <div className="flex gap-3 overflow-x-auto no-scrollbar w-full justify-center">
                   {visibleWallets.map(w => (
                       <div key={w.id} className="bg-primary-700/50 px-4 py-2 rounded-xl flex items-center gap-2 min-w-max border border-primary-500/30">
                           {w.type === 'BANK' ? <CreditCard size={14} className="opacity-70"/> : <Wallet size={14} className="opacity-70" />}
                           <span className="text-xs">{w.name}</span>
                           <span className="font-bold text-sm" dir="ltr">{w.balance.toLocaleString()}</span>
                       </div>
                   ))}
               </div>
          </div>
      </div>

      {/* 2. Smart Alerts */}
      {smartAlerts.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-800 animate-pulse">
            <h4 className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold mb-2">
                <BellRing size={18} /> تنبيهات هامة
            </h4>
            <ul className="list-disc list-inside text-sm text-orange-800 dark:text-orange-300 space-y-1">
                {smartAlerts.map((alert, idx) => (
                    <li key={idx}>{alert}</li>
                ))}
            </ul>
        </div>
      )}

      {/* 3. Debt Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-gray-500 dark:text-gray-400 font-medium">ملخص الديون</h3>
             <Link to="/debts" className="text-primary-600 text-sm hover:underline">التفاصيل</Link>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                <span className="text-xs text-red-500 block mb-1">عليّ (مستحق)</span>
                <span className="font-bold text-red-700 dark:text-red-400 text-xl" dir="ltr">
                  {debts.filter(d => d.type === 'BORROWED').reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                <span className="text-xs text-emerald-500 block mb-1">لي (عند الناس)</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xl" dir="ltr">
                  {debts.filter(d => d.type === 'LENT').reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                </span>
              </div>
           </div>
      </div>

      {/* 4. Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">آخر المعاملات</h3>
            <Link to="/transactions" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
                الكل <ArrowRight size={14} className="rotate-180" />
            </Link>
        </div>
        <div className="space-y-4">
          {transactions.slice(0, 5).map(t => {
            const categoryObj = categories.find(c => c.id === t.category);
            return (
              <div key={t.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${t.type === 'INCOME' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                     {categoryObj?.icon ? categoryObj.icon : (
                        t.type === 'INCOME' ? <ArrowUp size={20} /> : <ArrowDown size={20} />
                     )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{categoryObj?.label || t.category}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${t.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-300'}`} dir="ltr">
                    {t.type === 'INCOME' ? '+' : '-'}{t.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{t.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ label: string; amount: number; currency: string; bg: string; text: string }> = ({ label, amount, currency, bg, text }) => (
  <div className={`${bg} p-2 rounded-xl flex flex-col items-center justify-center text-center shadow-sm border border-transparent dark:border-gray-700 transition h-20`}>
    <span className={`text-[9px] font-bold mb-1 opacity-70 ${text}`}>{label}</span>
    <span className={`font-bold text-sm sm:text-lg leading-tight ${text}`} dir="ltr">
      {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
    </span>
  </div>
);
