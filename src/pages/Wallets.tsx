
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Wallet as WalletIcon, Plus, Eye, EyeOff, Trash2, ArrowRightLeft } from 'lucide-react';

export const Wallets: React.FC = () => {
  const { wallets, addWallet, deleteWallet, toggleWalletVisibility, transferBalance, currency } = useApp();
  
  const [newWalletName, setNewWalletName] = useState('');
  const [transferData, setTransferData] = useState({ from: '', to: '', amount: '' });

  const handleAddWallet = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newWalletName.trim()) return;
      addWallet({
          id: crypto.randomUUID(),
          name: newWalletName,
          type: 'CASH',
          balance: 0,
          currency: 'YER',
          isHidden: false
      });
      setNewWalletName('');
  };

  const handleTransfer = (e: React.FormEvent) => {
      e.preventDefault();
      if(transferData.from && transferData.to && transferData.amount && transferData.from !== transferData.to) {
          transferBalance(transferData.from, transferData.to, Number(transferData.amount));
          setTransferData({ from: '', to: '', amount: '' });
          alert('تم التحويل بنجاح!');
      }
  };

  const totalBalance = wallets.filter(w => !w.isHidden).reduce((sum, w) => sum + w.balance, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة المحافظ</h2>

      {/* Total Balance Card */}
      <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg shadow-emerald-600/20 text-center">
          <p className="opacity-80 text-sm mb-1">الرصيد الكلي (الظاهر)</p>
          <h3 className="text-4xl font-bold" dir="ltr">{totalBalance.toLocaleString()} {currency}</h3>
      </div>

      {/* Wallet List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 space-y-3">
        <h3 className="font-bold text-gray-800 dark:text-white px-2">محافظي</h3>
        {wallets.map(w => (
            <div key={w.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
                        {w.type === 'BANK' ? <CreditCard size={20} /> : <WalletIcon size={20} />}
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-bold ${w.isHidden ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                            {w.name}
                        </span>
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400" dir="ltr">
                            {w.balance.toLocaleString()} {currency}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => toggleWalletVisibility(w.id)} 
                        className={`p-2 rounded-lg transition ${w.isHidden ? 'text-gray-400 bg-gray-200 dark:bg-gray-600' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'}`}
                    >
                        {w.isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {wallets.length > 1 && (
                        <button onClick={() => deleteWallet(w.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg">
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>
        ))}

        {/* Add Wallet Form */}
        <form onSubmit={handleAddWallet} className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <input 
                value={newWalletName}
                onChange={e => setNewWalletName(e.target.value)}
                placeholder="اسم محفظة جديدة..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:border-emerald-500"
            />
            <button type="submit" className="bg-emerald-600 text-white px-4 rounded-xl hover:bg-emerald-700 transition">
                <Plus size={20} />
            </button>
        </form>
      </div>

      {/* Transfer Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <ArrowRightLeft className="text-emerald-600" />
            تحويل رصيد
        </h3>
        <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
                <select 
                    className="border p-3 rounded-xl bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-emerald-500"
                    value={transferData.from}
                    onChange={e => setTransferData({...transferData, from: e.target.value})}
                >
                    <option value="">من...</option>
                    {wallets.filter(w => !w.isHidden).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                <select 
                    className="border p-3 rounded-xl bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-emerald-500"
                    value={transferData.to}
                    onChange={e => setTransferData({...transferData, to: e.target.value})}
                >
                    <option value="">إلى...</option>
                    {wallets.filter(w => w.id !== transferData.from).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
            </div>
            <div className="flex gap-2">
                <input 
                    type="number"
                    className="flex-1 border p-3 rounded-xl bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:border-emerald-500 font-mono"
                    placeholder="المبلغ"
                    value={transferData.amount}
                    onChange={e => setTransferData({...transferData, amount: e.target.value})}
                />
                <button 
                    onClick={handleTransfer} 
                    disabled={!transferData.from || !transferData.to || !transferData.amount}
                    className="bg-emerald-600 text-white px-6 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                >
                    تحويل
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
