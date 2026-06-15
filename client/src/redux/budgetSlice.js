import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/api';

export const fetchBudget = createAsyncThunk('budget/fetchBudget', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/budget');
    return response.data.budget;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch budget');
  }
});

export const setBudget = createAsyncThunk('budget/setBudget', async (budget, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/budget', budget);
    return response.data.budget;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to set budget');
  }
});

export const updateBudget = createAsyncThunk('budget/updateBudget', async (budget, { rejectWithValue }) => {
  try {
    const response = await apiClient.put('/budget', budget);
    return response.data.budget;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update budget');
  }
});

const initialState = {
  monthlyBudget: 0,
  categoryBudgets: [],
  loading: false,
  error: null,
  success: null
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyBudget = action.payload.monthlyBudget || 0;
        state.categoryBudgets = action.payload.categoryBudgets || [];
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Set
    builder
      .addCase(setBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyBudget = action.payload.monthlyBudget || 0;
        state.categoryBudgets = action.payload.categoryBudgets || [];
        state.success = 'Budget set successfully';
      })
      .addCase(setBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(updateBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyBudget = action.payload.monthlyBudget || 0;
        state.categoryBudgets = action.payload.categoryBudgets || [];
        state.success = 'Budget updated successfully';
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess } = budgetSlice.actions;
export default budgetSlice.reducer;
