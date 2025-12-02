
import { Transaction, Category, TransactionType, Debt } from "../types";

export const generateSmartAlerts = (transactions: Transaction[], categories: Category[], debts: Debt[]): string[] => {
  const alerts: string[] = [];
  const today = new Date().toISOString().split('T')[0];
  const dateObj = new Date();
  
  // Calculate Totals for Budget Logic
  const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE && t.category !== 'Inventory').reduce((sum, t) => sum + t.amount, 0);

  // 1. Budget Health / Savings Rate
  if (totalIncome > 0) {
    const expenseRatio = totalExpense / totalIncome;
    if (expenseRatio > 0.9) {
      alerts.push(`تحذير: لقد أنفقت أكثر من 90% من دخلك المسجل (${(expenseRatio * 100).toFixed(0)}%)`);
    } else if (expenseRatio > 0.75) {
      alerts.push(`تنبيه: نفقاتك تجاوزت 75% من الدخل. حاول التوفير قليلاً.`);
    }
  }

  // 2. Check for Daily Habits (Exclude Inventory/Zakat)
  const last5Days = Array.from({length: 5}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (i + 1));
    return d.toISOString().split('T')[0];
  });

  const dailyCategories = categories.filter(c => 
    c.type === TransactionType.EXPENSE && 
    c.id !== 'Inventory' && // Exclude Stock purchases
    c.id !== 'Zakat' // Exclude Zakat
  );

  dailyCategories.forEach(cat => {
    const countLast5Days = transactions.filter(t => 
      t.category === cat.id && last5Days.includes(t.date)
    ).length;

    const recordedToday = transactions.some(t => t.category === cat.id && t.date === today);

    if (countLast5Days >= 3 && !recordedToday) {
      alerts.push(`ملاحظة: لم تسجل مصروفات "${cat.label}" اليوم؟`);
    }
  });

  // 3. Debt Reminders (Due Dates)
  debts.forEach(debt => {
    if (debt.amount > 0 && debt.dueDate) {
      const due = new Date(debt.dueDate);
      const diffTime = due.getTime() - dateObj.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays <= 3 && diffDays >= 0) {
        alerts.push(`⏰ تذكير: موعد سداد الدين "${debt.personName}" يستحق خلال ${diffDays === 0 ? 'اليوم' : diffDays + ' أيام'}`);
      } else if (diffDays < 0) {
        alerts.push(`⚠️ تنبيه عاجل: دين "${debt.personName}" متأخر عن موعد السداد!`);
      }
    }
  });

  return alerts;
};
