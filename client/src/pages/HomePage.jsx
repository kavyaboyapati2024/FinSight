import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';

export const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: '📊', text: 'Track income and expenses with ease' },
    { icon: '🎯', text: 'Set and monitor budgets by category' },
    { icon: '🤖', text: 'Get AI-powered financial insights' },
    { icon: '📈', text: 'Predict spending and manage risks' },
  ];

  const highlights = [
    {
      icon: '📊',
      title: 'Smart Dashboard',
      desc: 'A clear picture of your financial health at a glance.',
    },
    {
      icon: '💳',
      title: 'Transaction Tracking',
      desc: 'Automatically categorize and monitor every transaction.',
    },
    {
      icon: '🎯',
      title: 'Budget Goals',
      desc: 'Set spending limits and stay on track every month.',
    },
    {
      icon: '🤖',
      title: 'AI Insights',
      desc: 'Personalized tips to help you save more and spend wisely.',
    },
  ];

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">

      {/* Navbar */}
      <nav className="border-b border-gray-100 shadow-md px-8 py-3 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="FinSight" className="h-12 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="text-sm bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Main — takes remaining height */}
      <div className="flex-1 flex items-center px-8 py-6 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div>
            <span className="inline-block text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full mb-3">
              AI-Powered Finance Tracker
            </span>

            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
              Take control of your{' '}
              <span className="text-orange-500">finances</span>{' '}
              with smart insights
            </h1>

            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Intelligent tracking, accurate predictions, and personalized recommendations — all in one place.
            </p>

            <ul className="space-y-2 mb-5">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-sm text-gray-600">{f.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/signup')}
                className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Create free account
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border border-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Log in
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-800 mb-0.5">Everything you need</p>
            <p className="text-xs text-gray-400 mb-4">Powerful features to manage your money better</p>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-3.5 flex flex-col gap-1.5 ${
                    i === 0
                      ? 'bg-orange-500'
                      : 'bg-white border border-orange-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <p className={`text-xs font-semibold ${i === 0 ? 'text-white' : 'text-gray-800'}`}>
                    {item.title}
                  </p>
                  <p className={`text-xs leading-relaxed ${i === 0 ? 'text-orange-100' : 'text-gray-400'}`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-orange-100 rounded-xl px-4 py-2.5 flex items-center justify-between">
              <p className="text-xs text-gray-500">Ready to get started?</p>
              <button
                onClick={() => navigate('/signup')}
                className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Sign up free →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] py-3 flex-shrink-0">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} FinanceAI. Your data stays private.
        </p>
      </div>

    </div>
  );
};

export default HomePage;