import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Investment, TelecomPackage, TransactionType } from '../types';
import { Plus, TrendingUp, ShoppingBag, PackagePlus, Banknote, AlertCircle } from 'lucide-react';
import { ContactPicker } from '../components/ContactPicker';

export const Investments: React.FC = () => {
  const { investments, addInvestment, processInvestmentSale, telecomPackages, addCustomPackage, transactions, addTransaction, categories, currency } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newInv, setNewInv] = useState<Partial<Investment>>({ type: 'COMMODITY' });
  const [deductFromWallet, setDeductFromWallet] = useState(true);

  // Sale/Trade State
  const [sellModalInv, setSellModalInv] = useState<Investment | null>(null);
  const [sellType, setSellType] = useState<'CREDIT' | 'PACKAGE'>('CREDIT'); 
  
  const [sellQty, setSellQty] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<TelecomPackage | null>(null);
  
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [newPkg, setNewPkg] = useState<Partial<TelecomPackage>>({ provider: 'Custom' });

  const [isCreditSale, setIsCreditSale] = useState(false);
  const [buyerName, setBuyerName] = useState('');

  const realizedProfit = transactions.reduce((sum, t) => sum + (t.profit || 0), 0);

  useEffect(() => {
    if (sellType === 'PACKAGE' && selectedPackage) {
      setSellPrice(selectedPackage.price.toString());
    }
  }, [selectedPackage, sellType]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if(newInv.assetName && newInv.quantity && newInv.avgBuyPrice) {
      const totalCost = Number(newInv.quantity) * Number(newInv.avgBuyPrice);
      
      // 1. Add Investment
      addInvestment({
        id: crypto.randomUUID(),
        assetName: newInv.assetName,
        type: newInv.type as any,
        quantity: Number(newInv.quantity),
        avgBuyPrice: Number(newInv.avgBuyPrice),
        currentPrice: Number(newInv.currentPrice || newInv.avgBuyPrice),
      });

      // 2. Deduct from Balance using "Inventory" Category
      if (deductFromWallet) {
        // Find 'Inventory' specifically, or fallback to first expense category
        const inventoryCat = categories.find(c => c.id === 'Inventory') || categories.find(c => c.type === TransactionType.EXPENSE);
        
        addTransaction({
            id: crypto.randomUUID(),
            amount: totalCost,
            date: new Date().toISOString().split('T')[0],
            description: `شراء أصول/بضاعة: ${newInv.assetName}`,
            category: inventoryCat ? inventoryCat.id : 'Other_Exp',
            type: TransactionType.EXPENSE
        });
      }

      setShowAdd(false);
      setNewInv({ type: 'COMMODITY' });
      setDeductFromWallet(true);
    }
  };

  const handleAddCustomPackage = (e: React.FormEvent) => {
      e.preventDefault();
      if(newPkg.name && newPkg.cost && newPkg.price) {
          addCustomPackage({
              id: crypto.randomUUID(),
              provider: 'Custom',
              name: newPkg.name,
              cost: Number(newPkg.cost),
              price: Number(newPkg.price),
              description: newPkg.description,
              isCustom: true
          });
          setShowAddPackage(false);
          setNewPkg({ provider: 'Custom' });
          alert('تم إضافة الباقة بنجاح');
      }
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellModalInv) return;

    let finalQty = 0;
    let finalPrice = Number(sellPrice);

    if (sellType === 'CREDIT') {
      finalQty = Number(sellQty); 
    } else if (sellType === 'PACKAGE') {
      if (!selectedPackage) return;
      finalQty = selectedPackage.cost;
    }

    if (!finalQty || !finalPrice) return;
    if (isCreditSale && !buyerName) return;

    processInvestmentSale(
      sellModalInv.id,
      finalQty,
      finalPrice,
      isCreditSale,
      buyerName
    );

    setSellModalInv(null);
    setSellQty('');
    setSellPrice('');
    setSelectedPackage(null);
    setBuyerName('');
    setIsCreditSale(false);
  };

  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider);
    setSelectedPackage(null);
    setSellPrice('');
  };

  const filteredPackages = selectedProvider 
    ? telecomPackages.filter(p => p.provider === selectedProvider)
    : [];

  const totalValue = investments.reduce((sum, i) => sum + (i.quantity * i.currentPrice), 0);
  const totalCost = investments.reduce((sum, i) => sum + (i.quantity * i.avgBuyPrice), 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة المخزون / الأصول</h2>
        <div className="flex gap-2">
            <button onClick={() => setShowAddPackage(true)} className="bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-gray-600 px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-primary-50 dark:hover:bg-gray-600 transition">
                <PackagePlus size={18} /> <span className="hidden sm:inline">باقة جديدة</span>
            </button>
            <button onClick={() => setShowAdd(true)} className="bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary-700 transition shadow-lg shadow-primary-500/20">
                <Plus size={18} /> <span className="hidden sm:inline">منتج جديد</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">قيمة المخزون الحالية</p>
           <p className="text-2xl font-bold text-primary-600 dark:text-primary-400" dir="ltr">{currency} {totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">رأس المال (تكلفة الشراء)</p>
           <p className="text-2xl font-bold text-gray-800 dark:text-white" dir="ltr">{currency} {totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-800">
           <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-1">
               <Banknote size={16} />
               <p className="font-bold text-sm">الأرباح التجارية المحققة</p>
           </div>
           <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
             +{realizedProfit.toLocaleString()}
           </p>
           <p className="text-xs text-emerald-500 dark:text-emerald-300 mt-1">الربح الصافي من عمليات البيع</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden overflow-x-auto">
        <table className="w-full text-right min-w-[600px]">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
            <tr>
              <th className="p-4 font-medium">اسم الصنف</th>
              <th className="p-4 font-medium">النوع</th>
              <th className="p-4 font-medium">الكمية</th>
              <th className="p-4 font-medium">التكلفة</th>
              <th className="p-4 font-medium">عمليات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {investments.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition dark:text-white">
                <td className="p-4 font-bold">{inv.assetName}</td>
                <td className="p-4 text-xs">
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">{inv.type === 'COMMODITY' ? 'تجاري' : inv.type}</span>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-300 font-mono text-lg">{inv.quantity.toLocaleString()}</td>
                <td className="p-4 text-gray-600 dark:text-gray-300" dir="ltr">{currency} {inv.avgBuyPrice}</td>
                <td className="p-4">
                  <button 
                    onClick={() => { setSellModalInv(inv); setSellType('CREDIT'); }}
                    className="bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-100 dark:hover:bg-gray-600 transition shadow-sm"
                  >
                    <ShoppingBag size={16} /> بيع
                  </button>
                </td>
              </tr>
            ))}
             {investments.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">لا توجد أصناف أو استثمارات مسجلة</td></tr>
             )}
          </tbody>
        </table>
      </div>

       {/* Add Investment Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh] dark:text-white">
            <h3 className="text-xl font-bold mb-4">إضافة منتج / أصل</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">اسم المنتج / الأصل</label>
                <input 
                  placeholder="مثال: رصيد، بضاعة، ملابس..." 
                  required
                  className="w-full border p-3 rounded-xl outline-none focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                  value={newInv.assetName || ''}
                  onChange={e => setNewInv({...newInv, assetName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">النوع</label>
                <select 
                  className="w-full border p-3 rounded-xl outline-none focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                  value={newInv.type}
                  onChange={e => setNewInv({...newInv, type: e.target.value as any})}
                >
                  <option value="COMMODITY">بضاعة / منتجات</option>
                  <option value="STOCK">أسهم</option>
                  <option value="CRYPTO">عملات رقمية</option>
                  <option value="REAL_ESTATE">عقار</option>
                  <option value="GOLD">ذهب</option>
                  <option value="OTHER">أخرى</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">الكمية</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      required
                      className="w-full border p-3 rounded-xl outline-none focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                      value={newInv.quantity || ''}
                      onChange={e => {
                        const qtyValue = e.target.value;
                        const quantity = parseFloat(qtyValue) || 0;
                        setNewInv({...newInv, quantity});
                      }}
                    />
                </div>
                <div>
                     <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">سعر التكلفة (للوحدة)</label>
                    <input 
                      type="number" 
                      placeholder="1" 
                      required
                      className="w-full border p-3 rounded-xl outline-none focus:border-primary-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                      value={newInv.avgBuyPrice || ''}
                      onChange={e => {
                        const priceValue = e.target.value;
                        const price = parseFloat(priceValue) || 0;
                        setNewInv({...newInv, avgBuyPrice: price});
                      }}
                    />
                </div>
              </div>

               {/* DEDUCT FROM WALLET OPTION */}
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-xl flex items-center gap-3 cursor-pointer" onClick={() => setDeductFromWallet(!deductFromWallet)}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${deductFromWallet ? 'bg-primary-600 border-primary-600' : 'bg-white dark:bg-gray-600 border-gray-400'}`}>
                    {deductFromWallet && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">خصم التكلفة من الرصيد؟</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">سيتم تسجيل "مصروف" بقيمة {Number(newInv.quantity) * Number(newInv.avgBuyPrice)}</p>
                </div>
              </div>
               
               <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl hover:bg-gray-200">إلغاء</button>
                <button type="submit" className="flex-1 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* (Other modals need similar Dark Mode classes applied) */}
    </div>
  );
};