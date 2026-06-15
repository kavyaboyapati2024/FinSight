import Transaction from '../models/Transaction.js';

const VALID_CATEGORIES = [
  'salary', 'food', 'transport', 'entertainment', 'utilities',
  'healthcare', 'education', 'shopping', 'investment', 'other'
];

const VALID_PAYMENT_METHODS = [
  'cash', 'debit_card', 'credit_card', 'bank_transfer', 'upi'
];

export const createTransaction = async (req, res) => {
  try {
    const { type, title, amount, category, paymentMethod, description, transactionDate } = req.body;

    // Validation
    if (!type || !title?.trim() || amount === undefined || Number(amount) <= 0 || !category?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, title, amount greater than zero, and category'
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either income or expense'
      });
    }

    if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Valid options: ${VALID_CATEGORIES.join(', ')}`
      });
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      type,
      title: title.trim(),
      amount: Number(amount),
      category: category.toLowerCase(),
      paymentMethod: paymentMethod || 'cash',
      description: description?.trim() || '',
      transactionDate: transactionDate ? new Date(transactionDate) : new Date()
    });

    res.status(201).json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create transaction'
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, type, search, sort } = req.query;

    const query = { userId: req.userId };

    // Filters
    if (category) {
      query.category = category.toLowerCase();
    }

    if (type && ['income', 'expense'].includes(type)) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort
    const sortMap = {
      latest: { transactionDate: -1 },
      oldest: { transactionDate: 1 },
      amount_desc: { amount: -1 },
      amount_asc: { amount: 1 }
    };

    const sortOption = sortMap[sort] || sortMap.latest;

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const transactions = await Transaction.find(query)
      .sort(sortOption)
      .limit(limitNum)
      .skip(skip);

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      transactions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transactions'
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, amount, category, paymentMethod, description, transactionDate } = req.body;

    // Find transaction
    const transaction = await Transaction.findOne({ _id: id, userId: req.userId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Validation and update
    if (type !== undefined) {
      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Type must be either income or expense'
        });
      }
      transaction.type = type;
    }

    if (title?.trim()) transaction.title = title.trim();
    
    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than zero'
        });
      }
      transaction.amount = Number(amount);
    }

    if (category?.trim()) {
      if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Valid options: ${VALID_CATEGORIES.join(', ')}`
        });
      }
      transaction.category = category.toLowerCase();
    }

    if (paymentMethod) {
      transaction.paymentMethod = paymentMethod;
    }

    if (description !== undefined) {
      transaction.description = description?.trim() || '';
    }

    if (transactionDate) {
      transaction.transactionDate = new Date(transactionDate);
    }

    await transaction.save();

    res.status(200).json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update transaction'
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete transaction'
    });
  }
};
