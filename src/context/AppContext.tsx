// src/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, TransactionType, Wallet, WalletType, Category, Debt, DebtType } from '../types';

const initialWallets: Wallet[] = [
  { id: 'main-cash', name: 'الكاش', type: 'CASH', balance: 0, currency: 'YER', color: '#6366f1' },
  { id: 'bank-01', name: 'البنك', type: 'BANK', balance: 0, currency: 'YER', color: '#10b981' },
];

const initialCategories: Category[] = [
  { id: 'food', label: 'الطعام', icon: '🍔', type: 'EXPENSE' },
  { id: 'transport', label: 'المواصلات', icon: '🚗', type: 'EXPENSE' },
  { id: 'salary', label: 'الراتب', icon: '💼', type: 'INCOME' },
];

const initialTransactions: Transaction[] = [];
const initialDebts: Debt[] = [];

interface AppContextType {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, updatedData: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  debts: Debt[];
  addDebt: (debt: Debt) => void;
  updateDebt: (id: string, updatedData: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  transferDebt: (fromId: string, toPerson: string, amount: number) => void;

  wallets: Wallet[];
  categories: Category[];
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

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, tx]);
  };

  const updateTransaction = (id: string, updatedData: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addDebt = (debt: Debt) => {
    setDebts(prev => [...prev, debt]);
  };

  const updateDebt = (id: string, updatedData: Partial<Debt>) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, ...updatedData } : d));
  };

  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  const transferDebt = (fromId: string, toPerson: string, amount: number) => {
    setDebts(prev => {
      const fromDebt = prev.find(d => d.id === fromId);
      if (!fromDebt || fromDebt.amount < amount) return prev;
      const newDebts = prev.filter(d => d.id !== fromId);
      // خصم من القديم
      if (fromDebt.amount > amount) {
        newDebts.push({ ...fromDebt, amount: fromDebt.amount - amount });
      }
      // إضافة للجديد
      newDebts.push({
        id: crypto.randomUUID(),
        personName: toPerson,
        amount: amount,
        type: fromDebt.type,
        date: new Date().toISOString().split('T')[0],
        isSettled: false,
      });
      return newDebts;
    });
  };

  const value: AppContextType = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    debts,
    addDebt,
    updateDebt,
    deleteDebt,
    transferDebt,
    wallets,
    categories,
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