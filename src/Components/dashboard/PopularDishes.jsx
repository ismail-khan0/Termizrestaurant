// src/Components/dashboard/PopularDishes.jsx
import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';

const PopularDishes = ({ dateRange }) => {
  const { stats, loading, error } = useDashboard();

  // Filter popular dishes by date range
  const filteredPopularDishes = React.useMemo(() => {
    if (!stats?.popularDishes) return [];
    
    return stats.popularDishes.filter(dish => {
      if (!dish.lastOrdered) return true;
      try {
        const dishDate = new Date(dish.lastOrdered);
        return dishDate >= dateRange.startDate && dishDate <= dateRange.endDate;
      } catch (error) {
        return true;
      }
    });
  }, [stats?.popularDishes, dateRange]);

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Popular Dishes</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex justify-between items-center bg-[#222] p-3 rounded-xl animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                <div>
                  <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-12"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-700 rounded w-8"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Popular Dishes</h2>
        <div className="text-center py-8 text-red-400">
          <div className="text-4xl mb-2">⚠️</div>
          <p>Failed to load data</p>
        </div>
      </div>
    );
  }

  const popularDishes = filteredPopularDishes;
  const totalOrders = popularDishes.reduce((sum, dish) => sum + (dish.orders || 0), 0);

  const getRankColor = (index) => {
    switch (index) {
      case 0: return 'bg-yellow-500 text-black';
      case 1: return 'bg-gray-400 text-black';
      case 2: return 'bg-orange-500 text-black';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Popular Dishes</h2>
        <span className="text-sm text-gray-400">
          {totalOrders > 0 ? `${totalOrders} orders` : 'Selected Period'}
        </span>
      </div>
      
      <div className="space-y-3">
        {popularDishes.slice(0, 5).map((dish, index) => {
          const percentage = totalOrders > 0 ? Math.round((dish.orders / totalOrders) * 100) : 0;
          const revenue = dish.revenue || 0;
          
          return (
            <div key={index} className="flex justify-between items-center bg-[#222] p-3 rounded-xl hover:bg-[#2a2a2a] transition-colors border border-gray-800">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getRankColor(index)}`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{dish.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span>{dish.orders || 0} orders</span>
                    {revenue > 0 && (
                      <span>• RS{revenue.toLocaleString()}</span>
                    )}
                  </div>
                  {dish.orders > 0 && (
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-semibold text-yellow-400">
                  {percentage}%
                </div>
                {revenue > 0 && (
                  <div className="text-xs text-green-400">
                    RS{revenue.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {popularDishes.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🍽️</div>
            <p>No orders in this period</p>
            <p className="text-sm">Try selecting a different date range</p>
          </div>
        )}
      </div>

      {totalOrders > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Revenue</span>
            <span className="font-semibold text-yellow-400">
              RS{popularDishes.reduce((sum, dish) => sum + (dish.revenue || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularDishes;