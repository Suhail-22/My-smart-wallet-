
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType, Currency } from '../types';
import { Trash2, Plus, Tag, Moon, Sun, Download, Upload, DollarSign, LayoutTemplate, X, Smile } from 'lucide-react';

// Categorized Emoji List for Better UX
const EMOJI_CATEGORIES = {
  'طعام وشراب': ['🍕', '🍔', '🥪', '🌮', '🍜', '🍱', '🥐', '☕', '🥤', '🍎', '🥕', '🥩'],
  'تسوق واحتياجات': ['🛒', '🛍️', '🎁', '👓', '👕', '👗', '👟', '💍', '🧸', '📱', '💻', '📷'],
  'منزل وخدمات': ['🏠', '🔌', '💡', '🚰', '📺', '🛏️', '🛋️', '🧹', '🔧', '🔨', '🔋', '📡'],
  'نقل وسفر': ['🚗', '🚕', '🚌', '✈️', '🚂', '🚲', '⛽', '🚧', '🗺️', '🛎️', '🏖️', '⛰️'],
  'صحة وتعليم': ['💊', '🏥', '💉', '🦷', '🎓', '📚', '✏️', '🏫', '🏋️', '🧘', '⚽', '🎨'],
  'مالية وأعمال': ['💰', '💸', '💳', '🏦', '🧾', '📉', '📈', '💼', '🤝', '🏢', '📊', '🏧'],
};

