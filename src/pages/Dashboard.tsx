// src/pages/Dashboard.tsx
import React from 'react';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { totalBalance, debtsSummary, recentTransactions } = useApp();

  return (
    <div className="p-4 pt-20 pb-24 space-y-4">
      {/* مربعات الوقت: يوم، أسبوع، شهر، سنة */}
      <div className="grid grid-cols-5 gap-2">
        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-xl text-center">
          <span className="block text-sm text-cyan-600 dark:text-cyan-400">اليوم</span>
          <span className="text-xl font-bold text-cyan-700 dark:text-cyan-300">0</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-center">
          <span className="block text-sm text-gray-600 dark:text-gray-400">أمس</span>
          <span className="text-xl font-bold text-gray-700 dark:text-gray-300">0</span>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-center">
          <span className="block text-sm text-blue-600 dark:text-blue-400">أسبوع</span>
          <span className="text-xl font-bold text-blue-700 dark:text-blue-300">0</span>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl text-center">
          <span className="block text-sm text-purple-600 dark:text-purple-400">شهر</span>
          <span className="text-xl font-bold text-purple-700 dark:text-purple-300">0</span>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl text-center">
          <span className="block text-sm text-orange-600 dark:text-orange-400">سنة</span>
          <span className="text-xl font-bold text-orange-700 dark:text-orange-300">0</span>
        </div>
      </div>

      {/* مربع الرصيد الكلي */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
        <h2 className="text-center text-lg mb-2">الرصيد الكلي (المحافظ الظاهرة)</h2>
        <div className="text-center text-3xl font-bold">{totalBalance} YER</div>
        <div className="flex justify-between mt-3 text-sm">
          <span>الكاش / المحفظة</span>
          <span>سجل الديون (الذمم)</span>
        </div>
      </div>

      {/* تنبيهات هامة */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800">
        <span className="text-yellow-700 dark:text-yellow-300 font-medium">تنبيهات هامة</span>
        <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
          ملاحظة: لم تسجل أي مصروفات خلال الأسبوع الماضي
        </p>
      </div>

      {/* ملخص الديون */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">ملخص الديون</h3>
          <span className="text-blue-500 text-sm">التفاصيل</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-center">
            <span className="block text-sm text-red-600 dark:text-red-400">(مستحق) عليّ</span>
            <span className="text-xl font-bold text-red-700 dark:text-red-300">{debtsSummary?.owed || 0}</span>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-center">
            <span className="block text-sm text-green-600 dark:text-green-400">(عند الناس) لي</span>
            <span className="text-xl font-bold text-green-700 dark:text-green-300">{debtsSummary?.owedToMe || 0}</span>
          </div>
        </div>
      </div>

      {/* آخر المعاملات */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">آخر المعاملات</h3>
          <span className="text-blue-500 text-sm">الكل</span>
        </div>
        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-3 text-sm">لا توجد معاملات حديثة</p>
        ) : (
          <ul className="space-y-2">
            {recentTransactions.slice(0, 3).map(tx => (
              <li key={tx.id} className="flex justify-between items-center p-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-sm">{tx.description || 'معاملة غير مسمى'}</span>
                <span className={`font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{tx.amount} YER
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;