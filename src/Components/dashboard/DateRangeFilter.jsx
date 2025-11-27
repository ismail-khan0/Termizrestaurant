// src/Components/dashboard/DateRangeFilter.jsx
import React from 'react';
import { FilterIcon, CloseIcon, CalendarIcon } from '../../utils/icons'; // Fixed path

const DateRangeFilter = ({ dateRange, onDateRangeChange, onClose }) => {
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    newStartDate.setHours(0, 0, 0, 0);
    
    onDateRangeChange(prev => ({
      ...prev,
      startDate: newStartDate
    }));
  };

  const handleEndDateChange = (e) => {
    const newEndDate = new Date(e.target.value);
    newEndDate.setHours(23, 59, 59, 999);
    
    onDateRangeChange(prev => ({
      ...prev,
      endDate: newEndDate
    }));
  };

  const setToday = () => {
    const today = new Date();
    onDateRangeChange({
      startDate: new Date(today.setHours(0, 0, 0, 0)),
      endDate: new Date(today.setHours(23, 59, 59, 999))
    });
    if (onClose) onClose();
  };

  const setThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    onDateRangeChange({
      startDate: startOfWeek,
      endDate: endOfWeek
    });
    if (onClose) onClose();
  };

  const setThisMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    
    onDateRangeChange({
      startDate: startOfMonth,
      endDate: endOfMonth
    });
    if (onClose) onClose();
  };

  const setAllTime = () => {
    onDateRangeChange({
      startDate: new Date(2020, 0, 1), // Start from 2020
      endDate: new Date(2100, 0, 1) // Far future
    });
    if (onClose) onClose();
  };

  const applyCustomRange = () => {
    if (onClose) onClose();
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="text-yellow-500" size={18} />
          <h3 className="font-semibold">Filter by Date</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      {/* Quick Date Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={setToday}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors text-center"
        >
          Today
        </button>
        <button
          onClick={setThisWeek}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors text-center"
        >
          This Week
        </button>
        <button
          onClick={setThisMonth}
          className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors text-center"
        >
          This Month
        </button>
        <button
          onClick={setAllTime}
          className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors text-center"
        >
          All Time
        </button>
      </div>

      {/* Custom Date Range */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Custom Range</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 min-w-12">From:</label>
            <input
              type="date"
              value={formatDateForInput(dateRange.startDate)}
              onChange={handleStartDateChange}
              className="flex-1 bg-[#222] border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 min-w-12">To:</label>
            <input
              type="date"
              value={formatDateForInput(dateRange.endDate)}
              onChange={handleEndDateChange}
              className="flex-1 bg-[#222] border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500"
            />
          </div>
        </div>
      </div>

      {/* Selected Range Display */}
      <div className="p-3 bg-[#222] rounded-lg border border-gray-600">
        <p className="text-sm text-gray-400 mb-1">Selected Range:</p>
        <p className="text-sm font-medium text-yellow-400">
          {dateRange.startDate.toLocaleDateString()} to {dateRange.endDate.toLocaleDateString()}
        </p>
      </div>

      {/* Apply Button for dropdown */}
      {onClose && (
        <button
          onClick={applyCustomRange}
          className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg font-semibold transition-colors"
        >
          Apply Filter
        </button>
      )}
    </div>
  );
};

export default DateRangeFilter;