import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';
import { Calculator, Save, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Zakat: React.FC = () => {
  const { zakatSettings, updateZakatSettings, getZakatBase, addTransaction, categories } = useApp();
  const navigate = useNavigate();
  const zakatBase = getZakatBase();
  
  const [goldInput, setGoldInput] = useState(zakatSettings.goldPrice || '');
  
  // Calculate Nisab (85g of Gold)
  const nisabThreshold = Number(goldInput) * 85;
  const isEligible = zakatBase.total >= nisabThreshold && nisabThreshold > 0;
  const zakatAmount = zakatBase.total * 0.025;

  const handleSaveSettings = () => {
    updateZakatSettings({ goldPrice: Number(goldInput) });
    alert('تم حفظ سعر الذهب');
  };

  const handlePayZakat = () => {
    if (!confirm('هل أنت متأكد من تسجيل إخراج الزكاة كمصروف؟')) return;

    // Find or fallback Zakat category
    const zakatCat = categories.find(c => c.label.includes('زكاة'))?.id || categories[0].id;

    addTransaction({
      id: crypto.randomUUID(),
      amount: zakatAmount,
      date: new Date().toISOString().split('T')[0],
      description: 'إخراج زكاة المال (تلقائي)',
      category: zakatCat,
      type: TransactionType.EXPENSE
    });

    updateZakatSettings({ lastPaidDate: new Date().toISOString().split('T')[0] });
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Calculator className="text-primary-600" />
        <span>زكاتي</span>
      </h2>

      {/* Settings Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
            <Info size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-2">إعدادات النصاب</h3>
            <p className="text-sm text-gray-500 mb-4">
              نصاب الزكاة هو قيمة 85 جرام من الذهب عيار 24. يرجى إدخال سعر الجرام الحالي في بلدك.
            </p>
            <div className="flex gap-2">
              <input 
                type="number"
                placeholder="سعر جرام الذهب"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-primary-500"
                value={goldInput}
                onChange={(e) => setGoldInput(Number(e.target.value))}
              />
              <button 
                onClick={handleSaveSettings}
                className="bg-gray-100 text-gray-700 px-4 rounded-xl hover:bg-gray-200"
              >
                <Save size={20} />
              </button>
            </div>
            {Number(goldInput) > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                قيمة النصاب الحالية: <span className="font-bold">{nisabThreshold.toLocaleString()}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-gray-500 text-sm">السيولة النقدية</p>
          <p className="text-xl font-bold" dir="ltr">{zakatBase.cash.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-gray-500 text-sm">الاستثمارات</p>
          <p className="text-xl font-bold" dir="ltr">{zakatBase.investments.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <p className="text-gray-500 text-sm">الديون (لك)</p>
          <p className="text-xl font-bold" dir="ltr">{zakatBase.debts.toLocaleString()}</p>
        </div>
      </div>

      {/* Result Card */}
      <div className={`p-6 rounded-2xl border-2 ${isEligible ? 'bg-primary-50 border-primary-100' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm font-medium opacity-70">إجمالي الوعاء الزكوي</p>
            <p className="text-3xl font-bold mt-1" dir="ltr">{zakatBase.total.toLocaleString()}</p>
          </div>
          {isEligible ? (
             <div className="flex items-center gap-2 text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">
               <CheckCircle size={16} /> <span className="text-sm font-bold">تجب الزكاة</span>
             </div>
          ) : (
             <div className="flex items-center gap-2 text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
               <AlertTriangle size={16} /> <span className="text-sm font-bold">لم تبلغ النصاب</span>
             </div>
          )}
        </div>

        {isEligible && (
          <div className="bg-white p-6 rounded-xl shadow-sm text-center space-y-4">
            <p className="text-gray-500">مقدار الزكاة الواجبة (2.5%)</p>
            <p className="text-4xl font-bold text-primary-600" dir="ltr">{zakatAmount.toLocaleString()}</p>
            
            <button 
              onClick={handlePayZakat}
              className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition font-bold shadow-lg shadow-primary-500/20"
            >
              تسجيل إخراج الزكاة
            </button>
            <p className="text-xs text-gray-400">سيتم تسجيل العملية كمصروف تحت بند "زكاة وصدقات"</p>
          </div>
        )}
      </div>
    </div>
  );
};