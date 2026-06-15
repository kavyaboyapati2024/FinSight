const currency = (value) => `₹${Math.round(value || 0).toLocaleString('en-IN')}`;

export const getMonthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
};

export const summarizeTransactions = (transactions = [], budget = null) => {
  const income = transactions.filter((item) => item.type === 'income');
  const expenses = transactions.filter((item) => item.type === 'expense');

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const savings = totalIncome - totalExpense;

  // Category breakdown for expenses
  const categoryMap = {};
  expenses.forEach((expense) => {
    categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
  });

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Monthly trend (income + expense per month)
  const monthlyBuckets = new Map();

  transactions.forEach((txn) => {
    const date = new Date(txn.transactionDate);
    const monthKey = date.toISOString().slice(0, 7);

    if (!monthlyBuckets.has(monthKey)) {
      monthlyBuckets.set(monthKey, { income: 0, expense: 0 });
    }

    const bucket = monthlyBuckets.get(monthKey);
    if (txn.type === 'income') {
      bucket.income += txn.amount;
    } else {
      bucket.expense += txn.amount;
    }
  });

  const monthlyTrend = Array.from(monthlyBuckets.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, { income, expense }]) => ({ month, income, expense, amount: expense }));

  // Predicted expense (average of monthly expense buckets)
  const predictedExpense = monthlyBuckets.size > 0
    ? Array.from(monthlyBuckets.values()).reduce((sum, b) => sum + b.expense, 0) / monthlyBuckets.size
    : totalExpense;

  // Confidence score
  const confidence = Math.min(95, Math.max(55, 60 + expenses.length * 3));

  // Budget calculations
  const monthlyBudget = budget?.monthlyBudget || 0;
  const budgetRemaining = monthlyBudget - totalExpense;

  // Recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Generate recommendations
  const recommendations = generateRecommendations({
    totalIncome,
    totalExpense,
    savings,
    monthlyBudget,
    categoryBreakdown,
    transactions
  });

  return {
    totalIncome,
    totalExpense,
    savings,
    monthlyBudget,
    budgetRemaining,
    categoryBreakdown,
    monthlyTrend,
    monthlyBuckets,
    recentTransactions,
    predictedExpense,
    confidence,
    recommendations
  };
};

const generateRecommendations = ({ totalIncome, totalExpense, savings, monthlyBudget, categoryBreakdown, transactions }) => {
  const recommendations = [];

  if (transactions.length === 0) {
    recommendations.push('Start tracking your expenses to get personalized insights!');
    recommendations.push('Add your income sources to see how much you can save.');
    return recommendations;
  }

  // Savings rate recommendation
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
  if (savingsRate < 10) {
    recommendations.push('Your savings rate is below 10%. Try to reduce discretionary spending.');
  } else if (savingsRate > 30) {
    recommendations.push('Great job! You\'re saving over 30% of your income. Keep it up!');
  }

  // Budget overspend warning
  if (monthlyBudget > 0 && totalExpense > monthlyBudget) {
    const overspend = totalExpense - monthlyBudget;
    recommendations.push(`You've exceeded your budget by ${currency(overspend)}. Review your spending patterns.`);
  }

  // Category-based recommendations
  if (categoryBreakdown.length > 0) {
    const topCategory = categoryBreakdown[0];
    const percentOfTotal = (topCategory.amount / totalExpense) * 100;
    
    if (percentOfTotal > 30) {
      recommendations.push(`${topCategory.category} accounts for ${percentOfTotal.toFixed(1)}% of your spending. Consider setting a category limit.`);
    }
  }

  // Income-based recommendations
  if (totalIncome === 0) {
    recommendations.push('Add your income sources to track your financial health accurately.');
  }

  return recommendations.length > 0 
    ? recommendations 
    : ['Continue tracking your finances consistently for better insights.'];
};

export const analyzeFinance = ({ transactions = [], budget = null }) => {
  return summarizeTransactions(transactions, budget);
};