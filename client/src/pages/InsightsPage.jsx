import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInsights } from '../redux/dashboardSlice';
import { Sidebar } from '../components/Sidebar';

export const InsightsPage = () => {
  const dispatch = useDispatch();
  const { insights, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchInsights());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white flex">

      <Sidebar />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <span className="inline-block text-s font-medium bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1 rounded-full mb-2">
                Powered by AI
              </span>
              <p className="text-sm text-gray-500 mt-1">Personalized tips based on your spending habits.</p>
            </div>
            <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
              {insights.provider === 'openai' ? '🤖 OpenAI GPT-4o-mini' : '🔧 Heuristic engine'}
            </span>
          </div>

          {/* Recommendations card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Recommendations</h2>
            <p className="text-xs text-gray-400 mb-5">Based on your recent income and spending activity</p>

            {loading && (
              <p className="text-center text-sm text-gray-500 py-8">Loading insights...</p>
            )}

            {!loading && insights.insights.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-1 gap-3">
                {insights.insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-500 text-sm flex-shrink-0">
                      💡
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                  </li>
                ))}
              </ul>
            ) : (
              !loading && (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-400">No insights available yet. Add some transactions to get started!</p>
                </div>
              )
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
};