export const Settings: React.FC = () => {
  const { 
    categories, addCategory, deleteCategory, 
    theme, setTheme, 
    currency, setCurrency,
    defaultTransactionType, setDefaultTransactionType,
    exportData, importData 
  } = useApp();

  const [activeTab, setActiveTab] = useState<TransactionType>(TransactionType.EXPENSE);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🏷️');
  const [newCatBudget, setNewCatBudget] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Backup State
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      id: crypto.randomUUID(), 
      label: newCatName.trim(), 
      icon: newCatIcon.trim(), 
      type: activeTab,
      isDefault: false,
      budgetLimit: newCatBudget ? Number(newCatBudget) : undefined
    });
    setNewCatName('');
    setNewCatIcon('🏷️');
    setNewCatBudget('');
    setShowEmojiPicker(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (importData(result)) {
            alert("تم استعادة البيانات بنجاح!");
        } else {
            alert("فشل في استعادة البيانات. الملف قد يكون تالفاً.");
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredCategories = categories.filter(c => c.type === activeTab);

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">الإعدادات</h2>

      {/* --- App Preferences --- */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 space-y-4">
         <h3 className="font-bold text-gray-800 dark:text-white mb-2 px-2">تفضيلات عامة</h3>
         
         {/* Theme Toggle */}
         <div className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full text-indigo-600 dark:text-indigo-400">
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                    <h3 className="font-bold text-gray-700 dark:text-gray-200">مظهر التطبيق</h3>
                </div>
            </div>
            <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${theme === 'dark' ? 'translate-x-0' : '-translate-x-6'}`} />
            </button>
         </div>

         {/* Currency Selector */}
         <div className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
                    <DollarSign size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-700 dark:text-gray-200">العملة الأساسية</h3>
                </div>
            </div>
            <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 dark:text-white"
            >
                <option value="YER">ريال يمني (YER)</option>
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="AED">درهم إماراتي (AED)</option>
            </select>
         </div>

         {/* Default Transaction Type */}
         <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
                    <LayoutTemplate size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-700 dark:text-gray-200">النوع الافتراضي</h3>
                </div>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button 
                    onClick={() => setDefaultTransactionType(TransactionType.EXPENSE)}
                    className={`px-3 py-1 text-sm rounded-md transition ${defaultTransactionType === TransactionType.EXPENSE ? 'bg-white dark:bg-gray-600 shadow text-red-600 dark:text-red-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    مصروف
                </button>
                <button 
                    onClick={() => setDefaultTransactionType(TransactionType.INCOME)}
                    className={`px-3 py-1 text-sm rounded-md transition ${defaultTransactionType === TransactionType.INCOME ? 'bg-white dark:bg-gray-600 shadow text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    دخل
                </button>
            </div>
         </div>
      </section>

      {/* --- Category Management (Grid View) --- */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <h3 className="font-bold text-gray-800 dark:text-white p-6 pb-2">إدارة التصنيفات</h3>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setActiveTab(TransactionType.EXPENSE)}
            className={`flex-1 py-4 font-medium text-center transition ${
              activeTab === TransactionType.EXPENSE 
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50 dark:bg-red-900/20' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            مصروفات
          </button>
          <button
            onClick={() => setActiveTab(TransactionType.INCOME)}
            className={`flex-1 py-4 font-medium text-center transition ${
              activeTab === TransactionType.INCOME 
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            دخل
          </button>
        </div>

        <div className="p-6">
          {/* Add Form */}
          <form onSubmit={handleAdd} className="flex flex-col gap-3 mb-6 relative">
            <div className="flex gap-3">
                 <div className="relative">
                    <button 
                    type="button" 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-14 px-2 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:border-emerald-500 outline-none text-center text-xl flex items-center justify-center"
                    >
                    {newCatIcon}
                    </button>
                    
                    {/* Visual Categorized Emoji Picker */}
                    {showEmojiPicker && (
                    <div className="absolute top-14 right-0 z-50 bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-600 rounded-2xl p-4 w-72 max-h-80 overflow-y-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-400">اختر رمزاً أو اكتبه</span>
                            <button type="button" onClick={() => setShowEmojiPicker(false)}><X size={16} /></button>
                        </div>
                        
                        <div className="mb-4">
                            <input 
                                type="text" 
                                placeholder="إيموجي مخصص (اكتب هنا)"
                                maxLength={2}
                                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-center bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-emerald-500"
                                onChange={(e) => {
                                    if(e.target.value) setNewCatIcon(e.target.value);
                                }}
                            />
                        </div>
                        
                        {Object.entries(EMOJI_CATEGORIES).map(([catName, emojis]) => (
                        <div key={catName} className="mb-4 last:mb-0">
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">{catName}</h4>
                            <div className="grid grid-cols-6 gap-2">
                                {emojis.map(emoji => (
                                <button 
                                    key={emoji} 
                                    type="button" 
                                    onClick={() => { setNewCatIcon(emoji); setShowEmojiPicker(false); }}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-lg flex items-center justify-center"
                                >
                                    {emoji}
                                </button>
                                ))}
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="اسم التصنيف..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:border-emerald-500 outline-none"
                />
            </div>
            
            {/* Monthly Budget Limit (Optional) */}
            {activeTab === TransactionType.EXPENSE && (
                <div className="flex gap-3">
                    <input
                        type="number"
                        value={newCatBudget}
                        onChange={(e) => setNewCatBudget(e.target.value)}
                        placeholder="حد الميزانية الشهري (اختياري)"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:border-emerald-500 outline-none"
                    />
                    <button
                    type="submit"
                    disabled={!newCatName.trim()}
                    className="bg-emerald-600 text-white px-6 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                    <Plus size={20} />
                    </button>
                </div>
            )}
            {activeTab === TransactionType.INCOME && (
                <button
                type="submit"
                disabled={!newCatName.trim()}
                className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 flex justify-center"
                >
                <Plus size={20} />
                </button>
            )}
          </form>

          {/* Grid List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredCategories.map((cat) => (
              <div 
                key={cat.id} 
                className="relative flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition border border-transparent hover:border-emerald-200 dark:hover:border-gray-600 group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${activeTab === TransactionType.EXPENSE ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    {cat.icon || <Tag size={20} />}
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-200 text-center text-sm">{cat.label}</span>
                {cat.budgetLimit && cat.budgetLimit > 0 && (
                    <span className="text-xs text-gray-400 mt-1" dir="ltr">{cat.budgetLimit.toLocaleString()}</span>
                )}
                
                {!cat.isDefault && (
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="absolute top-2 left-2 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* --- Backup & Restore --- */}
       <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
                onClick={exportData}
                className="bg-emerald-50 dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 p-4 rounded-2xl border-2 border-emerald-100 dark:border-gray-600 flex flex-col items-center gap-2 hover:bg-emerald-100 dark:hover:bg-gray-600 transition"
            >
                <Download size={24} />
                <span className="font-bold text-sm">تصدير</span>
            </button>

            <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-600 flex flex-col items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
                <Upload size={24} />
                <span className="font-bold text-sm">استعادة</span>
                <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            </button>
       </div>
    </div>
  );
};
