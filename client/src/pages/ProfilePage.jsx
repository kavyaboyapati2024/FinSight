import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, changePassword, clearSuccess, clearError } from '../redux/authSlice';
import apiClient from '../utils/api';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/auth/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    dispatch(changePassword({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    }));
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors';
  const labelClass = 'block text-xs font-medium text-gray-500 mb-1.5';

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'password', label: 'Password' },
    { key: 'stats', label: 'Statistics' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top bar */}
        <div className="mb-6">
          <span className="inline-block text-s font-medium bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full mb-1.5">
            Your account
          </span>
          <p className="text-sm text-gray-400">Manage your profile, password and account stats.</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 border border-green-100 p-3 rounded-xl mb-4 text-sm">
            {success}
          </div>
        )}

        {/* Layout: fixed-width sidebar + fluid content */}
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

            {/* Avatar */}
            <div className="px-6 py-8 border-b border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-orange-500">
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <p className="text-base font-semibold text-gray-800 leading-tight">{user?.name}</p>
              <p className="text-sm text-gray-400 mt-1 break-all">{user?.email}</p>
            </div>

            {/* Tab buttons */}
            <div className="py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full px-6 py-4 text-left text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content panel */}
          <div className="flex-1 min-w-0">

            {/* Profile tab */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 min-h-[420px]">
                <h2 className="text-lg font-semibold text-gray-900">Update profile</h2>
                <p className="text-sm text-gray-400 mt-1 mb-8">Change your name or email address</p>

                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Password tab */}
            {activeTab === 'password' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 min-h-[420px]">
                <h2 className="text-lg font-semibold text-gray-900">Change password</h2>
                <p className="text-sm text-gray-400 mt-1 mb-8">Keep your account secure with a strong password</p>

                <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                  <div>
                    <label className={labelClass}>Current password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>New password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Confirm new password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Updating...' : 'Update password'}
                  </button>
                </form>
              </div>
            )}

            {/* Stats tab */}
            {activeTab === 'stats' && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 min-h-[420px]">
                <h2 className="text-base font-semibold text-gray-900">Account statistics</h2>
                <p className="text-xs text-gray-400 mt-0.5 mb-5">A summary of your financial activity</p>

                {stats ? (
                  <div className="grid grid-cols-2 gap-3">

                    {/* Total transactions — full width */}
                    <div className="col-span-2 bg-orange-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">Total transactions</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                      <div className="mt-2.5 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full w-full" />
                      </div>
                    </div>

                    {/* Income */}
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">Total income</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{Math.round(stats.totalIncome).toLocaleString('en-IN')}
                      </p>
                      <div className="mt-2.5 h-1.5 bg-green-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400 rounded-full w-full" />
                      </div>
                    </div>

                    {/* Expense */}
                    <div className="bg-orange-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">Total expense</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{Math.round(stats.totalExpense).toLocaleString('en-IN')}
                      </p>
                      <div className="mt-2.5 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full"
                          style={{
                            width: stats.totalIncome > 0
                              ? `${Math.min(100, (stats.totalExpense / stats.totalIncome) * 100)}%`
                              : '0%',
                          }}
                        />
                      </div>
                    </div>

                    {/* Savings */}
                    <div className="bg-orange-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">Total savings</p>
                      <p className={`text-xl font-bold ${stats.savings >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
                        ₹{Math.round(stats.savings).toLocaleString('en-IN')}
                      </p>
                      <div className="mt-2.5 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${stats.savings >= 0 ? 'bg-orange-400' : 'bg-red-400'}`}
                          style={{
                            width: stats.totalIncome > 0
                              ? `${Math.min(100, Math.abs(stats.savings / stats.totalIncome) * 100)}%`
                              : '0%',
                          }}
                        />
                      </div>
                    </div>

                    {/* Savings rate */}
                    <div className="bg-orange-50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">Savings rate</p>
                      <p className="text-xl font-bold text-gray-900">{stats.savingsPercentage}%</p>
                      <div className="mt-2.5 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full"
                          style={{ width: `${Math.min(100, stats.savingsPercentage)}%` }}
                        />
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-sm text-gray-400">Loading statistics...</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};