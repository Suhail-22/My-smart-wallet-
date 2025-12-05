import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { TransactionType, Category, DebtType } from '../types'; // تأكد من وجود DebtType في ملف types.ts
import { 
    ArrowLeft, X, ArrowDownCircle, ArrowUpCircle, Handshake,
    PlusCircle, MinusCircle, DollarSign,
    Users, Contact as ContactIcon, AlignLeft, Calendar 
    // أيقونات Lucide أخرى قد تحتاجها
} from 'lucide-react';
import { ContactPicker } from '../components/ContactPicker';

// Simple Keyword Mapping for Auto-Categorization (بقي كما هو)
const KEYWORD_MAP: Record<string, string> = {
  'food': 'Food', 'lunch': 'Food', 'dinner': 'Food', 'burger': 'Food', 'supermarket': 'Food', 'bakery': 'Food',
  'taxi': 'Transport', 'uber': 'Transport', 'bus': 'Transport', 'fuel': 'Transport', 'gas': 'Transport',
  'wifi': 'Bills', 'net': 'Bills', 'internet': 'Bills', 'vodafone': 'Bills', 'electric': 'Bills', 'water': 'Bills',
  'pharmacy': 'Health', 'doctor': 'Health', 'med': 'Health',
  'shop': 'Shopping', 'clothes': 'Shopping', 'mall': 'Shopping'
};

// تعريف الخصائص لتلقي دالة الإغلاق (لحل خطأ TS2741)
interface TransactionFormProps {
    onClose: () => void;
}

