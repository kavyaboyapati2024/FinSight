import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/api';

export const signup = createAsyncThunk('auth/signup', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/auth/signup', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Signup failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const refreshUser = createAsyncThunk('auth/refreshUser', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return rejectWithValue('Session expired');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (updates, { rejectWithValue }) => {
  try {
    const response = await apiClient.put('/auth/profile', updates);
    const user = response.data.user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Update failed');
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (passwords, { rejectWithValue }) => {
  try {
    await apiClient.put('/auth/password', passwords);
    return 'Password changed successfully';
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Password change failed');
  }
});

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  success: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = 'Signup successful';
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = 'Login successful';
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Refresh User
    builder
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = 'Profile updated successfully';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
