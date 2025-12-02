
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum DebtType {
  LENT = 'LENT', // I gave money (Someone owes me)
  BORROWED = 'BORROWED' // I took money (I owe someone)
}

export type Theme = 'light' | 'dark';
export type Currency = 'YER' | 'SAR' | 'USD' | 'AED';

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone?: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'CASH' | 'BANK' | 'DIGITAL' | 'DEBT' | 'OTHER'; 
  balance: number; 
  currency: string;
  isHidden?: boolean; 
}

export interface Category {
  id: string;
  label: string;
  icon?: string; 
  type: TransactionType;
  isDefault: boolean;
  budgetLimit?: number; 
}

export interface Transaction {
  id: string;
  amount: number;
  category: string; 
  walletId?: string; 
  description: string;
  date: string;
  type: TransactionType;
  receiptImage?: string; 
  profit?: number; 
  necessityLevel?: 'NECESSITY' | 'NORMAL' | 'LUXURY'; 
  isRecurring?: boolean;
  isExcludedFromBalance?: boolean;
  contactName?: string; // Linked contact
  groupName?: string; // Optional grouping
  alertReminder?: boolean; // Reminder before due date/time
}

export interface Debt {
  id: string;
  personName: string;
  amount: number; 
  initialAmount: number;
  dueDate?: string;
  type: DebtType;
  notes?: string;
  icon?: string; 
  receiptImage?: string; 
  walletId?: string; 
}

export interface Investment {
  id: string;
  assetName: string;
  type: 'STOCK' | 'CRYPTO' | 'REAL_ESTATE' | 'GOLD' | 'COMMODITY' | 'OTHER'; 
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
}

export interface TelecomPackage {
  id: string;
  provider: 'Yemen Mobile' | 'You' | 'SabaFon' | 'Y' | 'Other' | 'Custom';
  name: string;
  cost: number; 
  price: number; 
  description?: string;
  isCustom?: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'BALANCE' | 'EXPENSE_CHART' | 'INVESTMENT_SUMMARY' | 'DEBT_SUMMARY' | 'AI_INSIGHTS' | 'PROFIT_SUMMARY' | 'GOALS' | 'WALLETS';
  visible: boolean;
  order: number;
}

export interface ZakatSettings {
  goldPrice: number; 
  lastPaidDate?: string;
  nisabType: 'GOLD' | 'SILVER'; 
}

export interface AppState {
  transactions: Transaction[];
  debts: Debt[];
  investments: Investment[];
  widgets: DashboardWidget[];
  categories: Category[];
  wallets: Wallet[];
  zakatSettings: ZakatSettings;
  contacts: Contact[];
  customPackages: TelecomPackage[];
  theme: Theme;
  currency: Currency;
  goals: FinancialGoal[];
  defaultTransactionType: TransactionType;
}
