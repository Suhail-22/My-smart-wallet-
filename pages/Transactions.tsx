
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, ArrowDown, ArrowUp, Search, ArrowUpDown } from 'lucide-react';

type SortOption = 'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC' | 'CATEGORY';

export const Transactions: React.FC = () => {
  const { transactions, categories, currency } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('DATE_DESC');

  // 1. Filter Transactions
  const filteredTransactions = transactions.filter(t => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const categoryName = categories.find(c => c.id === t.category)?.label.toLowerCase() || '';
      return (
          t.description.toLowerCase().includes(query) ||
          categoryName.includes(query) ||
          t.amount.toString().includes(query)
      );
  });

  // 2. Sort Transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'DATE_DESC':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'DATE_ASC':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'AMOUNT_DESC':
        return b.amount - a.amount;
      case 'AMOUNT_ASC':
        return a.amount - b.amount;
      case 'CATEGORY':
        const catA = categories.find(c => c.id === a.category)?.label || '';
        const catB = categories.find(c => c.id === b.category)?.label || '';
        return catA.localeCompare(catB);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">سجل المعاملات</h2>
      </div>
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
            <input 
               type="text"
               placeholder="بحث في الوصف، التصنيف، أو المبلغ..."
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:border-primary-500 text-gray-700 dark:text-gray-200"
            />
            <Search size={20} className="absolute right-3 top-3.5 text-gray-400" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative min-w-[160px]">
            <div className="absolute right-3 top-3.5 text-gray-500 pointer-events-none">
                <ArrowUpDown size={18} />
            </div>
            <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:border-primary-500 text-gray-700 dark:text-gray-200 appearance-none cursor-pointer"
            >
                <option value="DATE_DESC">الأحدث أولاً</option>
                <option value="DATE_ASC">الأقدم أولاً</option>
                <option value="AMOUNT_DESC">الأعلى مبلغاً</option>
                <option value="AMOUNT_ASC">الأقل مبلغاً</option>
                <option value="CATEGORY">حسب التصنيف</option>
            </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedTransactions.map(t => {
            const categoryObj = categories.find(c => c.id === t.category);
            return (
              <div key={t.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${t.type === 'INCOME' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                     {categoryObj?.icon ? categoryObj.icon : (
                        t.type === 'INCOME' ? <ArrowUp size={24} /> : <ArrowDown size={24} />
                     )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white text-lg">{categoryObj?.label || t.category}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{t.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${t.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-300'}`} dir="ltr">
                    {t.type === 'INCOME' ? '+' : '-'}{currency} {t.amount.toLocaleString()}
                  </p>
                  {t.profit && t.profit > 0 && (
                      <span className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded inline-block mt-1">
                          ربح: {t.profit}
                      </span>
                  )}
                </div>
              </div>
            );
        })}
        {sortedTransactions.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                <History size={48} className="mx-auto mb-4 opacity-50" />
                <p>لا توجد معاملات مطابقة للبحث</p>
            </div>
        )}
      </div>
    </div>
  );
};
