// src/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, TransactionType, Wallet, WalletType, Category, Debt, DebtType } from '../types';

const initialWallets: Wallet[] = [
  { id: 'main-cash', name: 'الكاش', type: 'CASH', balance: 0, currency: 'YER', color: '#6366f1' },
  { id: 'bank-01', name: 'البنك', type: 'BANK', balance: 0, currency: 'YER', color: '#10b981' },
];

const initialCategories: Category[] = [
  {
    id: 'food',
    label: 'الطعام',
    icon: '🍔',
    type: 'EXPENSE',
    children: [
      { id: 'fruits', label: 'فواكه', icon: '🍇', type: 'EXPENSE' },
      { id: 'sandwiches', label: 'سندوتشات', icon: '🥪', type: 'EXPENSE' },
      { id: 'meat', label: 'لحوم', icon: '🥩', type: 'EXPENSE' },
    ],
  },
  { id: 'transport', label: 'المواصلات', icon: '🚗', type: 'EXPENSE' },
  { id: 'salary', label: 'الراتب', icon: '💼', type: 'INCOME' },
  { id: 'gifts', label: 'الهدايا', icon: '🎁', type: 'INCOME' },
];

const initialTransactions: Transaction[] = [];
const initialDebts: Debt[] = [];

interface AppContextType {
  // المعاملات
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, updatedData: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // الديون
  debts: Debt[];
  addDebt: (debt: Debt) => void;
  updateDebt: (id: string, updatedData: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  settleDebtThirdParty: (debtId: string, thirdParty: string) => void;
  transferDebt: (fromDebtId: string, toPerson: string, amount: number) => void;

  // المحافظ
  wallets: Wallet[];
  addWallet: (wallet: Omit<Wallet, 'id'>) => void;
  updateWallet: (id: string, updatedData: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;

  // التصنيفات
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  addSubcategory: (parentId: string, subcategory: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updatedData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // الإعدادات
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currency: string;
  defaultTransactionType: TransactionType;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const currency = 'YER';
  const defaultTransactionType: TransactionType = 'EXPENSE';

  // === المعاملات ===
  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, tx]);
  };

  const updateTransaction = (id: string, updatedData: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, ...updatedData } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // === الديون ===
  const addDebt = (debt: Debt) => {
    setDebts(prev => [...prev, debt]);
  };

  const updateDebt = (id: string, updatedData: Partial<Debt>) => {
    setDebts(prev =>
      prev.map(debt => (debt.id === id ? { ...debt, ...updatedData } : debt))
    );
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const settleDebtThirdParty = (debtId: string, thirdParty: string) => {
    setDebts(prev =>
      prev.map(d =>
        d.id === debtId ? { ...d, amount: 0, isSettled: true, notes: `تم التسوية عبر: ${thirdParty}` } : d
      )
    );
  };

  const transferDebt = (
    fromDebtId: string,
    toPerson: string,
    amount: number
  ) => {
    setDebts(prev => {
      const fromDebt = prev.find(d => d.id === fromDebtId);
      if (!fromDebt) return prev;

      const newDebts = [...prev];
      const updatedFromDebt = {
        ...fromDebt,
        amount: Math.max(0, fromDebt.amount - amount),
      };
      if (updatedFromDebt.amount <= 0) {
        updatedFromDebt.isSettled = true;
      }

      const newDebt: Debt = {
        id: crypto.randomUUID(),
        personName: toPerson,
        amount: amount,
        initialAmount: amount,
        type: fromDebt.type,
        dueDate: fromDebt.dueDate,
        notes: `تم التحويل من ${fromDebt.personName}`,
        icon: fromDebt.icon || '💰',
        receiptImage: fromDebt.receiptImage,
        date: new Date().toISOString().split('T')[0],
        isSettled: false,
      };

      const index = newDebts.findIndex(d => d.id === fromDebtId);
      newDebts[index] = updatedFromDebt;
      newDebts.push(newDebt);

      return newDebts;
    });
  };

  // === المحافظ ===
  const addWallet = (wallet: Omit<Wallet, 'id'>) => {
    setWallets(prev => [...prev, { ...wallet, id: crypto.randomUUID() }]);
  };

  const updateWallet = (id: string, updatedData: Partial<Wallet>) => {
    setWallets(prev => prev.map(w => (w.id === id ? { ...w, ...updatedData } : w)));
  };

  const deleteWallet = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
  };

  // === التصنيفات ===
  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...category, id: crypto.randomUUID() }]);
  };

  const addSubcategory = (parentId: string, subcategory: Omit<Category, 'id'>) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === parentId) {
          return {
            ...cat,
            children: [...(cat.children || []), { ...subcategory, id: crypto.randomUUID() }],
          };
        }
        return cat;
      })
    );
  };

  const updateCategory = (id: string, updatedData: Partial<Category>) => {
    const update = (cats: Category[]): Category[] => {
      return cats.map(cat => {
        if (cat.id === id) return { ...cat, ...updatedData };
        if (cat.children) return { ...cat, children: update(cat.children) };
        return cat;
      });
    };
    setCategories(prev => update(prev));
  };

  const deleteCategory = (id: string) => {
    const remove = (cats: Category[]): Category[] => {
      return cats
        .filter(cat => cat.id !== id)
        .map(cat => {
          if (cat.children) return { ...cat, children: remove(cat.children) };
          return cat;
        });
    };
    setCategories(prev => remove(prev));
  };

  // === القيمة المرسلة للسياق ===
  const value: AppContextType = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,

    debts,
    addDebt,
    updateDebt,
    deleteDebt,
    settleDebtThirdParty,
    transferDebt,

    wallets,
    addWallet,
    updateWallet,
    deleteWallet,

    categories,
    addCategory,
    addSubcategory,
    updateCategory,
    deleteCategory,

    theme,
    setTheme,
    currency,
    defaultTransactionType,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};