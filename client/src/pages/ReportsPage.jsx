import React, { useState } from 'react';
import apiClient from '../utils/api';
import { formatCurrency, formatDate } from '../utils/format';
import { Sidebar } from '../components/Sidebar';

export const ReportsPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/reports/monthly', {
        params: { year, month },
      });
      setReport(response.data);
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
  try {
    const response = await apiClient.get('/reports/monthly', {
      params: { year, month, format: 'pdf' },
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance-report-${year}-${String(month).padStart(2, '0')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download PDF:', error);
  }
};
  

    

  const selectClass =
    'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <span className="inline-block text-s font-medium bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full mb-2">
                Monthly snapshot
              </span>
              <p className="text-sm text-gray-500 mt-1">View and download your monthly financial summary.</p>
            </div>
            {report && (
              <button
                onClick={downloadPDF}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors self-start sm:self-auto"
              >
                Download PDF
              </button>
            )}
          </div>

          {/* Filter card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Select period</h2>
            <p className="text-xs text-gray-400 mb-5">Choose a month and year to view the report</p>

            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className={labelClass}>Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className={selectClass}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className={labelClass}>Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className={selectClass}
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {new Date(2024, m - 1).toLocaleDateString('en-IN', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <button
                  onClick={fetchReport}
                  disabled={loading}
                  className="w-full bg-orange-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Loading...' : 'View report'}
                </button>
              </div>
            </div>
          </div>

          {/* Report */}
          {report && (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Income */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
                  <p className="text-xs text-gray-400 mb-1">Total income</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(report.totals.income)}</p>
                  <div className="mt-3 h-1.5 bg-orange-50 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full w-full" />
                  </div>
                </div>

                {/* Expense */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
                  <p className="text-xs text-gray-400 mb-1">Total expense</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(report.totals.expense)}</p>
                  <div className="mt-3 h-1.5 bg-orange-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{
                        width: report.totals.income > 0
                          ? `${Math.min(100, (report.totals.expense / report.totals.income) * 100)}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>

                {/* Savings */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
                  <p className="text-xs text-gray-400 mb-1">Savings</p>
                  <p className={`text-2xl font-bold ${report.totals.savings >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
                    {formatCurrency(report.totals.savings)}
                  </p>
                  <div className="mt-3 h-1.5 bg-orange-50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${report.totals.savings >= 0 ? 'bg-orange-500' : 'bg-red-400'}`}
                      style={{
                        width: report.totals.income > 0
                          ? `${Math.min(100, Math.abs(report.totals.savings / report.totals.income) * 100)}%`
                          : '0%',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Category breakdown */}
              {report.categoryBreakdown.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Spending by category</h2>
                  <p className="text-xs text-gray-400 mb-5">Breakdown of expenses across all categories</p>

                  <div className="space-y-4">
                    {report.categoryBreakdown.map((cat, i) => {
                      const pct = report.totals.expense > 0
                        ? ((cat.amount / report.totals.expense) * 100).toFixed(1)
                        : 0;
                      return (
                        <div key={i}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-medium text-gray-700 capitalize">{cat.category}</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(cat.amount)}{' '}
                              <span className="text-gray-400 font-normal text-xs">{pct}%</span>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-orange-50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {report.transactions.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Transactions</h2>
                  <p className="text-xs text-gray-400 mb-5">All transactions for the selected period</p>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-xs font-medium text-gray-400 pb-3 pr-4">Date</th>
                          <th className="text-left text-xs font-medium text-gray-400 pb-3 pr-4">Title</th>
                          <th className="text-left text-xs font-medium text-gray-400 pb-3 pr-4">Category</th>
                          <th className="text-right text-xs font-medium text-gray-400 pb-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.transactions.slice(0, 40).map((txn, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors">
                            <td className="py-3 pr-4 text-sm text-gray-500">{formatDate(txn.transactionDate)}</td>
                            <td className="py-3 pr-4 text-sm text-gray-700 font-medium">{txn.title}</td>
                            <td className="py-3 pr-4">
                              <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full capitalize">
                                {txn.category}
                              </span>
                            </td>
                            <td className="py-3 text-right text-sm font-semibold">
                              <span className={txn.type === 'income' ? 'text-green-600' : 'text-red-500'}>
                                {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty state */}
          {!report && !loading && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-12 text-center">
              <p className="text-sm text-gray-400 mb-2">Select a period above to load your report.</p>
              <button
                onClick={fetchReport}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                Load report →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};