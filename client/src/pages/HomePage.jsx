import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';

export const HomePage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(0);

  const features = [
    { icon: '📊', text: 'Track income and expenses in one dashboard' },
    { icon: '🎯', text: 'Set monthly and category-wise budgets' },
    { icon: '🤖', text: 'Get AI-powered insights from Gemini' },
    { icon: '📄', text: 'Export monthly reports as PDF' },
  ];

  const highlights = [
    {
      icon: '📊',
      title: 'Smart Dashboard',
      desc: 'Income, expenses, and savings at a glance, with monthly trends.',
    },
    {
      icon: '💳',
      title: 'Transaction Tracking',
      desc: 'Add, edit, search, and filter every transaction you log.',
    },
    {
      icon: '🎯',
      title: 'Budget Goals',
      desc: 'Set spending limits by category and catch overspending early.',
    },
    {
      icon: '🤖',
      title: 'AI Insights',
      desc: 'Personalized recommendations powered by Gemini AI.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create your account',
      desc: 'Sign up with your name, email, and password. JWT-based authentication and bcrypt encryption keep it secure.',
    },
    {
      number: '02',
      title: 'Log your transactions',
      desc: 'Add income and expenses as they happen, organized into the categories you choose.',
    },
    {
      number: '03',
      title: 'Set your budgets',
      desc: 'Define an overall monthly budget or limits per category, and track utilization as you go.',
    },
    {
      number: '04',
      title: 'Get insights & reports',
      desc: 'Gemini AI reviews your activity for personalized tips, and you can export monthly reports as PDF anytime.',
    },
  ];

  const monthlyTrend = [40, 65, 50, 82, 60, 90, 70];

  const transactions = [
    { icon: '💼', name: 'Monthly salary', category: 'Income', amount: '+$3,200.00' },
    { icon: '🏠', name: 'Rent', category: 'Housing', amount: '-$1,200.00' },
    { icon: '🛒', name: 'Groceries', category: 'Food', amount: '-$86.40' },
    { icon: '🎬', name: 'Netflix', category: 'Subscriptions', amount: '-$15.99' },
  ];

  const budgetCategories = [
    { name: 'Food & dining', percent: 80 },
    { name: 'Rent', percent: 100 },
    { name: 'Entertainment', percent: 45 },
    { name: 'Transport', percent: 60 },
  ];

  const deepFeatures = [
    {
      icon: '📊',
      title: 'See your full financial picture instantly',
      desc: 'Your dashboard pulls everything together: total income, total expenses, savings summary, and monthly spending trends, all visualized with live charts.',
      bullets: [
        'Income, expense, and savings summaries',
        'Monthly spending trend charts',
        'Category-wise expense breakdowns',
        'Recent transaction history at a glance',
      ],
      visual: 'chart',
    },
    {
      icon: '💳',
      title: 'Log every transaction your way',
      desc: 'Add income and expense entries in seconds, edit or delete them anytime, and find what you need with search, filters, and pagination built for larger histories.',
      bullets: [
        'Add income and expense entries quickly',
        'Edit or delete any transaction',
        'Search and filter by category or date',
        'Pagination for large transaction histories',
      ],
      visual: 'transactions',
    },
    {
      icon: '🎯',
      title: 'Set limits, not surprises',
      desc: 'Define an overall monthly budget or limits for specific categories, then watch utilization update in real time so overspending shows up before it becomes a problem.',
      bullets: [
        'Overall monthly or category-specific budgets',
        'Real-time budget utilization tracking',
        'Clear visibility into overspending by category',
      ],
      visual: 'budget',
    },
    {
      icon: '🤖',
      title: 'Recommendations powered by Gemini AI',
      desc: 'Gemini AI analyzes your transaction history to surface personalized recommendations, spending behavior patterns, and future expense predictions. If the AI service is ever unavailable, a rule-based engine takes over automatically.',
      bullets: [
        'Personalized recommendations from Gemini AI',
        'Spending behavior analysis and future predictions',
        'Automatic rule-based fallback, always available',
      ],
      visual: 'insight',
    },
  ];

  const faqs = [
    {
      q: 'Is my data secure?',
      a: 'Yes. Passwords are encrypted with bcrypt and authentication uses JWT. The API is also protected with rate limiting and security headers via Helmet.',
    },
    {
      q: 'Does FinSight connect to my bank automatically?',
      a: 'Not yet. Right now you add income and expense transactions manually. Bank account integration is planned for a future release.',
    },
    {
      q: 'What happens if the AI service is unavailable?',
      a: 'FinSight automatically falls back to a rule-based recommendation engine, so you still get useful suggestions even if the Gemini AI service is down.',
    },
    {
      q: 'Can I export my financial data?',
      a: 'Yes. You can generate monthly financial reports, broken down by category, and download them as PDF files directly from the app.',
    },
    {
      q: 'Is FinSight free to use?',
      a: 'Yes, FinSight is currently free to use.',
    },
    {
      q: 'Will there be a mobile app?',
      a: 'A mobile app is planned for a future release, along with recurring transactions, multi-currency support, and a few other features in progress.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-md px-8 py-3">
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

      {/* Hero */}
      <section className="px-8 py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div>
            <span className="inline-block text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full mb-3">
              AI-Powered Finance Tracker
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
              Take control of your{' '}
              <span className="text-orange-500">finances</span>{' '}
              with smart insights
            </h1>

            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Log income and expenses, set budgets by category, and get personalized recommendations from Gemini AI — all in one dashboard.
            </p>

            <ul className="space-y-2 mb-6">
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
            <p className="text-xs text-gray-400 mb-4">Core features built into FinSight</p>

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
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">From sign-up to insight in four steps</h2>
            <p className="text-gray-500 text-sm">No bank connection required to get started — just log your activity and go.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6">
                <p className="text-3xl font-bold text-orange-200 mb-3">{step.number}</p>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature deep-dive */}
      <section className="border-t border-gray-100 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-block text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full mb-3">
              What's inside
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Everything you need to understand your money
            </h2>
            <p className="text-gray-500 text-sm">
              Four core tools that work together, from logging a transaction to acting on an AI recommendation.
            </p>
          </div>

          <div className="space-y-20">
            {deepFeatures.map((feature, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${
                  i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div>
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{feature.desc}</p>
                  <ul className="space-y-2">
                    {feature.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
                  {feature.visual === 'chart' && (
                    <div className="bg-white border border-orange-100 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-1">Savings this month</p>
                      <p className="text-2xl font-bold text-gray-900 mb-4">$1,640.00</p>
                      <div className="flex items-end gap-2 h-24">
                        {monthlyTrend.map((h, j) => (
                          <div
                            key={j}
                            className="flex-1 bg-orange-400 rounded-t-md"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {feature.visual === 'transactions' && (
                    <div className="bg-white border border-orange-100 rounded-xl p-4 space-y-3">
                      {transactions.map((t, j) => (
                        <div key={j} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-sm">
                              {t.icon}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-800">{t.name}</p>
                              <p className="text-[11px] text-gray-400">{t.category}</p>
                            </div>
                          </div>
                          <p className={`text-xs font-semibold ${t.amount.startsWith('+') ? 'text-green-600' : 'text-gray-700'}`}>
                            {t.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {feature.visual === 'budget' && (
                    <div className="bg-white border border-orange-100 rounded-xl p-4 space-y-4">
                      {budgetCategories.map((c, j) => (
                        <div key={j}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">{c.name}</span>
                            <span className={`font-semibold ${c.percent >= 100 ? 'text-red-500' : 'text-gray-800'}`}>
                              {c.percent}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-orange-50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${c.percent >= 100 ? 'bg-red-400' : 'bg-orange-500'}`}
                              style={{ width: `${Math.min(c.percent, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {feature.visual === 'insight' && (
                    <div className="bg-white border border-orange-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-sm">🤖</div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800">Spending prediction</p>
                          <p className="text-[10px] text-gray-400">Powered by Gemini AI</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Based on your last 3 months, you're on track to spend about 12% more next month than your average. Cutting dining out twice a week would offset most of the increase.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports banner */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto border border-gray-100 rounded-2xl px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-lg mb-4">📄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Turn your activity into reports</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Generate monthly financial reports with category-wise summaries, and download them as a PDF whenever you need a clear record of where your money went.
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl border border-orange-100">📄</div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Monthly Report — June 2026</p>
              <p className="text-xs text-gray-400">PDF · Category breakdown included</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100  bg-gray-50 px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Questions answered</h2>
            <p className="text-gray-500 text-sm">A few things people usually ask before signing up.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-800">{faq.q}</span>
                    <span className={`text-orange-500 text-sm transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 bg-white">
                      <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto bg-orange-500 rounded-3xl px-8 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Start tracking your finances for free
          </h2>
          <p className="text-orange-100 text-sm mb-6 max-w-md mx-auto">
            Create an account and log your first transaction in under a minute.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-orange-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
          >
            Create free account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 px-8 py-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-3">
          <img src={logo} alt="FinSight" className="h-10 w-auto object-contain" />
          <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
            FinSight is an AI-powered personal finance tracker for logging transactions, managing budgets, and getting insights from Gemini AI.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            © {new Date().getFullYear()} FinSight. Your data stays private.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;