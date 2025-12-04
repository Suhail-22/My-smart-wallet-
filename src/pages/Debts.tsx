import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DebtType, Debt } from '../types';
import { Plus, ArrowRightLeft, CheckCircle2, Camera, Image as ImageIcon, X, Forward, Filter, ArrowUpDown } from 'lucide-react';
import { ContactPicker } from '../components/ContactPicker';

type DebtSortOption = 'DUE_DATE_ASC' | 'DUE_DATE_DESC' | 'AMOUNT_DESC' | 'AMOUNT_ASC';

export const Debts: React.FC = () => {
  const { debts, addDebt, settleDebtThirdParty, transferDebt, wallets } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState<string | null>(null); // debt ID
  const [showTransferModal, setShowTransferModal] = useState<string | null>(null); // debt ID (Hawala)
  
  // Filter & Sort State
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [sortBy, setSortBy] = useState<DebtSortOption>('DUE_DATE_ASC');

  // Add Debt State
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({ type: DebtType.BORROWED, icon: '💰' });
  const [updateWallet, setUpdateWallet] = useState(true);
  const [selectedWalletId, setSelectedWalletId] = useState(wallets[0]?.id || '');
  const [debtImage, setDebtImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transferFileInputRef = useRef<HTMLInputElement>(null);

  // Settle/Transfer State
  const [thirdPartyName, setThirdPartyName] = useState('');
  
  // Transfer (Hawala) State
  const [newDebtorName, setNewDebtorName] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [transferImage, setTransferImage] = useState<string | null>(null);

  const QUICK_ICONS = ['💰', '🚗', '🏠', '📱', '💊', '🍔', '✈️', '🛒', '⚡'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isTransfer = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isTransfer) setTransferImage(reader.result as string);
        else setDebtImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebt.amount || !newDebt.personName) return;
    
    addDebt({
      id: crypto.randomUUID(),
      personName: newDebt.personName,
      amount: Number(newDebt.amount),
      initialAmount: Number(newDebt.amount),
      type: newDebt.type as DebtType,
      dueDate: newDebt.dueDate,
      notes: newDebt.notes,
      icon: newDebt.icon || '💰',
      receiptImage: debtImage || undefined
    }, updateWallet, selectedWalletId); 

    setShowAddModal(false);
    setNewDebt({ type: DebtType.BORROWED, icon: '💰' });
    setDebtImage(null);
    setUpdateWallet(true);
  };

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(showSettleModal && thirdPartyName) {
      settleDebtThirdParty(showSettleModal, thirdPartyName);
      setShowSettleModal(null);
      setThirdPartyName('');
    }
  };
  
  const handleTransferSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(showTransferModal && newDebtorName && transferAmount) {
          transferDebt(showTransferModal, newDebtorName, Number(transferAmount), transferNotes, transferImage || undefined);
          setShowTransferModal(null);
          setNewDebtorName('');
          setTransferAmount('');
          setTransferNotes('');
          setTransferImage(null);
      }
  };

  const openTransferModal = (debt: Debt) => {
      setShowTransferModal(debt.id);
      setTransferAmount(debt.amount.toString()); // Default to full amount
  };

  // Helper to process debts (Filter & Sort)
  const processDebts = (type: DebtType) => {
    let filtered = debts.filter(d => d.type === type);
    
    if (showActiveOnly) {
      filtered = filtered.filter(d => d.amount > 0);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'AMOUNT_DESC':
          return b.amount - a.amount;
        case 'AMOUNT_ASC':
          return a.amount - b.amount;
        case 'DUE_DATE_ASC':
          if (!a.dueDate) return 1; 
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'DUE_DATE_DESC':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        default:
          return 0;
      }
    });
  };

  const lentDebts = processDebts(DebtType.LENT);
  const borrowedDebts = processDebts(DebtType.BORROWED);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الديون</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary-700 transition shadow-lg shadow-primary-500/20"
        >
          <Plus size={18} />
          <span>دين جديد</span>
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
         <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition border ${showActiveOnly ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
            >
               <Filter size={16} />
               <span>{showActiveOnly ? 'الديون النشطة فقط' : 'عرض كل الديون'}</span>
            </button>
         </div>

         <div className="flex items-center gap-2 min-w-[200px]">
            <ArrowUpDown size={16} className="text-gray-400" />
            <select 
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value as DebtSortOption)}
               className="flex-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
            >
               <option value="DUE_DATE_ASC">تاريخ الاستحقاق (الأقرب)</option>
               <option value="DUE_DATE_DESC">تاريخ الاستحقاق (الأبعد)</option>
               <option value="AMOUNT_DESC">المبلغ (الأعلى)</option>
               <option value="AMOUNT_ASC">المبلغ (الأقل)</option>
            </select>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LENT (People owe me) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
               <ArrowRightLeft className="rotate-45" /> لي (دائن)
             </h3>
             <span className="text-xs font-mono bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md">{lentDebts.length}</span>
          </div>
          
          {lentDebts.map(debt => (
            <DebtCard 
                key={debt.id} 
                debt={debt} 
                onSettle={() => setShowSettleModal(debt.id)} 
                onTransfer={() => openTransferModal(debt)}
            />
          ))}
          {lentDebts.length === 0 && (
             <p className="text-gray-400 text-sm italic text-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">لا توجد ديون مستحقة لك.</p>
          )}
        </div>

        {/* BORROWED (I owe people) */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-red-600 dark:text-red-400 font-bold flex items-center gap-2">
                <ArrowRightLeft className="-rotate-45" /> عليّ (مدين)
              </h3>
              <span className="text-xs font-mono bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-md">{borrowedDebts.length}</span>
           </div>

          {borrowedDebts.map(debt => (
            <DebtCard 
                key={debt.id} 
                debt={debt} 
                onSettle={() => setShowSettleModal(debt.id)} 
                onTransfer={() => openTransferModal(debt)}
            />
          ))}
          {borrowedDebts.length === 0 && (
             <p className="text-gray-400 text-sm italic text-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">لا توجد ديون عليك.</p>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh] dark:text-white">
            <h3 className="text-xl font-bold mb-4">تسجيل دين جديد</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                 <button type="button" onClick={() => setNewDebt({...newDebt, type: DebtType.BORROWED})} className={`flex-1 py-2 rounded-md text-sm transition ${newDebt.type === DebtType.BORROWED ? 'bg-white dark:bg-gray-600 shadow text-red-600 dark:text-red-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>عليّ (استدنت)</button>
                 <button type="button" onClick={() => setNewDebt({...newDebt, type: DebtType.LENT})} className={`flex-1 py-2 rounded-md text-sm transition ${newDebt.type === DebtType.LENT ? 'bg-white dark:bg-gray-600 shadow text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>لي (أقرضت)</button>
              </div>
              
              <ContactPicker 
                onSelect={(name) => setNewDebt({...newDebt, personName: name})}
                initialValue={newDebt.personName}
              />

              {/* Icon Input */}
              <div className="space-y-2">
                 <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                     {QUICK_ICONS.map(icon => (
                         <button 
                            type="button" 
                            key={icon} 
                            onClick={() => setNewDebt({...newDebt, icon})}
                            className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                         >
                             {icon}
                         </button>
                     ))}
                 </div>
                 <div className="flex gap-2 items-center">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl border border-gray-200 dark:border-gray-600">
                        {newDebt.icon || '💰'}
                    </div>
                    <input 
                        type="text"
                        placeholder="رمز آخر أو إيموجي"
                        maxLength={2}
                        className="flex-1 border p-3 rounded-xl outline-none focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                        value={newDebt.icon || ''}
                        onChange={e => setNewDebt({...newDebt, icon: e.target.value})}
                    />
                 </div>
              </div>

              {/* Amount */}
              <input 
                type="number" 
                placeholder="المبلغ" 
                required
                className="w-full border p-3 rounded-xl outline-none focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600 font-mono text-lg"
                value={newDebt.amount || ''}
                onChange={e => {
                  const value = e.target.value;
                  const parsedAmount = parseFloat(value);
                  const amount = isNaN(parsedAmount) ? 0 : parsedAmount;
                  setNewDebt({...newDebt, amount});
                }}
              />

              {/* Wallet Update Toggle */}
              <div 
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 cursor-pointer"
                onClick={() => setUpdateWallet(!updateWallet)}
              >
                 <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${updateWallet ? 'bg-primary-600 border-primary-600' : 'bg-white dark:bg-gray-600 border-gray-400'}`}>
                    {updateWallet && <div className="w-2 h-2 bg-white rounded-full" />}
                 </div>
                 <div className="flex-1">
                    <p className="text-sm font-medium">تحديث رصيد المحفظة؟</p>
                 </div>
              </div>

              {updateWallet && (
                  <select 
                    className="w-full border p-3 rounded-xl outline-none focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                    value={selectedWalletId}
                    onChange={(e) => setSelectedWalletId(e.target.value)}
                  >
                      {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
              )}

              {/* Image Upload */}
              <div>
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, false)}
                />
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 p-3 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                    <Camera size={20} />
                    <span>{debtImage ? 'تغيير صورة السند' : 'إرفاق صورة السند / الفاتورة'}</span>
                </button>
                {debtImage && (
                    <div className="mt-2 relative">
                        <img src={debtImage} alt="Receipt Preview" className="h-32 rounded-lg object-cover border border-gray-200" />
                        <button 
                            type="button" 
                            onClick={() => setDebtImage(null)}
                            className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 shadow"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 dark:text-gray-400">تاريخ الاستحقاق</label>
                <input 
                  type="date"
                  className="w-full border p-3 rounded-xl outline-none focus:border-primary-500 text-gray-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={newDebt.dueDate || ''}
                  onChange={e => setNewDebt({...newDebt, dueDate: e.target.value})}
                />
              </div>
              <textarea 
                placeholder="ملاحظات"
                className="w-full border p-3 rounded-xl outline-none focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                value={newDebt.notes || ''}
                onChange={e => setNewDebt({...newDebt, notes: e.target.value})}
              />

               <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">إلغاء</button>
                <button type="submit" className="flex-1 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settle via 3rd Party Modal */}
      {showSettleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 dark:text-white">
            <h3 className="text-xl font-bold mb-2">تسوية عبر طرف ثالث</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              سيتم إغلاق هذا الدين وتسجيل معاملة مالية توضح أن التسوية تمت عن طريق وسيط.
            </p>
            <form onSubmit={handleSettleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">اسم الوسيط (الطرف الثالث)</label>
                <ContactPicker 
                  onSelect={(name) => setThirdPartyName(name)}
                  placeholder="شركة التحصيل / صديق مشترك"
                />
              </div>
               <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setShowSettleModal(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">إلغاء</button>
                <button type="submit" className="flex-1 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700">تأكيد التسوية</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
       {/* Hawala / Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 dark:text-white overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-2">تحويل الدين (حوالة)</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
               نقل الدين (كله أو جزء منه) إلى شخص آخر.
            </p>
            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نقل الدين إلى:</label>
                <ContactPicker 
                  onSelect={(name) => setNewDebtorName(name)}
                  placeholder="اسم الشخص الجديد"
                />
              </div>
              
              <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">المبلغ المحول</label>
                  <input 
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full border p-3 rounded-xl outline-none dark:bg-gray-700 dark:border-gray-600 font-mono"
                    placeholder="0.00"
                  />
              </div>

               <div>
                   <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ملاحظات التحويل</label>
                   <textarea 
                     value={transferNotes}
                     onChange={(e) => setTransferNotes(e.target.value)}
                     className="w-full border p-3 rounded-xl outline-none dark:bg-gray-700 dark:border-gray-600"
                     placeholder="سبب التحويل..."
                   />
               </div>

               {/* Transfer Image */}
              <div>
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={transferFileInputRef}
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, true)}
                />
                <button 
                    type="button"
                    onClick={() => transferFileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 p-2 rounded-xl flex items-center justify-center gap-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                    <Camera size={16} />
                    <span>{transferImage ? 'تغيير السند' : 'صورة سند التحويل'}</span>
                </button>
                {transferImage && (
                    <div className="mt-2 relative">
                        <img src={transferImage} alt="Receipt Preview" className="h-20 rounded-lg object-cover border border-gray-200" />
                        <button 
                            type="button" 
                            onClick={() => setTransferImage(null)}
                            className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 shadow"
                        >
                            <X size={10} />
                        </button>
                    </div>
                )}
              </div>

               <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setShowTransferModal(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600">إلغاء</button>
                <button type="submit" className="flex-1 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700">تأكيد التحويل</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DebtCard: React.FC<{ debt: Debt; onSettle: () => void; onTransfer: () => void }> = ({ debt, onSettle, onTransfer }) => {
  const [showImage, setShowImage] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl relative">
            {debt.icon || '💰'}
            {debt.receiptImage && (
                <button 
                    onClick={() => setShowImage(!showImage)}
                    className="absolute -bottom-1 -right-1 bg-primary-100 text-primary-600 rounded-full p-1 border border-white dark:border-gray-800"
                >
                    <ImageIcon size={12} />
                </button>
            )}
            </div>
            <div>
            <p className="font-bold text-gray-800 dark:text-white">{debt.personName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{debt.dueDate ? `يستحق في: ${debt.dueDate}` : 'لا يوجد تاريخ استحقاق'}</p>
            </div>
        </div>
        <div className="text-left">
            <p className={`font-bold text-lg ${debt.amount === 0 ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-white'}`} dir="ltr">
              {debt.amount.toLocaleString()}
            </p>
            {debt.amount === 0 && <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">تم السداد</span>}
        </div>
      </div>
      
      {/* Notes & Image */}
      {(debt.notes || (showImage && debt.receiptImage)) && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm">
              {debt.notes && <p className="text-gray-600 dark:text-gray-300 mb-2">{debt.notes}</p>}
              {showImage && debt.receiptImage && (
                  <div className="mt-2">
                      <img src={debt.receiptImage} alt="Debt Receipt" className="w-full h-auto rounded-lg border border-gray-200" />
                  </div>
              )}
          </div>
      )}

      {debt.amount > 0 && (
        <div className="flex justify-end gap-3 border-t border-gray-50 dark:border-gray-700 pt-2">
          <button 
            onClick={onTransfer}
            className="text-xs text-gray-500 hover:text-primary-600 hover:underline flex items-center gap-1 dark:text-gray-400"
          >
            <Forward size={12} /> تحويل الدين (حوالة)
          </button>
          <button 
            onClick={onSettle}
            className="text-xs text-primary-600 hover:underline flex items-center gap-1 dark:text-primary-400"
          >
            <CheckCircle2 size={12} /> تسوية / طرف ثالث
          </button>
        </div>
      )}
    </div>
  );
};