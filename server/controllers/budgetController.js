import Budget from '../models/Budget.js';

export const setBudget = async (req, res) => {
  try {
    const { monthlyBudget, categoryBudgets } = req.body;

    if (monthlyBudget === undefined || monthlyBudget === null || monthlyBudget === '' || Number(monthlyBudget) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid monthly budget'
      });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId },
      {
        monthlyBudget: Number(monthlyBudget),
        categoryBudgets: categoryBudgets || [],
        updatedAt: new Date()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      budget
    });
  } catch (error) {
    console.error('Set budget error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to set budget'
    });
  }
};

export const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.userId });

    if (!budget) {
      return res.status(200).json({
        success: true,
        budget: {
          monthlyBudget: 0,
          categoryBudgets: []
        }
      });
    }

    res.status(200).json({
      success: true,
      budget
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch budget'
    });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { monthlyBudget, categoryBudgets } = req.body;

    const updates = {};

    if (monthlyBudget !== undefined) {
      if (Number(monthlyBudget) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Monthly budget cannot be negative'
        });
      }
      updates.monthlyBudget = Number(monthlyBudget);
    }

    if (categoryBudgets !== undefined) {
      updates.categoryBudgets = categoryBudgets;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fields to update'
      });
    }

    updates.updatedAt = new Date();

    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId },
      updates,
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.status(200).json({
      success: true,
      budget
    });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update budget'
    });
  }
};
