import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

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
    if (name === 'confirmPassword' || name === 'password') setPasswordError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    dispatch(signup({ name: formData.name, email: formData.email, password: formData.password }));
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center overflow-hidden px-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md px-7 py-6">

          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Create your account</h1>
          <p className="text-sm text-gray-400 mb-5">Start managing your finances smarter today</p>

          {/* Error */}
          {(error || passwordError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 flex items-center gap-2 mb-4">
              <span>⚠</span>
              <span>{passwordError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="At least 6 characters"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-orange-500 text-white rounded-lg text-base font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-medium hover:underline">Log in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-300 mt-4">
          By signing up you agree to our{' '}
          <span className="text-gray-400 underline cursor-pointer">Terms</span> and{' '}
          <span className="text-gray-400 underline cursor-pointer">Privacy Policy</span>
        </p>

      </div>
    </div>
  );
};

export default SignupPage;