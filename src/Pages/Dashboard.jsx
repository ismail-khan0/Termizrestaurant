import React, { useState } from 'react';
import Header from '../Components/common/Header';
import StatsOverview from '../Components/dashboard/StatsOverview';
import RecentOrders from '../Components/dashboard/RecentOrders';
import PopularDishes from '../Components/dashboard/PopularDishes';
import DateRangeFilter from '../Components/dashboard/DateRangeFilter';
import DataTest from '../Components/common/DataTest';
import SearchBar from '../Components/common/SearchBar';
import { CalendarIcon, ChevronDownIcon } from '../utils/icons';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999))
  });

  const toggleDateFilter = () => {
    setShowDateFilter(!showDateFilter);
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const getDateRangeDisplayText = () => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    
    const isToday = start.toDateString() === new Date().toDateString() && 
                   end.toDateString() === new Date().toDateString();
    const isThisWeek = start.getDay() === 0 && 
                      end.getDay() === 6 && 
                      (end - start) === 6 * 24 * 60 * 60 * 1000;
    const isThisMonth = start.getDate() === 1 && 
                       end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
    
    if (isToday) return 'Today';
    if (isThisWeek) return 'This Week';
    if (isThisMonth) return 'This Month';
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#111] text-white p-3 pb-24 compact">
      <Header title="Termiz Restaurant" />
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-4">
        <div className="flex-1 max-w-md">
          <SearchBar 
            placeholder="Search recent orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
        </div>
        
        {/* Date Filter Toggle Button */}
        <div className="relative">
          <button
            onClick={toggleDateFilter}
            className="bg-[#1a1a1a] border border-gray-700 hover:border-yellow-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <CalendarIcon className="text-yellow-500" size={16} />
            <span>{getDateRangeDisplayText()}</span>
            <ChevronDownIcon 
              size={14} 
              className={`transform transition-transform ${showDateFilter ? 'rotate-180' : ''}`}
            />
          </button>
          
          {/* Date Filter Dropdown */}
          {showDateFilter && (
            <div className="absolute top-full right-0 mt-1 w-72 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg z-50">
              <DateRangeFilter 
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                onClose={() => setShowDateFilter(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Date Range Filter Panel */}
      {showDateFilter && (
        <div className="mb-4 lg:hidden">
          <DateRangeFilter 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onClose={() => setShowDateFilter(false)}
          />
        </div>
      )}
      
      <StatsOverview dateRange={dateRange} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentOrders searchTerm={searchTerm} dateRange={dateRange} />
        </div>
        <div className="lg:col-span-1">
          <PopularDishes dateRange={dateRange} />
          <DataTest />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;