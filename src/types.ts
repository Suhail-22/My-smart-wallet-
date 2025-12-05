// src/types.ts

export type TransactionType = 'INCOME' | 'EXPENSE';
export type WalletType = 'CASH' | 'BANK' | 'CARD' | 'OTHER';
export enum DebtType {
  BORROWED = 'BORROWED', // "عليّ" — أنا المدين
  LENT = 'LENT',         // "لي" — أنا الدائن
}

// === التصنيف الهرمي ===
export interface Category {
  id: string;
  label: string;            // اسم التصنيف (مثل: "الطعام")
  icon: string;             // الرمز (مثل: "🍔")
  type: TransactionType | 'debt'; // نوعه: دخل، مصروف، أو دين
  children?: Category[];    // التصنيفات الفرعية (مثل: "فواكه"، "سندوتشات"... إلخ)
}

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  currency: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;         // ID التصنيف
  description?: string;
  date: string;             // YYYY-MM-DD
  walletId: string;
  contactName?: string;
  contactPhone?: string;    // <-- تم إضافته لدعم الاتصال المباشر
  receiptImage?: string;
  isExcludedFromBalance: boolean;
  profit?: number;
  investmentId?: string;
}

export interface Debt {
  id: string;
  amount: number;
  contactName: string;
  contactPhone?: string;    // <-- تم إضافته لدعم الاتصال المباشر
  debtType: DebtType;
  dueDate?: string;
  description?: string;
  date: string;
  isSettled: boolean;
}