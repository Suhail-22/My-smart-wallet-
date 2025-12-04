import { Transaction, Category, TransactionType, Debt } from "../types";

// الوظيفة التي يحتاجها Dashboard.tsx
export const generateSmartAlerts = (transactions: Transaction[], categories: Category[], debts: Debt[]): string[] => {
  const alerts: string[] = [];
  const today = new Date().toISOString().split('T')[0];
  const dateObj = new Date();
  
  // حساب الإجماليات
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  // 1. صحة الميزانية
  if (totalIncome > 0) {
    const expenseRatio = totalExpense / totalIncome;
    if (expenseRatio > 0.9) {
      alerts.push(`⚠️ تحذير: أنفقت ${(expenseRatio * 100).toFixed(0)}% من دخلك هذا الشهر`);
    } else if (expenseRatio > 0.75) {
      alerts.push(`🔶 تنبيه: نفقاتك تجاوزت 75% من دخلك`);
    }
  }

  // 2. تتبع المعاملات اليومية
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });

  const recentTransactions = transactions.filter(t => 
    last7Days.includes(t.date) && t.type === TransactionType.EXPENSE
  );

  if (recentTransactions.length === 0) {
    alerts.push("📝 ملاحظة: لم تسجل أي مصروفات خلال الأسبوع الماضي");
  }

  // 3. تذكير بالديون
  debts.forEach(debt => {
    if (debt.amount > 0 && debt.dueDate) {
      const due = new Date(debt.dueDate);
      const diffTime = due.getTime() - dateObj.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 3 && diffDays >= 0) {
        alerts.push(`⏰ تذكير: دين "${debt.personName}" خلال ${diffDays === 0 ? 'اليوم' : diffDays + ' أيام'}`);
      } else if (diffDays < 0) {
        alerts.push(`🚨 تنبيه: دين "${debt.personName}" متأخر ${Math.abs(diffDays)} يوم`);
      }
    }
  });

  // 4. تحليل الفئات
  const categorySpending = new Map<string, number>();
  
  recentTransactions.forEach(t => {
    const current = categorySpending.get(t.category) || 0;
    categorySpending.set(t.category, current + t.amount);
  });

  let maxCategory = '';
  let maxAmount = 0;
  
  categorySpending.forEach((amount, category) => {
    if (amount > maxAmount) {
      maxAmount = amount;
      maxCategory = category;
    }
  });

  if (maxCategory && maxAmount > 0) {
    const categoryName = categories.find(c => c.id === maxCategory)?.label || maxCategory;
    alerts.push(`💰 أعلى إنفاق: ${categoryName} (${maxAmount})`);
  }

  // نصائح عامة إذا لم يكن هناك تنبيهات
  if (alerts.length === 0) {
    alerts.push("✅ وضعك المالي جيد. استمر في التتبع!");
    alerts.push("💡 نصيحة: حاول توفير 10% من دخلك كل شهر");
  }

  return alerts.slice(0, 5); // الحد الأقصى 5 تنبيهات
};

// الوظيفة التي قد يحتاجها أماكن أخرى
export const getAIInsights = async (data: any): Promise<string[]> => {
  const { transactions = [], categories = [], debts = [] } = data;
  return generateSmartAlerts(transactions, categories, debts);
};

// وظيفة لتحليل أنماط الإنفاق (إذا احتاجها Dashboard لاحقاً)
export const analyzeSpendingPattern = (transactions: Transaction[], categories: Category[]): string[] => {
  const insights: string[] = [];
  
  const thisMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString().slice(0, 7);

  const thisMonthExpenses = transactions.filter(t => 
    t.type === TransactionType.EXPENSE && t.date.startsWith(thisMonth)
  );
  
  const lastMonthExpenses = transactions.filter(t => 
    t.type === TransactionType.EXPENSE && t.date.startsWith(lastMonth)
  );

  const thisMonthTotal = thisMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);

  if (lastMonthTotal > 0) {
    const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    if (change > 20) {
      insights.push(`📈 زيادة في المصروفات هذا الشهر: +${change.toFixed(0)}%`);
    } else if (change < -20) {
      insights.push(`📉 انخفاض في المصروفات هذا الشهر: ${change.toFixed(0)}%`);
    }
  }

  return insights;
};