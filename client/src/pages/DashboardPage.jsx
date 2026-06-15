import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchDashboard, fetchInsights, fetchPrediction } from '../redux/dashboardSlice';
import { SummaryCard } from '../components/SummaryCard';
import { Sidebar } from '../components/Sidebar';
import {
  LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { formatCurrency, getCategoryColor } from '../utils/format';

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { summary, insights, prediction, loading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchInsights());
    dispatch(fetchPrediction());
  }, [dispatch]);

  const colors = summary.categoryBreakdown?.map(cat => getCategoryColor(cat.category)) || [];

  const comparisonData = summary.monthlyTrend?.map((m) => ({
    month: m.month,
    income: m.income ?? 0,
    expense: m.expense ?? m.amount ?? 0,
  })) || [];

  const topCategories = [...(summary.categoryBreakdown || [])]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

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
                {greeting}{user?.name ? `, ${user.name}` : ''}
              </span>
              <p className="text-sm text-gray-500 mt-1">Here's how your money moved this month.</p>
            </div>
            <button
              onClick={() => navigate('/transactions')}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors self-start sm:self-auto"
            >
              + Add transaction
            </button>
          </div>

          {loading && <p className="text-sm text-gray-500">Loading...</p>}

          {!loading && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <SummaryCard title="Total Income" value={summary.totalIncome} icon="💵" color="green" />
                <SummaryCard title="Total Expense" value={summary.totalExpense} icon="💸" color="red" />
                <SummaryCard title="Savings" value={summary.savings} icon="🏦" color="blue" />
                <SummaryCard title="Budget Remaining" value={summary.budgetRemaining} icon="📊" color="purple" />
              </div>

              {/* Prediction Warning */}
              {prediction.budgetRisk && (
                <div className="bg-orange-50 text-orange-800 p-4 rounded-xl mb-6 border border-orange-100 flex items-start gap-2.5">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm">
                    <strong>Budget risk:</strong> based on your spending pattern, you may exceed your budget this month. Predicted expense: {formatCurrency(prediction.predictedExpense)}.
                  </p>
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-1 border-b border-gray-100 mb-6">
                {['overview', 'breakdown'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                      activeTab === tab
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab === 'overview' ? 'Overview' : 'Spending breakdown'}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <>
                  {/* Charts row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Income vs Expense */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">Income vs expense</h2>
                      <p className="text-xs text-gray-400 mb-4">Monthly comparison</p>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#FEF3E8" vertical={false} />
                          <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="expense" name="Expense" fill="#F97316" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">Spending trend</h2>
                      <p className="text-xs text-gray-400 mb-4">Total spend over time</p>
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={summary.monthlyTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#FEF3E8" />
                          <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" fontSize={12} />
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Line type="monotone" dataKey="amount" stroke="#F97316" strokeWidth={2} dot={{ fill: '#F97316', r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Insights + Transactions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Insights */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">AI insights</h2>
                        <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2 py-1 rounded-full">
                          {insights.provider === 'openai' ? '🤖 OpenAI' : '🔧 Heuristic'}
                        </span>
                      </div>
                      <ul className="space-y-2.5">
                        {insights.insights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <div className="w-5 h-5 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 text-xs flex-shrink-0 mt-0.5">
                              ✓
                            </div>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent transactions</h2>
                        <Link to="/transactions" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                          View all →
                        </Link>
                      </div>
                      <div className="space-y-1">
                        {summary.recentTransactions?.slice(0, 2).map((txn) => (
                          <div key={txn._id} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                                style={{ backgroundColor: `${getCategoryColor(txn.category)}1A`, color: getCategoryColor(txn.category) }}
                              >
                                {txn.type === 'income' ? '↓' : '↑'}
                              </div>
                              <div>
                                <p className="font-medium text-sm text-gray-900">{txn.title}</p>
                                <p className="text-xs text-gray-400">{txn.category}</p>
                              </div>
                            </div>
                            <span className={`font-semibold text-sm ${txn.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                              {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                            </span>
                          </div>
                        ))}
                        {(!summary.recentTransactions || summary.recentTransactions.length === 0) && (
                          <p className="text-sm text-gray-400 py-4 text-center">No transactions yet. Add your first one to see it here.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'breakdown' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Pie */}
                  {summary.categoryBreakdown?.length > 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">Spending by category</h2>
                      <p className="text-xs text-gray-400 mb-4">Share of total expenses</p>
                      <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                          <Pie
                            data={summary.categoryBreakdown}
                            dataKey="amount"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            label
                          >
                            {summary.categoryBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Top categories bar list */}
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Top categories</h2>
                    <p className="text-xs text-gray-400 mb-5">Where most of your money went</p>
                    <div className="space-y-4">
                      {topCategories.map((cat, i) => {
                        const max = topCategories[0]?.amount || 1;
                        const pct = Math.max((cat.amount / max) * 100, 4);
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-medium text-gray-700">{cat.category}</span>
                              <span className="text-gray-500">{formatCurrency(cat.amount)}</span>
                            </div>
                            <div className="w-full h-2 bg-orange-50 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${pct}%`, backgroundColor: colors[i] || '#F97316' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      {topCategories.length === 0 && (
                        <p className="text-sm text-gray-400 py-4 text-center">No spending data yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};