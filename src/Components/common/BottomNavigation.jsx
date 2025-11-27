import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { icons } from '../../utils/icons';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: <icons.chart size={18} />, label: 'Dashboard' },
    { path: '/menu', icon: <icons.restaurant size={18} />, label: 'Menu' },
    { path: '/orders', icon: <icons.clipboard size={18} />, label: 'Orders' },
    { path: '/tables', icon: <icons.table size={18} />, label: 'Tables' },
    { path: '/settings', icon: <icons.settings size={18} />, label: 'Settings' }
  ];

  const adminItems = [
    { path: '/admin/menu', icon: <icons.edit size={16} />, label: 'Menu' },
    { path: '/admin/tables', icon: <icons.settings size={16} />, label: 'Tables' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 z-50 shadow-lg">
      {/* Admin Quick Access - Now above main nav */}
      <div className="flex justify-around py-1 bg-[#222] border-b border-gray-700">
        {adminItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Navigation */}
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center p-1 rounded-lg transition-colors min-w-16 ${
              location.pathname === item.path
                ? 'bg-yellow-500 text-black shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs mt-0.5 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;