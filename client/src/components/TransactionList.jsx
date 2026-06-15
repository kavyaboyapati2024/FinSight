import React from 'react';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/format';

export const TransactionList = ({ transactions, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
            <th className="px-6 py-3 text-right text-sm font-semibold">Amount</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-3 text-sm">{formatDate(txn.transactionDate)}</td>
              <td className="px-6 py-3 text-sm">{txn.title}</td>
              <td className="px-6 py-3 text-sm">
                <span 
                  className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                  style={{ backgroundColor: getCategoryColor(txn.category) }}
                >
                  {txn.category}
                </span>
              </td>
              <td className="px-6 py-3 text-sm">
                <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                  txn.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {txn.type}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-right font-semibold">
                <span className={txn.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-center">
                <button onClick={() => onEdit(txn)} className="text-blue-600 hover:underline mr-2">Edit</button>
                <button onClick={() => onDelete(txn._id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
