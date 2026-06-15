import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction, clearSuccess, clearError } from '../redux/transactionSlice';
import { Sidebar } from '../components/Sidebar';
import { categories, formatCurrency, getCategoryColor } from '../utils/format';

const emptyForm = {
  type: 'expense',
  title: '',
  amount: '',
  category: 'food',
  paymentMethod: 'cash',
  description: '',
  transactionDate: new Date().toISOString().slice(0, 10),
};

export const TransactionsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, error, success, pagination } = useSelector((state) => state.transactions);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactions({ page, limit: 10, ...filters }));
  }, [dispatch, page, filters]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateTransaction({ id: editingId, data: formData }));
      setEditingId(null);
    } else {
      dispatch(createTransaction(formData));
    }
    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleEdit = (txn) => {
    setFormData({
      type: txn.type,
      title: txn.title,
      amount: txn.amount,
      category: txn.category,
      paymentMethod: txn.paymentMethod,
      description: txn.description,
      transactionDate: new Date(txn.transactionDate).toISOString().slice(0, 10),
    });
    setEditingId(txn._id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

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
                All activity
              </span>
              <p className="text-sm text-gray-500 mt-1">Add, edit, and review every income and expense.</p>
            </div>
            <button
              onClick={() => { setEditingId(null); setFormData(emptyForm); setShowForm(true); }}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors self-start sm:self-auto"
            >
              + Add transaction
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

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-gray-400 mr-1">Filter:</span>
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setPage(1);
                  setFilters((prev) => {
                    const next = { ...prev };
                    if (type === 'all') delete next.type;
                    else next.type = type;
                    return next;
                  });
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                  (type === 'all' && !filters.type) || filters.type === type
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Transaction list */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden">
            {loading && (
              <p className="text-sm text-gray-500 px-6 py-8 text-center">Loading...</p>
            )}

            {!loading && items?.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-gray-400">No transactions found.</p>
                <button
                  onClick={() => { setEditingId(null); setFormData(emptyForm); setShowForm(true); }}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium mt-2"
                >
                  Add your first transaction →
                </button>
              </div>
            )}

            {!loading && items?.map((txn) => (
              <div
                key={txn._id}
                className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-orange-50/30 transition-colors group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: `${getCategoryColor(txn.category)}1A`, color: getCategoryColor(txn.category) }}
                  >
                    {txn.type === 'income' ? '↓' : '↑'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{txn.title}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {txn.category} · {new Date(txn.transactionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-semibold text-sm ${txn.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(txn)}
                      title="Edit"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors text-sm"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDelete(txn._id)}
                      title="Delete"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination?.pages > 1 && (
            <div className="mt-5 flex justify-center gap-1.5">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                    page === i + 1
                      ? 'bg-orange-500 text-white font-medium'
                      : 'text-gray-500 hover:bg-orange-50 hover:text-orange-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit panel */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/30"
            onClick={handleCancel}
          />

          {/* Panel */}
          <div className="relative bg-white w-full max-w-md h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <span className="inline-block text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full mb-1.5">
                  {editingId ? 'Edit' : 'New'}
                </span>
                <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit transaction' : 'Add transaction'}</h2>
              </div>
              <button
                onClick={handleCancel}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

              {/* Type toggle */}
              <div>
                <label className={labelClass}>Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['expense', 'income'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, type }))}
                      className={`py-2 rounded-lg text-sm font-medium capitalize border transition-colors ${
                        formData.type === type
                          ? type === 'income'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-orange-50 text-orange-600 border-orange-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Grocery shopping"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Amount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    type="date"
                    name="transactionDate"
                    value={formData.transactionDate}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Payment method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Add a note..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
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
                {loading ? 'Saving...' : editingId ? 'Save changes' : 'Add transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};