import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudget, setBudget, clearSuccess, clearError } from '../redux/budgetSlice';
import { fetchDashboard } from '../redux/dashboardSlice';
import { Sidebar } from '../components/Sidebar';
import { categories, formatCurrency } from '../utils/format';

export const BudgetPage = () => {
  const dispatch = useDispatch();
  const { monthlyBudget, categoryBudgets, loading, error, success } = useSelector((state) => state.budget);
  const { summary } = useSelector((state) => state.dashboard);
  const [formData, setFormData] = useState({
    monthlyBudget: 0,
    categoryBudgets: [],
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchBudget());
    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (monthlyBudget || categoryBudgets.length > 0) {
      setFormData({
        monthlyBudget,
        categoryBudgets,
      });
    }
  }, [monthlyBudget, categoryBudgets]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleMonthlyBudgetChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      monthlyBudget: Number(e.target.value),
    }));
  };

  const handleCategoryBudgetChange = (category, limit) => {
    setFormData((prev) => {
      const existing = prev.categoryBudgets.find((cb) => cb.category === category);
      if (existing) {
        return {
          ...prev,
          categoryBudgets: prev.categoryBudgets.map((cb) =>
            cb.category === category ? { category, limit: Number(limit) } : cb
          ),
        };
      } else {
        return {
          ...prev,
          categoryBudgets: [...prev.categoryBudgets, { category, limit: Number(limit) }],
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setBudget(formData));
    setShowForm(false);
  };

  const getCategoryBudgetLimit = (category) => {
    const cat = formData.categoryBudgets.find((cb) => cb.category === category);
    return cat?.limit || '';
  };

  const getCategorySpent = (category) => {
    const cat = summary.categoryBreakdown?.find((c) => c.category === category);
    return cat?.amount || 0;
  };

  const getCategoryPercentage = (category) => {
    const limit = getCategoryBudgetLimit(category);
    if (!limit) return 0;
    const spent = getCategorySpent(category);
    return (spent / limit * 100).toFixed(1);
  };

  const overallPct = formData.monthlyBudget > 0
    ? Math.min(100, (summary.totalExpense / formData.monthlyBudget) * 100)
    : 0;
  const overallOver = formData.monthlyBudget > 0 && summary.totalExpense > formData.monthlyBudget;

  const inputClass = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

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
                Plan ahead
              </span>
              <p className="text-sm text-gray-500 mt-1">Set monthly limits and track how you're doing.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors self-start sm:self-auto"
            >
              Edit budget
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 p-3.5 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 border border-green-100 p-3.5 rounded-xl mb-4 text-sm">
              {success}
            </div>
          )}

          {/* Overall budget card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Overall monthly budget</h2>
            <p className="text-xs text-gray-400 mb-5">How much you've spent against your monthly limit</p>

            {formData.monthlyBudget > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Spent this month</span>
                  <span className={`font-semibold text-sm ${overallOver ? 'text-red-500' : 'text-gray-900'}`}>
                    {formatCurrency(summary.totalExpense)} <span className="text-gray-400 font-normal">/ {formatCurrency(formData.monthlyBudget)}</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-orange-50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${overallOver ? 'bg-red-500' : 'bg-orange-500'}`}
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
                {overallOver && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <span>⚠️</span> Over budget by {formatCurrency(summary.totalExpense - formData.monthlyBudget)}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-400 mb-2">No monthly budget set yet.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  Set a monthly budget →
                </button>
              </div>
            )}
          </div>

          {/* Category limits */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Category limits</h2>
            <p className="text-xs text-gray-400 mb-5">Track spending against each category's budget</p>

            {formData.categoryBudgets.length > 0 ? (
              <div className="space-y-5">
                {formData.categoryBudgets.map((catBudget) => {
                  const percentage = getCategoryPercentage(catBudget.category);
                  const spent = getCategorySpent(catBudget.category);
                  const isOverbudget = spent > catBudget.limit;

                  return (
                    <div key={catBudget.category}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-gray-700 capitalize">{catBudget.category}</span>
                        <span className={`font-semibold text-sm ${isOverbudget ? 'text-red-500' : 'text-gray-900'}`}>
                          {formatCurrency(spent)} <span className="text-gray-400 font-normal">/ {formatCurrency(catBudget.limit)}</span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-orange-50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isOverbudget ? 'bg-red-500' : 'bg-orange-500'}`}
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        />
                      </div>
                      {isOverbudget && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <span>⚠️</span> Over by {formatCurrency(spent - catBudget.limit)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-gray-400 mb-2">No category budgets set.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  Set category limits →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit budget panel */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/30"
            onClick={() => setShowForm(false)}
          />

          {/* Panel */}
          <div className="relative bg-white w-full max-w-md h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <span className="inline-block text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full mb-1.5">
                  Budget
                </span>
                <h2 className="text-xl font-bold text-gray-900">Edit budget</h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div>
                <label className={labelClass}>Monthly budget</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.monthlyBudget}
                    onChange={handleMonthlyBudgetChange}
                    min="0"
                    step="100"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Category limits</label>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 capitalize w-28 flex-shrink-0">{category}</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                        <input
                          type="number"
                          value={getCategoryBudgetLimit(category)}
                          onChange={(e) => handleCategoryBudgetChange(category, e.target.value)}
                          min="0"
                          step="100"
                          placeholder="No limit"
                          className={`${inputClass} pl-7`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : 'Save budget'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};