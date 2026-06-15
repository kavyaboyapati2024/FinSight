import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  monthlyBudget: {
    type: Number,
    default: 0,
    min: 0
  },
  categoryBudgets: [
    {
      category: {
        type: String,
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
      limit: {
        type: Number,
        min: 0
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

budgetSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
