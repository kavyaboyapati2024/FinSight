import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import { generateAIInsights, predictExpense } from '../services/aiService.js';

export const generateInsights = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    const budget = await Budget.findOne({ userId: req.userId });

    const result = await generateAIInsights({ transactions, budget });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Generate insights error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate insights'
    });
  }
};

export const predict = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    const budget = await Budget.findOne({ userId: req.userId });

    const result = await predictExpense({ transactions, budget });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Predict expense error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to predict expense'
    });
  }
};
