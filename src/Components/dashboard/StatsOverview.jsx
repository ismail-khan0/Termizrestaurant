import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useOrders } from '../../hooks/useOrders';
import StatsCard from '../common/StatsCard';
import { DollarIcon, ClipboardIcon, ShoppingCartIcon, ChartIcon } from '../../utils/icons';

const StatsOverview = ({ dateRange }) => {
  const { stats, loading: statsLoading, error: statsError, refreshStats } = useDashboard();
  const { orders } = useOrders('All');

  const calculateRevenueStats = () => {
    const filteredOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      try {
        const orderDate = new Date(order.createdAt);
        return orderDate >= dateRange.startDate && orderDate <= dateRange.endDate;
      } catch (error) {
        return false;
      }
    });

    const revenue = filteredOrders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
    const activeOrders = filteredOrders.filter(order => ['pending', 'preparing', 'ready'].includes(order.status));

    return {
      revenue,
      ordersCount: filteredOrders.length,
      activeOrders: activeOrders.length,
      averageOrderValue: filteredOrders.length > 0 ? revenue / filteredOrders.length : 0,
    };
  };

  const revenueStats = calculateRevenueStats();

  if (statsError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="col-span-4 bg-red-900 bg-opacity-20 border border-red-700 rounded-xl p-4 text-center">
          <div className="text-2xl mx-auto mb-2 text-red-400">⚠️</div>
          <p className="text-red-400 text-sm">Failed to load dashboard data</p>
          <button 
            onClick={refreshStats}
            className="mt-2 bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 flex items-center gap-1 mx-auto"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#1a1a1a] rounded-xl p-4 animate-pulse">
            <div className="h-3 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <StatsCard
        title="Total Revenue"
        subtitle={`${revenueStats.ordersCount} orders`}
        value={`Rs${revenueStats.revenue.toLocaleString()}`}
        trend={{ 
          isPositive: revenueStats.revenue > 0, 
          value: "Current" 
        }}
        icon={<DollarIcon className="text-green-400" size={20} />}
      />
      
      <StatsCard
        title="Active Orders"
        value={revenueStats.activeOrders}
        subtitle="In progress"
        trend={{ 
          isPositive: revenueStats.activeOrders > 0, 
          value: "Live" 
        }}
        icon={<ClipboardIcon className="text-blue-400" size={20} />}
      />

      <StatsCard
        title="Total Orders"
        value={revenueStats.ordersCount}
        subtitle="Completed & active"
        trend={{ 
          isPositive: revenueStats.ordersCount > 0, 
          value: "This period" 
        }}
        icon={<ShoppingCartIcon className="text-purple-400" size={20} />}
      />
      
      <StatsCard
        title="Average Order"
        value={`Rs${revenueStats.averageOrderValue.toFixed(0)}`}
        subtitle="Per order"
        trend={{ 
          isPositive: revenueStats.averageOrderValue > 0, 
          value: "Value" 
        }}
        icon={<ChartIcon className="text-yellow-400" size={20} />}
      />
    </div>
  );
};

export default StatsOverview;