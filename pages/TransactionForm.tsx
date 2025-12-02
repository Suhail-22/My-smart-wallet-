
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { TransactionType, Category } from '../types';
import { ArrowLeft, Calculator, Camera, ChevronDown, Image as ImageIcon, Menu, Smile, Meh, Frown, Plus, X, Calendar, AlignLeft, Users, Contact as ContactIcon } from 'lucide-react';
import { ContactPicker } from '../components/ContactPicker';

// Simple Keyword Mapping for Auto-Categorization
const KEYWORD_MAP: Record<string, string> = {
  'food': 'Food', 'lunch': 'Food', 'dinner': 'Food', 'burger': 'Food', 'supermarket': 'Food', 'bakery': 'Food',
  'taxi': 'Transport', 'uber': 'Transport', 'bus': 'Transport', 'fuel': 'Transport', 'gas': 'Transport',
  'wifi': 'Bills', 'net': 'Bills', 'internet': 'Bills', 'vodafone': 'Bills', 'electric': 'Bills', 'water': 'Bills',
  'pharmacy': 'Health', 'doctor': 'Health', 'med': 'Health',
  'shop': 'Shopping', 'clothes': 'Shopping', 'mall': 'Shopping'
};

export const TransactionForm: React.FC = () => {
  const { addTransaction, addCategory, categories, wallets, defaultTransactionType, currency } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5), // HH:MM
    type: defaultTransactionType || TransactionType.EXPENSE,
    walletId: wallets[0]?.id || '',
    necessityLevel: 'NORMAL' as 'NECESSITY' | 'NORMAL' | 'LUXURY',
    isRecurring: false,
    alertReminder: false,
    isExcludedFromBalance: false,
    contactName: '',
    groupName: ''
  });

  // Quick Add Category State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');

  // Filter categories based on selected type
  const availableCategories = categories.filter(c => c.type === formData.type);

  // Set default category
  useEffect(() => {
    const currentCatValid = availableCategories.find(c => c.id === formData.category);
    if (!currentCatValid && availableCategories.length > 0) {
      setFormData(prev => ({ ...prev, category: availableCategories[0].id }));
    }
  }, [formData.type, categories, availableCategories]);

  // Handle Description Change
  const handleDescriptionChange = (desc: string) => {
      setFormData(prev => ({ ...prev, description: desc }));
      // Auto-categorize
      const lowerDesc = desc.toLowerCase();
      for (const [key, catId] of Object.entries(KEYWORD_MAP)) {
          if (lowerDesc.includes(key)) {
               const targetCat = availableCategories.find(c => c.id === catId || c.id.toLowerCase().includes(catId.toLowerCase()));
               if (targetCat) {
                   setFormData(prev => ({ ...prev, category: targetCat.id }));
               }
               break; 
          }
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      id: crypto.randomUUID(),
      amount: parseFloat(formData.amount),
      category: formData.category, 
      description: formData.description,
      date: formData.date,
      type: formData.type,
      walletId: formData.walletId,
      necessityLevel: formData.necessityLevel,
      isRecurring: formData.isRecurring,
      isExcludedFromBalance: formData.isExcludedFromBalance,
      contactName: formData.contactName,
      groupName: formData.groupName,
      alertReminder: formData.alertReminder
    });
    navigate('/');
  };

  const handleQuickAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCat: Category = {
      id: crypto.randomUUID(),
      label: newCategoryName.trim(),
      icon: newCategoryIcon.trim() || '🏷️',
      type: formData.type,
      isDefault: false
    };

    addCategory(newCat);
    setFormData(prev => ({ ...prev, category: newCat.id }));
    setNewCategoryName('');
    setNewCategoryIcon('');
    setIsAddingCategory(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
         <button onClick={() => navigate('/')} className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><ArrowLeft /></button>
         <h1 className="text-lg font-bold text-gray-800 dark:text-white">
            {formData.type === TransactionType.EXPENSE ? 'تسجيل مصروف' : 'تسجيل دخل'}
         </h1>
         <button className="p-2 text-gray-500"><Menu /></button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto pb-24">
              
              {/* Top Section: Amount */}
              <div className="bg-white dark:bg-gray-800 p-6 mb-2 flex items-end gap-2 border-b border-emerald-500/30">
                  <div className="border-2 border-emerald-500 rounded-lg px-2 py-1 text-emerald-600 font-bold text-sm h-10 flex items-center justify-center min-w-[3rem]">
                      {currency === 'YER' ? 'ر.ي' : currency}
                  </div>
                  <div className="flex-1 relative">
                       <label className="text-gray-400 text-xs absolute -top-4 right-0">المبلغ</label>
                       <input 
                         type="number" 
                         step="0.01"
                         required
                         autoFocus
                         className="w-full text-4xl font-bold text-gray-800 dark:text-white outline-none bg-transparent placeholder-gray-200"
                         placeholder="0.00"
                         value={formData.amount}
                         onChange={e => setFormData({...formData, amount: e.target.value})}
                         dir="ltr"
                       />
                       <div className="h-0.5 bg-emerald-500 w-full mt-1"></div>
                  </div>
                  <div className="bg-emerald-500 text-white p-2 rounded-lg">
                      <Calculator size={20} />
                  </div>
              </div>

              {/* Category Selection */}
              <div className="bg-white dark:bg-gray-800 p-4 mb-2 flex items-center justify-between cursor-pointer" onClick={() => {}}>
                  <div className="flex items-center gap-3 flex-1">
                       <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xl text-emerald-600">
                           {categories.find(c => c.id === formData.category)?.icon || '🏷️'}
                       </div>
                       <select 
                          className="flex-1 bg-transparent text-gray-800 dark:text-white font-bold outline-none text-lg appearance-none cursor-pointer"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                       >
                           {availableCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                       </select>
                  </div>
                  <div className="text-gray-400"><ChevronDown /></div>
              </div>

              {/* Wallet Selection */}
              <div className="bg-white dark:bg-gray-800 p-4 mb-2 flex items-center gap-3">
                   <span className="text-gray-500 text-sm w-20">من محفظة:</span>
                   <select 
                      value={formData.walletId}
                      onChange={e => setFormData({...formData, walletId: e.target.value})}
                      className="flex-1 bg-transparent text-gray-800 dark:text-white outline-none"
                   >
                       {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                   </select>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 p-4 mb-2 flex items-center gap-3">
                   <div className="text-gray-400"><AlignLeft size={20} /></div>
                   <input 
                     type="text" 
                     placeholder="الملاحظات"
                     className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
                     value={formData.description}
                     onChange={e => handleDescriptionChange(e.target.value)}
                   />
              </div>

              {/* Date & Time */}
              <div className="bg-white dark:bg-gray-800 p-4 mb-2 flex gap-4">
                  <div className="flex-1 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                       <input 
                         type="time" 
                         className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white text-left"
                         value={formData.time}
                         onChange={e => setFormData({...formData, time: e.target.value})}
                       />
                  </div>
                  <div className="flex-[2] flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                       <div className="text-gray-400"><Calendar size={18} /></div>
                       <input 
                         type="date" 
                         className="flex-1 bg-transparent outline-none text-gray-800 dark:text-white text-left"
                         value={formData.date}
                         onChange={e => setFormData({...formData, date: e.target.value})}
                       />
                       <span className="text-xs text-gray-400">تاريخ المعاملة</span>
                  </div>
              </div>

              {/* Attachments */}
              <div className="bg-white dark:bg-gray-800 p-4 mb-2 flex items-center gap-4 text-gray-400">
                  <div className="flex-1 h-12 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                      <ImageIcon size={20} />
                  </div>
                  <div className="flex-1 h-12 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                      <Camera size={20} />
                  </div>
              </div>

              {/* Recurring Toggle */}
              <div className="bg-white dark:bg-gray-800 p-4 mb-0 flex items-center justify-between border-b border-gray-50 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">تكرار المعاملة</span>
                  <div 
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${formData.isRecurring ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    onClick={() => setFormData({...formData, isRecurring: !formData.isRecurring})}
                  >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isRecurring ? '-translate-x-6' : 'translate-x-0'}`} />
                  </div>
              </div>
              
              {/* Alert Toggle */}
               <div className="bg-white dark:bg-gray-800 p-4 mb-2 flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">التنبيه بالمعاملة (سيتم تذكيرك قبل الموعد)</span>
                  <div 
                    className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${formData.alertReminder ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    onClick={() => setFormData({...formData, alertReminder: !formData.alertReminder})}
                  >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.alertReminder ? '-translate-x-6' : 'translate-x-0'}`} />
                  </div>
              </div>

              {/* Group & Contact Section (Masareef Style) */}
              <div className="bg-white dark:bg-gray-800 p-4 mb-2 space-y-3">
                 {/* Group / Project */}
                 <div className="flex items-center gap-3">
                    <div className="text-gray-400 w-8 flex justify-center"><Users size={22} /></div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium w-24">المجموعة</span>
                    <input 
                        type="text" 
                        placeholder="مشروع / عائلة (اختياري)" 
                        className="flex-1 border-b border-gray-200 dark:border-gray-700 pb-1 bg-transparent outline-none dark:text-white text-sm"
                        value={formData.groupName}
                        onChange={e => setFormData({...formData, groupName: e.target.value})}
                    />
                 </div>
                 
                 {/* Contact */}
                 <div className="flex items-center gap-3">
                    <div className="text-yellow-400 w-8 flex justify-center"><ContactIcon size={22} className="fill-current" /></div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium w-24">جهة الإتصال</span>
                    <div className="flex-1">
                        <ContactPicker 
                            onSelect={(name) => setFormData({...formData, contactName: name})}
                            initialValue={formData.contactName}
                            placeholder="اختر جهة اتصال..."
                        />
                    </div>
                 </div>
              </div>

              {/* Priority Faces */}
              {formData.type === TransactionType.EXPENSE && (
                  <div className="bg-white dark:bg-gray-800 p-4 mb-2 flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300 font-bold">الأولوية</span>
                      <div className="flex gap-2">
                          <button 
                             type="button"
                             onClick={() => setFormData({...formData, necessityLevel: 'LUXURY'})}
                             className={`flex flex-col items-center gap-1 p-2 rounded-lg ${formData.necessityLevel === 'LUXURY' ? 'bg-gray-100 text-gray-800 font-bold' : 'text-gray-400'}`}
                          >
                             <Frown size={24} />
                             <span className="text-xs">ترفيهي</span>
                          </button>
                          <button 
                             type="button"
                             onClick={() => setFormData({...formData, necessityLevel: 'NORMAL'})}
                             className={`flex flex-col items-center gap-1 p-2 rounded-lg ${formData.necessityLevel === 'NORMAL' ? 'bg-yellow-100 text-yellow-700 font-bold' : 'text-gray-400'}`}
                          >
                             <Meh size={24} />
                             <span className="text-xs">عادي</span>
                          </button>
                          <button 
                             type="button"
                             onClick={() => setFormData({...formData, necessityLevel: 'NECESSITY'})}
                             className={`flex flex-col items-center gap-1 p-2 rounded-lg ${formData.necessityLevel === 'NECESSITY' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-gray-400'}`}
                          >
                             <Smile size={24} />
                             <span className="text-xs">أساسي</span>
                          </button>
                      </div>
                  </div>
              )}

              {/* Exclude from Balance */}
              <div className="bg-white dark:bg-gray-800 p-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                     <span className="text-gray-600 dark:text-gray-300 font-bold">عدم التأثير على الرصيد</span>
                     <div 
                        className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${formData.isExcludedFromBalance ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                        onClick={() => setFormData({...formData, isExcludedFromBalance: !formData.isExcludedFromBalance})}
                     >
                         <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isExcludedFromBalance ? '-translate-x-6' : 'translate-x-0'}`} />
                     </div>
                  </div>
                  <p className="text-xs text-gray-400">عند تفعيلها سيتم تجاهل هذه المعاملة من رصيد المحفظة المحددة</p>
              </div>

          </div>

          {/* Sticky Submit Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50">
             <button 
                type="submit"
                className="w-full bg-emerald-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition"
             >
                إضافة معاملة
             </button>
          </div>
      </form>
    </div>
  );
};
