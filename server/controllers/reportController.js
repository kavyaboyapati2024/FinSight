import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import { summarizeTransactions } from '../services/financeAnalyzer.js';
import PDFDocument from 'pdfkit';

const formatCurrency = (value) => `Rs. ${Math.round(value || 0).toLocaleString('en-IN')}`;

export const getMonthlyReport = async (req, res) => {
  try {
    const now = new Date();
    const year = Number(req.query.year) || now.getFullYear();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const format = req.query.format || 'json';

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const transactions = await Transaction.find({
      userId: req.userId,
      transactionDate: { $gte: start, $lt: end }
    }).sort({ transactionDate: -1 });

    const budget = await Budget.findOne({ userId: req.userId });
    const summary = summarizeTransactions(transactions, budget);

    if (format === 'pdf') {
      return generatePDF(res, year, month, transactions, summary);
    }

    // JSON response
    res.status(200).json({
      success: true,
      period: {
        year,
        month,
        monthName: new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long' })
      },
      totals: {
        income: summary.totalIncome,
        expense: summary.totalExpense,
        savings: summary.savings
      },
      categoryBreakdown: summary.categoryBreakdown,
      transactions: transactions.slice(0, 40)
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch report'
    });
  }
};

const generatePDF = (res, year, month, transactions, summary) => {
  const doc = new PDFDocument();
  const filename = `finance-report-${year}-${String(month).padStart(2, '0')}.pdf`;
  

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);

  doc.pipe(res);

  // Title
  doc.fontSize(20).font('Helvetica-Bold').text('Finance Report', { align: 'center' });
  doc.fontSize(12).font('Helvetica').text(
    `${new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`,
    { align: 'center' }
  );
  doc.moveDown();

  // Summary cards
  doc.fontSize(12).font('Helvetica-Bold').text('Summary', { underline: true });
  doc.fontSize(11).font('Helvetica');
  doc.text(`Total Income: ${formatCurrency(summary.totalIncome)}`);
  doc.text(`Total Expense: ${formatCurrency(summary.totalExpense)}`);
  doc.text(`Savings: ${formatCurrency(summary.savings)}`);
  doc.moveDown();

  // Category breakdown
  if (summary.categoryBreakdown.length > 0) {
    doc.fontSize(12).font('Helvetica-Bold').text('Spending by Category', { underline: true });
    doc.fontSize(11).font('Helvetica');
    summary.categoryBreakdown.slice(0, 10).forEach((cat) => {
      const percentage = ((cat.amount / summary.totalExpense) * 100).toFixed(1);
      doc.text(`${cat.category}: ${formatCurrency(cat.amount)} (${percentage}%)`);
    });
    doc.moveDown();
  }

  // Transactions
  if (transactions.length > 0) {
    doc.fontSize(12).font('Helvetica-Bold').text('Transactions', { underline: true });
    doc.fontSize(10).font('Helvetica');

    transactions.slice(0, 40).forEach((txn) => {
      const date = new Date(txn.transactionDate).toLocaleDateString('en-IN');
      const type = txn.type === 'income' ? '+' : '-';
      doc.text(`${date} | ${txn.title} (${txn.category}) | ${type}${formatCurrency(txn.amount)}`);
    });
  }

  doc.end();
};
