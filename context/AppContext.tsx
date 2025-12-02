
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Debt, Investment, DashboardWidget, TransactionType, DebtType, Category, ZakatSettings, Contact, TelecomPackage, Theme, Currency, FinancialGoal, Wallet } from '../types';

interface AppContextType {
  transactions: Transaction[];
  debts: Debt[];
  investments: Investment[];
  widgets: DashboardWidget[];
  categories: Category[];
  wallets: Wallet[];
  zakatSettings: ZakatSettings;
  contacts: Contact[];
  telecomPackages: TelecomPackage[];
  theme: Theme;
  currency: Currency;
  goals: FinancialGoal[];
  defaultTransactionType: TransactionType;
  
  addTransaction: (t: Transaction) => void;
  addDebt: (d: Debt, updateWallet?: boolean, walletId?: string) => void;
  updateDebt: (d: Debt) => void;
  addInvestment: (i: Investment) => void;
  updateInvestment: (i: Investment) => void;
  toggleWidget: (id: string) => void;
  moveWidget: (id: string, direction: 'up' | 'down') => void;
  settleDebtThirdParty: (debtId: string, thirdPartyName: string) => void;
  transferDebt: (debtId: string, newPersonName: string, amount: number, notes?: string, image?: string) => void;
  addCategory: (c: Category) => void;
  updateCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  updateZakatSettings: (settings: Partial<ZakatSettings>) => void;
  getZakatBase: () => { cash: number; investments: number; debts: number; total: number };
  addContact: (c: Contact) => void;
  processInvestmentSale: (invId: string, qty: number, price: number, isCredit: boolean, buyerName?: string) => void;
  addCustomPackage: (pkg: TelecomPackage) => void;
  setTheme: (t: Theme) => void;
  setCurrency: (c: Currency) => void;
  setDefaultTransactionType: (t: TransactionType) => void;
  addGoal: (g: FinancialGoal) => void;
  updateGoal: (g: FinancialGoal) => void;
  deleteGoal: (id: string) => void;
  addWallet: (w: Wallet) => void;
  deleteWallet: (id: string) => void;
  toggleWalletVisibility: (id: string) => void;
  transferBalance: (fromId: string, toId: string, amount: number) => void;
  exportData: () => void;
  importData: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_WIDGETS: DashboardWidget[] = [
  { id: 'balance', type: 'BALANCE', visible: true, order: 0 },
  { id: 'wallets', type: 'WALLETS', visible: true, order: 1 },
  { id: 'insights', type: 'AI_INSIGHTS', visible: true, order: 2 },
  { id: 'debt_summary', type: 'DEBT_SUMMARY', visible: true, order: 3 },
  { id: 'expense_chart', type: 'EXPENSE_CHART', visible: true, order: 4 },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'Food', label: 'طعام وشراب', icon: '🍔', type: TransactionType.EXPENSE, isDefault: true, budgetLimit: 50000 },
  { id: 'Transport', label: 'مواصلات', icon: '🚕', type: TransactionType.EXPENSE, isDefault: true, budgetLimit: 20000 },
  { id: 'Inventory', label: 'بضاعة / مخزون', icon: '📦', type: TransactionType.EXPENSE, isDefault: true, budgetLimit: 0 },
  { id: 'Shopping', label: 'تسوق', icon: '🛍️', type: TransactionType.EXPENSE, isDefault: true, budgetLimit: 30000 },
  { id: 'Bills', label: 'فواتير', icon: '🧾', type: TransactionType.EXPENSE, isDefault: true, budgetLimit: 15000 },
  { id: 'Health', label: 'صحة', icon: '💊', type: TransactionType.EXPENSE, isDefault: true, budgetLimit: 10000 },
  { id: 'Education', label: 'تعليم', icon: '🎓', type: TransactionType.EXPENSE, isDefault: true, budgetLimit: 20000 },
  { id: 'Zakat', label: 'زكاة وصدقات', icon: '🤝', type: TransactionType.EXPENSE, isDefault: true, budgetLimit: 0 }, 
  { id: 'Salary', label: 'راتب', icon: '💰', type: TransactionType.INCOME, isDefault: true },
  { id: 'Investment', label: 'عائد استثمار', icon: '📈', type: TransactionType.INCOME, isDefault: true },
  { id: 'Trading', label: 'مبيعات/تجارة', icon: '🏪', type: TransactionType.INCOME, isDefault: true },
  { id: 'Debt_Inc', label: 'استدانة (دين)', icon: '📥', type: TransactionType.INCOME, isDefault: true },
  { id: 'Debt_Exp', label: 'إقراض (دين)', icon: '📤', type: TransactionType.EXPENSE, isDefault: true },
  { id: 'Transfer_Out', label: 'تحويل صادر', icon: '📤', type: TransactionType.EXPENSE, isDefault: true },
  { id: 'Transfer_In', label: 'تحويل وارد', icon: '📥', type: TransactionType.INCOME, isDefault: true },
  { id: 'Other_Inc', label: 'دخل آخر', icon: '💵', type: TransactionType.INCOME, isDefault: true },
  { id: 'Other_Exp', label: 'مصروف آخر', icon: '💸', type: TransactionType.EXPENSE, isDefault: true },
];

