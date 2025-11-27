// src/Components/common/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, subtitle, trend, icon }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold text-white mb-2">{value}</p>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        
        {/* Icon container */}
        <div className="text-2xl">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend.isPositive ? '↗' : '↘'} {trend.value}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;