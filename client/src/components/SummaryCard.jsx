import React from 'react';
import { formatCurrency } from '../utils/format';

export const SummaryCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    red: 'bg-red-100 text-red-800 border-red-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 shadow`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-2">{formatCurrency(value)}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};
