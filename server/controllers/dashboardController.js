import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import { summarizeTransactions } from '../services/financeAnalyzer.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ transactionDate: -1 });
    const budget = await Budget.findOne({ userId: req.userId });

    const summary = summarizeTransactions(transactions, budget);

    res.status(200).json({
      success: true,
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
      savings: summary.savings,
      budgetRemaining: summary.budgetRemaining,
      monthlyTrend: summary.monthlyTrend,
      categoryBreakdown: summary.categoryBreakdown,
      recentTransactions: summary.recentTransactions,
      predictedExpense: summary.predictedExpense
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard summary'
    });
  }
};
