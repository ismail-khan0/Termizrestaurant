// src/Components/orders/OrderTabs.jsx
import React from 'react';

const OrderTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'All', label: 'All Orders', count: true },
    { key: 'pending', label: 'Pending', count: true },
    { key: 'preparing', label: 'Preparing', count: true },
    { key: 'ready', label: 'Ready', count: true },
    { key: 'completed', label: 'Completed', count: true }
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === tab.key 
              ? "bg-yellow-500 text-black" 
              : "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default OrderTabs;