// *** تم تعريف FormMode بشكل صريح لحل أخطاء TS2345 ***
type FormMode = 'INCOME' | 'EXPENSE' | 'debt' | null; 

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
  const { addTransaction, addCategory, categories, wallets, defaultTransactionType, currency } = useApp();
  const navigate = useNavigate();

  // حالة لتحديد نوع المعاملة (بدءًا من null لعرض شاشة الاختيار)
  const [transactionType, setTransactionType] = useState<FormMode>(null);

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    // *** تم حذف حقل time لحل خطأ TS2353 ***
    type: defaultTransactionType, 
    walletId: wallets[0]?.id || '',
    contactName: '',
    receiptImage: undefined as string | undefined, 
    isExcludedFromBalance: false,
    // حقول الدين الإضافية
    debtType: DebtType.BORROWED as DebtType, 
    dueDate: '',
  });

  // دالة لمعالجة الصورة
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData({ ...formData, receiptImage: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  // دالة الإرسال
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionType) return;
    
    if (transactionType === 'debt') {
        console.log("Saving Debt:", formData);
        // يجب أن تضيف هنا دالة addDebt إذا كانت موجودة لديك
    } else {
        // تصحيح هيكل الكائن ليتوافق مع نوع Transaction (بدون time)
        addTransaction({
            id: crypto.randomUUID(),
            amount: Number(formData.amount),
            type: transactionType as TransactionType,
            category: formData.category, 
            description: formData.description,
            date: formData.date,
            // *** تم حذف time: formData.time, ***
            walletId: formData.walletId,
            contactName: formData.contactName,
            receiptImage: formData.receiptImage, 
            isExcludedFromBalance: formData.isExcludedFromBalance,
            profit: undefined, 
            investmentId: undefined,
        });
    }

    onClose(); 
  };


  // -----------------------------------------------------
  // 1. شاشة اختيار نوع المعاملة (ستظهر أولاً)
  // -----------------------------------------------------

  if (!transactionType) {
    return (
        <div className="p-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">اختر نوع المعاملة</h2>
            
            <div className="space-y-4">
                {/* زر الدخل */}
                <button
                    onClick={() => setTransactionType('INCOME')} 
                    className="flex items-center justify-between w-full p-4 bg-green-100 dark:bg-green-800/50 rounded-xl shadow transition-transform hover:scale-[1.01] border-2 border-green-200 dark:border-green-700"
                >
                    <span className="flex items-center text-green-700 dark:text-green-300 font-bold text-lg">
                        <ArrowUpCircle size={28} className="ml-3" />
                        إضافة **دخل**
                    </span>
                    <ArrowLeft size={24} className="text-green-700 dark:text-green-300" />
                </button>

                {/* زر المصروفات */}
                <button
                    onClick={() => setTransactionType('EXPENSE')} 
                    className="flex items-center justify-between w-full p-4 bg-red-100 dark:bg-red-800/50 rounded-xl shadow transition-transform hover:scale-[1.01] border-2 border-red-200 dark:border-red-700"
                >
                    <span className="flex items-center text-red-700 dark:text-red-300 font-bold text-lg">
                        <ArrowDownCircle size={28} className="ml-3" />
                        إضافة **مصروف**
                    </span>
                    <ArrowLeft size={24} className="text-red-700 dark:text-red-300" />
                </button>

                {/* زر الديون */}
                <button
                    onClick={() => setTransactionType('debt')}
                    className="flex items-center justify-between w-full p-4 bg-blue-100 dark:bg-blue-800/50 rounded-xl shadow transition-transform hover:scale-[1.01] border-2 border-blue-200 dark:border-blue-700"
                >
                    <span className="flex items-center text-blue-700 dark:text-blue-300 font-bold text-lg">
                        <Handshake size={28} className="ml-3" />
                        تسجيل **دين**
                    </span>
                    <ArrowLeft size={24} className="text-blue-700 dark:text-blue-300" />
                </button>
            </div>
        </div>
    );
  }

  // -----------------------------------------------------
  // 2. نموذج الإدخال التفصيلي (يظهر بعد اختيار النوع)
  // -----------------------------------------------------

  const title = transactionType === 'INCOME' ? 'إضافة دخل جديد' : 
                transactionType === 'EXPENSE' ? 'إضافة مصروف جديد' : 'تسجيل دين'; 
  
  const typeColor = transactionType === 'INCOME' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                    transactionType === 'EXPENSE' ? 'bg-red-500 shadow-red-500/50' : 'bg-blue-500 shadow-blue-500/50';
  
  const categoryOptions = categories.filter(c => 
    c.type === transactionType || transactionType === 'debt' 
  );

  return (
    <div className="flex flex-col h-full">
        {/* شريط العنوان والرجوع */}
        <div className="flex items-center justify-between mb-6 border-b pb-3 dark:border-gray-700">
            <button 
                onClick={() => setTransactionType(null)} 
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                aria-label="الرجوع إلى اختيار النوع"
            >
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
            {/* زر الإغلاق X */}
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            >
                <X size={24} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto space-y-4 pb-20">
            {/* حقل المبلغ */}
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">المبلغ</label>
                <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-500 ml-2">{currency}</span>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        className="flex-1 p-0 border-none outline-none focus:ring-0 text-3xl font-extrabold text-gray-900 dark:text-white bg-transparent text-right"
                    />
                </div>
            </div>

            {/* الحقول الأخرى */}
            <div className="space-y-4">
                {/* حقل المحفظة */}
                <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">المحفظة / الحساب</span>
                    <select
                        value={formData.walletId}
                        onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    >
                        {wallets.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>
                </label>

                {/* حقل التصنيف (يظهر للدخل والمصروف) */}
                {transactionType !== 'debt' && (
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">التصنيف</span>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            className="w-full mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">-- اختر تصنيفاً --</option>
                            {categories.filter(c => c.type === transactionType).map(c => ( 
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                    </label>
                )}
                
                {/* حقل الطرف المقابل (للدين أو معاملة شخصية) */}
                {(transactionType === 'debt' || transactionType === 'EXPENSE' ) && ( 
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">الطرف المقابل (شخص/جهة)</span>
                        <div className="mt-1">
                            <ContactPicker 
                                onSelect={(name) => setFormData({...formData, contactName: name})}
                                initialValue={formData.contactName}
                                placeholder='اسم الشخص أو الجهة'
                            />
                        </div>
                    </label>
                )}

                {/* حقول الدين الإضافية (تظهر فقط إذا كان النوع هو دين) */}
                {transactionType === 'debt' && (
                    <>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">نوع الدين</span>
                            <div className="flex space-x-4 mt-1">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="debtType"
                                        value={DebtType.BORROWED} // علي (أنا المدين)
                                        checked={formData.debtType === DebtType.BORROWED}
                                        onChange={(e) => setFormData({ ...formData, debtType: e.target.value as DebtType })}
                                        required
                                        className="form-radio text-blue-600 dark:text-blue-400"
                                    />
                                    <span className="ml-2 text-gray-700 dark:text-gray-300">علي (أنا المدين)</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="debtType"
                                        value={DebtType.LENT} // لي (أنا الدائن)
                                        checked={formData.debtType === DebtType.LENT}
                                        onChange={(e) => setFormData({ ...formData, debtType: e.target.value as DebtType })}
                                        required
                                        className="form-radio text-blue-600 dark:text-blue-400"
                                    />
                                    <span className="ml-2 text-gray-700 dark:text-gray-300">لي (أنا الدائن)</span>
                                </label>
                            </div>
                        </label>
                        
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">تاريخ الاستحقاق (اختياري)</span>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                            />
                        </label>
                    </>
                )}


                {/* حقل الوصف */}
                <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">الوصف / ملاحظات</span>
                    <input
                        type="text"
                        placeholder="أدخل وصفاً للمعاملة"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    />
                </label>

                {/* حقل التاريخ فقط (تم حذف الوقت) */}
                <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">التاريخ</span>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    />
                </label>
                
                {/* حقل الصورة */}
                <label className="block pt-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">سند/صورة المعاملة (اختياري)</span>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="w-full mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {formData.receiptImage && (
                        <div className="mt-2 relative">
                            <img src={formData.receiptImage} alt="Receipt" className="w-full h-auto rounded-lg border dark:border-gray-700" />
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, receiptImage: undefined})}
                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </label>
                
                {/* مفتاح عدم التأثير على الرصيد */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600 dark:text-gray-300 font-bold">عدم التأثير على الرصيد</span>
                        <div 
                            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${formData.isExcludedFromBalance ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            onClick={() => setFormData({...formData, isExcludedFromBalance: !formData.isExcludedFromBalance})}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.isExcludedFromBalance ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">عند تفعيلها سيتم تجاهل هذه المعاملة من رصيد المحفظة المحددة</p>
                </div>

            </div>
            
            {/* زر الإرسال الثابت */}
            <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50">
                <button 
                    type="submit"
                    className={`w-full text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-colors ${typeColor}`}
                >
                    حفظ المعاملة
                </button>
            </div>
        </form>
    </div>
  );
};

export default TransactionForm;
