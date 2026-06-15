import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'salary',
      'food',
      'transport',
      'entertainment',
      'utilities',
      'healthcare',
      'education',
      'shopping',
      'investment',
      'other'
    ]
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'debit_card', 'credit_card', 'bank_transfer', 'upi'],
    default: 'cash'
  },
  description: {
    type: String,
    trim: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

transactionSchema.index({ userId: 1, transactionDate: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });

export default mongoose.model('Transaction', transactionSchema);
