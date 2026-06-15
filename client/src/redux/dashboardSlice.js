import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/api';

export const fetchDashboard = createAsyncThunk('dashboard/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/dashboard/summary');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
  }
});

export const fetchInsights = createAsyncThunk('dashboard/fetchInsights', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/ai/insights');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch insights');
  }
});

export const fetchPrediction = createAsyncThunk('dashboard/fetchPrediction', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/ai/predict');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch prediction');
  }
});

const initialState = {
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    savings: 0,
    budgetRemaining: 0,
    monthlyTrend: [],
    categoryBreakdown: [],
    recentTransactions: [],
    predictedExpense: 0
  },
  insights: {
    provider: 'heuristic',
    insights: []
  },
  prediction: {
    predictedExpense: 0,
    confidence: 55,
    budgetRisk: false,
    recommendations: []
  },
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Dashboard
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Insights
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = {
          provider: action.payload.provider,
          insights: action.payload.insights || []
        };
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Prediction
    builder
      .addCase(fetchPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.prediction = action.payload;
      })
      .addCase(fetchPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
