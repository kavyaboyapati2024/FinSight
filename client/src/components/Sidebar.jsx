import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import logo from '../pages/logo.png';
import logo2 from '../pages/logo2.png';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/budget', label: 'Budget' },
  { to: '/insights', label: 'Insights' },
  { to: '/reports', label: 'Reports' },
];

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-gray-100 shadow-md flex-shrink-0 transition-all duration-200 ${
        sidebarOpen ? 'w-60' : 'w-16'
      }`}
    >
      {/* Logo Section */}
      <div
        className={`flex items-center px-4 ${
          sidebarOpen
            ? 'h-[68px] justify-between'
            : 'h-[88px] flex-col justify-center gap-2'
        }`}
      >
        <img
          src={sidebarOpen ? logo : logo2}
          alt="FinSight"
          className={
            sidebarOpen
              ? 'ml-0 h-12 w-auto object-contain'
              : 'h-10 w-10 object-contain'
          }
        />

        {sidebarOpen && <span className="flex-1" />}

        <button
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200 transition-colors flex-shrink-0 text-xs"
        >
          {sidebarOpen ? '«' : '»'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              title={!sidebarOpen ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
                !sidebarOpen ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-orange-50 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-orange-500 rounded-full" />
              )}

              {!sidebarOpen ? (
                <span className="w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold flex-shrink-0">
                  {item.label.charAt(0)}
                </span>
              ) : (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-5 border-t border-gray-100 pt-4 mt-2">
        <Link
          to="/profile"
          title={!sidebarOpen ? (user?.name || 'Profile') : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors ${
            !sidebarOpen ? 'justify-center' : ''
          }`}
        >
          <div className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>

          {sidebarOpen && (
            <span className="truncate">{user?.name || 'Profile'}</span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          title={!sidebarOpen ? 'Log out' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors mt-1 ${
            !sidebarOpen ? 'justify-center' : ''
          }`}
        >
          {!sidebarOpen ? (
            <span className="w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold flex-shrink-0">
              ⏻
            </span>
          ) : (
            <span className="whitespace-nowrap">Log out</span>
          )}
        </button>
      </div>
    </aside>
  );
};