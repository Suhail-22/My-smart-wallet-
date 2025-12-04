
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType, Category } from '../types';
import { Edit2, TrendingDown, TrendingUp, Globe, Check } from 'lucide-react';

export const Budget: React.FC = () => {
  const { categories, transactions, currency, updateCategory } = useApp();
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState('');

  // Date Logic
  const today = new Date();
  const currentMonthStr = today.toISOString().slice(0, 7); // YYYY-MM
  
  const prevDate = new Date(today);
  prevDate.setMonth(prevDate.getMonth() - 1);
  const prevMonthStr = prevDate.toISOString().slice(0, 7); // YYYY-MM

  // Helper to get total spent for a category in a specific month
  const getSpent = (catId: string | null, monthStr: string) => {
    return transactions
      .filter(t => 
        t.type === TransactionType.EXPENSE && 
        t.date.startsWith(monthStr) && 
        (catId === null ? true : t.category === catId)
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalSpent = getSpent(null, currentMonthStr);
  const totalSpentPrev = getSpent(null, prevMonthStr);
  const totalBudget = categories
    .filter(c => c.type === TransactionType.EXPENSE)
    .reduce((sum, c) => sum + (c.budgetLimit || 0), 0);

  const totalChange = totalSpentPrev === 0 ? 0 : ((totalSpent - totalSpentPrev) / totalSpentPrev) * 100;

  const handleEditLimit = (cat: Category) => {
    setEditingCatId(cat.id);
    setTempLimit(cat.budgetLimit?.toString() || '');
  };

  const saveLimit = (cat: Category) => {
    updateCategory({ ...cat, budgetLimit: Number(tempLimit) });
    setEditingCatId(null);
  };

  const renderProgressBar = (spent: number, limit: number, colorClass: string) => {
    const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    return (
      <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`} 
          style={{ width: `${pct}%` }} 
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">الميزانية الشهرية</h2>

      {/* 1. Global Summary Card */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-2">
             <Globe className="text-emerald-500" size={24} />
             <h3 className="text-lg font-bold text-gray-800 dark:text-white">جميع الأقسام</h3>
           </div>
           {/* Edit Total Budget is implied by editing individual categories */}
        </div>

        {renderProgressBar(totalSpent, totalBudget, 'bg-emerald-500')}

        <div className="flex justify-between items-center mt-3 text-sm">
           <div className="flex flex-col">
              <span className="text-gray-500 dark:text-gray-400 text-xs">المصاريف</span>
              <span className="font-bold text-gray-800 dark:text-white" dir="ltr">{totalSpent.toLocaleString()}</span>
           </div>
           
           <div className="flex flex-col items-end">
              <span className="text-gray-500 dark:text-gray-400 text-xs">الميزانية</span>
              <span className="font-bold text-gray-800 dark:text-white" dir="ltr">{totalBudget.toLocaleString()}</span>
           </div>
        </div>

        <div className="mt-3 text-center">
            <span className={`text-sm font-medium ${totalChange > 0 ? 'text-red-500' : 'text-emerald-500'} flex items-center justify-center gap-1`}>
                {totalChange > 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                <span dir="ltr">{Math.abs(totalChange).toFixed(0)}%</span>
                <span>مقارنة بالفترة السابقة</span>
            </span>
        </div>
      </div>

      {/* 2. Category List */}
      <div className="space-y-4">
        {categories.filter(c => c.type === TransactionType.EXPENSE).map(cat => {
            const spent = getSpent(cat.id, currentMonthStr);
            const prev = getSpent(cat.id, prevMonthStr);
            const change = prev === 0 ? 0 : ((spent - prev) / prev) * 100;
            const limit = cat.budgetLimit || 0;
            const isEditing = editingCatId === cat.id;

            // Determine color based on percentage usage
            const usagePct = limit > 0 ? (spent / limit) : 0;
            let barColor = 'bg-emerald-500';
            if (usagePct > 0.8) barColor = 'bg-orange-500';
            if (usagePct >= 1) barColor = 'bg-red-500';

            return (
              <div key={cat.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">{cat.icon}</div>
                        <h4 className="font-bold text-gray-800 dark:text-white">{cat.label}</h4>
                    </div>
                    
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                             <input 
                               type="number" 
                               value={tempLimit} 
                               onChange={e => setTempLimit(e.target.value)}
                               className="w-24 border border-emerald-300 rounded-lg px-2 py-1 outline-none text-center font-mono dark:bg-gray-700 dark:text-white"
                               autoFocus
                             />
                             <button onClick={() => saveLimit(cat)} className="text-emerald-600 bg-emerald-100 p-1.5 rounded-full"><Check size={16}/></button>
                        </div>
                    ) : (
                        <button onClick={() => handleEditLimit(cat)} className="text-gray-400 hover:text-emerald-600">
                            <Edit2 size={16} />
                        </button>
                    )}
                </div>

                {renderProgressBar(spent, limit, barColor)}

                <div className="flex justify-between items-center mt-3 text-sm">
                    <div className="flex gap-1">
                         <span className="text-gray-500 dark:text-gray-400">المصاريف:</span>
                         <span className="font-bold text-gray-800 dark:text-white" dir="ltr">{spent.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-1">
                         <span className="text-gray-500 dark:text-gray-400">من:</span>
                         <span className="font-bold text-gray-800 dark:text-white" dir="ltr">{limit.toLocaleString()}</span>
                    </div>
                </div>

                <div className="mt-2 text-xs text-center">
                    <span className={`${change > 0 ? 'text-red-500' : 'text-emerald-500'} font-medium`} dir="ltr">
                        {Math.abs(change).toFixed(0)}% {change > 0 ? '+' : '-'}
                    </span>
                    <span className="text-gray-400 mx-1">مقارنة بالفترة السابقة</span>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};
