export const categories = [
  'salary', 'food', 'transport', 'entertainment', 'utilities',
  'healthcare', 'education', 'shopping', 'investment', 'other'
];

export const paymentMethods = [
  'cash', 'debit_card', 'credit_card', 'bank_transfer', 'upi'
];

export const formatCurrency = (value) => {
  return `₹${Math.round(value || 0).toLocaleString('en-IN')}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getCategoryColor = (category) => {
  const colors = {
    salary: '#10B981',
    food: '#F59E0B',
    transport: '#3B82F6',
    entertainment: '#8B5CF6',
    utilities: '#6B7280',
    healthcare: '#EF4444',
    education: '#06B6D4',
    shopping: '#EC4899',
    investment: '#14B8A6',
    other: '#9CA3AF'
  };
  return colors[category] || '#9CA3AF';
};

export const getPaymentMethodLabel = (method) => {
  const labels = {
    cash: 'Cash',
    debit_card: 'Debit Card',
    credit_card: 'Credit Card',
    bank_transfer: 'Bank Transfer',
    upi: 'UPI'
  };
  return labels[method] || method;
};

export const getCategoryLabel = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
};
