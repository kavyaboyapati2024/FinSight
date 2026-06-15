import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/api';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/transactions', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/transactions', transaction);
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/transactions/${id}`, data);
      return response.data.transaction;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/transactions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
    }
  }
);

const initialState = {
  items: [],
  pagination: { total: 0, page: 1, limit: 10, pages: 0 },
  loading: false,
  error: null,
  success: null
};

const transactionSlice = createSlice({
  name: 'transactions',
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
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.success = 'Transaction created successfully';
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.success = 'Transaction updated successfully';
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        state.success = 'Transaction deleted successfully';
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess } = transactionSlice.actions;
export default transactionSlice.reducer;
