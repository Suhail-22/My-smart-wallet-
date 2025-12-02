
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
  type: 'CASH' | 'BANK' | 'DIGITAL' | 'DEBT' | 'OTHER'; // Added DEBT type
  balance: number; // Current calculated balance
  currency: string;
  isHidden?: boolean; // New: Hide from dashboard
}

export interface Category {
  id: string;
  label: string;
  icon?: string; // Emoji character
  type: TransactionType;
  isDefault: boolean;
  budgetLimit?: number; // Monthly budget limit for this category
}

export interface Transaction {
  id: string;
  amount: number;
  category: string; // Stores Category ID
  walletId?: string; // Which wallet this transaction affects
  description: string;
  date: string;
  type: TransactionType;
  receiptImage?: string; // Base64
  profit?: number; // Realized profit from sales (Sales Price - Cost)
  necessityLevel?: 'NECESSITY' | 'NORMAL' | 'LUXURY'; // For Expense Analysis: Basic, Normal, Luxury
  isRecurring?: boolean;
  isExcludedFromBalance?: boolean;
  contactName?: string; // Linked contact
  groupName?: string; // Optional grouping
}

export interface Debt {
  id: string;
  personName: string;
  amount: number; // Current outstanding
  initialAmount: number;
  dueDate?: string;
  type: DebtType;
  notes?: string;
  icon?: string; // Emoji representing the debt reason
  receiptImage?: string; // Base64 image of invoice/receipt
  walletId?: string; // Linked wallet if balance was updated
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
  cost: number; // How much credit it consumes
  price: number; // Recommended selling price
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
  goldPrice: number; // Per gram in local currency
  lastPaidDate?: string;
  nisabType: 'GOLD' | 'SILVER'; // Default GOLD
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
