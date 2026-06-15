import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center overflow-hidden px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md px-9 py-8">

          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Welcome back</h1>
          <p className="text-sm text-gray-400 mb-5">Sign in to your FinanceAI account</p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 flex items-center gap-2 mb-4">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-500">Password</label>
                <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-orange-500">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-orange-500 text-white rounded-lg text-base font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-500 font-medium hover:underline">Sign up</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-300 mt-4">
          By signing in you agree to our{' '}
          <span className="text-gray-400 underline cursor-pointer">Terms</span> and{' '}
          <span className="text-gray-400 underline cursor-pointer">Privacy Policy</span>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;