const YEMEN_PACKAGES: TelecomPackage[] = [
  { id: 'ym_mzaia_monthly', provider: 'Yemen Mobile', name: 'مزايا الشهرية (4G)', cost: 3000, price: 3500, description: '300 دقيقة + 2 جيجا نت' },
  { id: 'ym_mzaia_weekly', provider: 'Yemen Mobile', name: 'مزايا الأسبوعية', cost: 1000, price: 1200, description: '100 دقيقة + 300 ميجا' },
  { id: 'ym_hadaya_monthly', provider: 'Yemen Mobile', name: 'هدايا الشهرية', cost: 2000, price: 2300, description: '200 دقيقة + 400 ميجا' },
  { id: 'ym_hadaya_max', provider: 'Yemen Mobile', name: 'هدايا ماكس', cost: 4000, price: 4500, description: 'دقائق ونت مضاعف' },
  { id: 'ym_net_4g_12gb', provider: 'Yemen Mobile', name: 'نت 4G - 12 جيجا', cost: 4400, price: 4800, description: 'صلاحية 30 يوم' },
  { id: 'you_mix_300', provider: 'You', name: 'مكس 300', cost: 300, price: 400, description: 'يومي' },
  { id: 'you_mix_monthly', provider: 'You', name: 'مكس شهري', cost: 3000, price: 3500, description: '' },
  { id: 'saba_super_yal', provider: 'SabaFon', name: 'سوبر يال', cost: 2500, price: 2800, description: 'دقائق لكل الشبكات' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('debts');
    return saved ? JSON.parse(saved) : [];
  });

  const [investments, setInvestments] = useState<Investment[]>(() => {
    const saved = localStorage.getItem('investments');
    return saved ? JSON.parse(saved) : [];
  });

  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    const saved = localStorage.getItem('widgets');
    return saved ? JSON.parse(saved) : INITIAL_WIDGETS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem('wallets');
    const loadedWallets = saved ? JSON.parse(saved) : [];
    const hasMain = loadedWallets.some((w: Wallet) => w.type === 'CASH');
    const hasDebt = loadedWallets.some((w: Wallet) => w.type === 'DEBT');
    
    let initialWallets = [...loadedWallets];
    if (!hasMain) {
       initialWallets.push({ id: 'main', name: 'الكاش / المحفظة', type: 'CASH', balance: 0, currency: 'YER', isHidden: false });
    }
    if (!hasDebt) {
       initialWallets.push({ id: 'debt_ledger', name: 'سجل الديون (الذمم)', type: 'DEBT', balance: 0, currency: 'YER', isHidden: false });
    }
    return initialWallets;
  });

  const [zakatSettings, setZakatSettings] = useState<ZakatSettings>(() => {
    const saved = localStorage.getItem('zakatSettings');
    return saved ? JSON.parse(saved) : { goldPrice: 0, nisabType: 'GOLD' };
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('contacts');
    return saved ? JSON.parse(saved) : [];
  });

  const [customPackages, setCustomPackages] = useState<TelecomPackage[]>(() => {
    const saved = localStorage.getItem('customPackages');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return (saved as Currency) || 'YER';
  });
  
  const [defaultTransactionType, setDefaultTransactionType] = useState<TransactionType>(() => {
    const saved = localStorage.getItem('defaultTransactionType');
    return (saved as TransactionType) || TransactionType.EXPENSE;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('debts', JSON.stringify(debts)), [debts]);
  useEffect(() => localStorage.setItem('investments', JSON.stringify(investments)), [investments]);
  useEffect(() => localStorage.setItem('widgets', JSON.stringify(widgets)), [widgets]);
  useEffect(() => localStorage.setItem('categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('wallets', JSON.stringify(wallets)), [wallets]);
  useEffect(() => localStorage.setItem('zakatSettings', JSON.stringify(zakatSettings)), [zakatSettings]);
  useEffect(() => localStorage.setItem('contacts', JSON.stringify(contacts)), [contacts]);
  useEffect(() => localStorage.setItem('customPackages', JSON.stringify(customPackages)), [customPackages]);
  useEffect(() => localStorage.setItem('theme', theme), [theme]);
  useEffect(() => localStorage.setItem('currency', currency), [currency]);
  useEffect(() => localStorage.setItem('defaultTransactionType', defaultTransactionType), [defaultTransactionType]);
  useEffect(() => localStorage.setItem('goals', JSON.stringify(goals)), [goals]);

  useEffect(() => {
    setWallets(prevWallets => {
      if (prevWallets.length === 0) return prevWallets;
      
      const mainWalletId = prevWallets.find(w => w.type === 'CASH')?.id || prevWallets[0].id;
      
      return prevWallets.map(w => {
        if (w.type === 'DEBT') {
           const totalLent = debts.filter(d => d.type === DebtType.LENT).reduce((sum, d) => sum + d.amount, 0);
           const totalBorrowed = debts.filter(d => d.type === DebtType.BORROWED).reduce((sum, d) => sum + d.amount, 0);
           return { ...w, balance: totalLent - totalBorrowed };
        }

        const wTrans = transactions.filter(t => {
           if (t.isExcludedFromBalance) return false;
           if (t.walletId) return t.walletId === w.id;
           return w.id === mainWalletId;
        });

        const income = wTrans.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const expense = wTrans.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
        return { ...w, balance: income - expense };
      });
    });
  }, [transactions, debts]);

  const addTransaction = (t: Transaction) => {
    const transaction = { ...t, walletId: t.walletId || wallets[0]?.id };
    setTransactions(prev => [transaction, ...prev]);
    
    // Auto-save contact if new
    if (t.contactName && !contacts.find(c => c.name === t.contactName)) {
        addContact({ id: crypto.randomUUID(), name: t.contactName });
    }
  };

  const addDebt = (d: Debt, updateWallet: boolean = false, walletId?: string) => {
    setDebts(prev => [d, ...prev]);
    if (!contacts.find(c => c.name === d.personName)) {
      addContact({ id: crypto.randomUUID(), name: d.personName });
    }

    if (updateWallet) {
      const targetWalletId = walletId || wallets.find(w => w.type === 'CASH')?.id || wallets[0].id;
      if (d.type === DebtType.BORROWED) {
        addTransaction({
          id: crypto.randomUUID(),
          amount: d.amount,
          date: new Date().toISOString().split('T')[0],
          description: `استدانة من ${d.personName} (${d.icon || ''})`,
          category: 'Debt_Inc',
          type: TransactionType.INCOME,
          walletId: targetWalletId,
          contactName: d.personName
        });
      } else {
        addTransaction({
          id: crypto.randomUUID(),
          amount: d.amount,
          date: new Date().toISOString().split('T')[0],
          description: `إقراض لـ ${d.personName} (${d.icon || ''})`,
          category: 'Debt_Exp',
          type: TransactionType.EXPENSE,
          walletId: targetWalletId,
          contactName: d.personName
        });
      }
    }
  };

  const updateDebt = (updatedDebt: Debt) => {
    setDebts(prev => prev.map(d => d.id === updatedDebt.id ? updatedDebt : d));
  };

  const addInvestment = (i: Investment) => {
    setInvestments(prev => [i, ...prev]);
  };

  const updateInvestment = (updatedInv: Investment) => {
    setInvestments(prev => prev.map(i => i.id === updatedInv.id ? updatedInv : i));
  };

  const toggleWidget = (id: string) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    setWidgets(prev => {
      const index = prev.findIndex(w => w.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const newWidgets = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
      return newWidgets.map((w, i) => ({ ...w, order: i }));
    });
  };

  const settleDebtThirdParty = (debtId: string, thirdPartyName: string) => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    const updatedDebt = { ...debt, amount: 0, notes: `${debt.notes || ''} | تمت التسوية عبر طرف ثالث: ${thirdPartyName}` };
    updateDebt(updatedDebt);
  };
  
  const transferDebt = (debtId: string, newPersonName: string, amount: number, notes?: string, image?: string) => {
     const oldDebt = debts.find(d => d.id === debtId);
     if(!oldDebt) return;

     const actualAmount = Math.min(amount, oldDebt.amount);

     const newAmount = oldDebt.amount - actualAmount;
     updateDebt({ 
        ...oldDebt, 
        amount: newAmount, 
        notes: (oldDebt.notes || '') + ` | تم تحويل مبلغ ${actualAmount} إلى ${newPersonName}`
     });

     const newDebtObj: Debt = {
        ...oldDebt,
        id: crypto.randomUUID(),
        personName: newPersonName,
        amount: actualAmount,
        initialAmount: actualAmount, 
        notes: `تحويل (حوالة) من ${oldDebt.personName} - ${notes || ''}`,
        receiptImage: image || undefined
     };
     
     addDebt(newDebtObj, false); 
     
    if (!contacts.find(c => c.name === newPersonName)) {
      addContact({ id: crypto.randomUUID(), name: newPersonName });
    }
  };

  const addCategory = (c: Category) => setCategories(prev => [...prev, c]);
  const updateCategory = (updatedCat: Category) => setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c));
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));
  
  const updateZakatSettings = (settings: Partial<ZakatSettings>) => setZakatSettings(prev => ({ ...prev, ...settings }));
  const addContact = (c: Contact) => setContacts(prev => [...prev, c]);
  const addCustomPackage = (pkg: TelecomPackage) => setCustomPackages(prev => [...prev, pkg]);
  
  const addGoal = (g: FinancialGoal) => setGoals(prev => [...prev, g]);
  const updateGoal = (g: FinancialGoal) => setGoals(prev => prev.map(goal => goal.id === g.id ? g : goal));
  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));

  const addWallet = (w: Wallet) => setWallets(prev => [...prev, w]);
  const deleteWallet = (id: string) => {
    if (wallets.length <= 1) {
      alert("لا يمكن حذف المحفظة الوحيدة المتبقية.");
      return;
    }
    setWallets(prev => prev.filter(w => w.id !== id));
  };
  
  const toggleWalletVisibility = (id: string) => {
    setWallets(prev => prev.map(w => w.id === id ? { ...w, isHidden: !w.isHidden } : w));
  };
  
  const transferBalance = (fromId: string, toId: string, amount: number) => {
    const fromWallet = wallets.find(w => w.id === fromId);
    const toWallet = wallets.find(w => w.id === toId);
    if (!fromWallet || !toWallet) return;

    const date = new Date().toISOString().split('T')[0];
    const outCat = categories.find(c => c.id === 'Transfer_Out') ? 'Transfer_Out' : 'Other_Exp';
    const inCat = categories.find(c => c.id === 'Transfer_In') ? 'Transfer_In' : 'Other_Inc';

    const expenseTx: Transaction = {
       id: crypto.randomUUID(),
       amount,
       category: outCat,
       description: `تحويل إلى ${toWallet.name}`,
       date,
       type: TransactionType.EXPENSE,
       walletId: fromId,
       isExcludedFromBalance: false
    };

    const incomeTx: Transaction = {
       id: crypto.randomUUID(),
       amount,
       category: inCat,
       description: `تحويل من ${fromWallet.name}`,
       date,
       type: TransactionType.INCOME,
       walletId: toId,
       isExcludedFromBalance: false
    };

    setTransactions(prev => [expenseTx, incomeTx, ...prev]);
  };

  const processInvestmentSale = (invId: string, qty: number, price: number, isCredit: boolean, buyerName?: string) => {
    const inv = investments.find(i => i.id === invId);
    if (!inv) return;
    const newQty = inv.quantity - qty;
    if (newQty < 0) {
      alert('خطأ: الكمية/الرصيد المباع أكبر من المتوفر');
      return;
    }
    const costOfGoodsSold = inv.avgBuyPrice * qty;
    const realizedProfit = price - costOfGoodsSold;
    updateInvestment({ ...inv, quantity: newQty });

    if (isCredit && buyerName) {
      addDebt({
        id: crypto.randomUUID(),
        personName: buyerName,
        amount: price,
        initialAmount: price,
        type: DebtType.LENT,
        notes: `شراء/تفعيل ${inv.assetName} (ربح: ${realizedProfit})`,
        dueDate: undefined 
      });
    } else {
      const catId = categories.find(c => c.label.includes('مبيعات') || c.id === 'Trading')?.id || 'Investment';
      addTransaction({
        id: crypto.randomUUID(),
        amount: price,
        category: catId,
        date: new Date().toISOString().split('T')[0],
        description: `بيع/تفعيل ${inv.assetName}`,
        type: TransactionType.INCOME,
        profit: realizedProfit,
        contactName: buyerName
      });
    }
  };

  const getZakatBase = () => {
    const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME && !t.isExcludedFromBalance).reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE && !t.isExcludedFromBalance).reduce((sum, t) => sum + t.amount, 0);
    const cash = Math.max(0, totalIncome - totalExpense);
    const investmentsVal = investments.reduce((sum, i) => sum + (i.quantity * i.currentPrice), 0);
    const debtsVal = debts.filter(d => d.type === DebtType.LENT).reduce((sum, d) => sum + d.amount, 0);
    return { cash, investments: investmentsVal, debts: debtsVal, total: cash + investmentsVal + debtsVal };
  };

  const exportData = () => {
    const data = {
      transactions, debts, investments, widgets, categories, wallets, zakatSettings, contacts, customPackages, goals, theme, currency, defaultTransactionType
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_wallet_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.transactions) setTransactions(data.transactions);
      if (data.debts) setDebts(data.debts);
      if (data.investments) setInvestments(data.investments);
      if (data.categories) setCategories(data.categories);
      if (data.wallets) setWallets(data.wallets);
      if (data.contacts) setContacts(data.contacts);
      if (data.customPackages) setCustomPackages(data.customPackages);
      if (data.goals) setGoals(data.goals);
      if (data.zakatSettings) setZakatSettings(data.zakatSettings);
      if (data.currency) setCurrency(data.currency);
      if (data.defaultTransactionType) setDefaultTransactionType(data.defaultTransactionType);
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      transactions, debts, investments, widgets, categories, zakatSettings, contacts, 
      telecomPackages: [...YEMEN_PACKAGES, ...customPackages],
      theme, currency, goals, wallets, defaultTransactionType,
      addTransaction, addDebt, updateDebt, addInvestment, updateInvestment,
      toggleWidget, moveWidget, settleDebtThirdParty, transferDebt,
      addCategory, updateCategory, deleteCategory, updateZakatSettings, getZakatBase,
      addContact, processInvestmentSale, addCustomPackage,
      setTheme, setCurrency, setDefaultTransactionType, addGoal, updateGoal, deleteGoal,
      addWallet, deleteWallet, toggleWalletVisibility, transferBalance, exportData, importData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
