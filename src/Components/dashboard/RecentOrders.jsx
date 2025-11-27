// src/Components/dashboard/RecentOrders.jsx
import React, { useMemo } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useNavigate } from 'react-router-dom';
import { icons } from '../../utils/icons';

const RecentOrders = ({ searchTerm = "", dateRange }) => {
  const navigate = useNavigate();
  const { orders, loading, error } = useOrders('All');

  // Filter orders by date range and search term
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      if (!order.createdAt) return false;
      try {
        const orderDate = new Date(order.createdAt);
        return orderDate >= dateRange.startDate && orderDate <= dateRange.endDate;
      } catch (error) {
        return false;
      }
    });

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tableNumber?.toString().includes(searchTerm) ||
        order.items?.some(item =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  }, [orders, searchTerm, dateRange]);

  // Only show active orders (max 5)
  const recentOrders = filteredOrders
    .filter(order => order.status !== 'completed')
    .slice(0, 5);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      preparing: 'bg-blue-500',
      ready: 'bg-green-500',
      completed: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    const map = {
      pending: 'Pending',
      preparing: 'Preparing',
      ready: 'Ready',
      completed: 'Completed'
    };
    return map[status] || status;
  };

  const formatOrderDate = (date) => {
    if (!date) return "No Date";
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleViewAll = () => navigate('/orders');

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <div className="w-20 h-6 bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between bg-[#222] p-4 rounded-xl animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                <div>
                  <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="text-center py-8 text-red-400">
          <icons.warning className="text-4xl mx-auto mb-2" />
          <p>Failed to load orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {recentOrders.length} active{searchTerm && ` (filtered)`}
          </span>
          <button 
            onClick={handleViewAll}
            className="text-yellow-500 text-sm hover:text-yellow-400 font-medium flex items-center gap-1"
          >
            View All
            <icons.chevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <icons.clipboard className="text-4xl mx-auto mb-2" />
            <p className="text-lg">No active orders</p>
            <p className="text-sm">Start taking orders to see them here</p>
          </div>
        ) : (
          recentOrders.map((order) => (
            <div
              key={order._id}
              className="bg-[#222] p-4 rounded-xl hover:bg-[#2a2a2a] transition-colors border border-gray-800 cursor-pointer"
              onClick={() => navigate('/orders')}
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-black">
                    {order.customerName?.split(' ').map(n => n[0]).join('') || 'CN'}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono font-semibold text-yellow-400">
                        {order.orderNumber || `#ORD${new Date(order.createdAt).getTime()}`}
                      </p>
                      <span className="text-gray-400">•</span>
                      <p className="text-xs text-gray-400">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    
                    <p className="font-semibold text-sm">{order.customerName}</p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              {/* Order Details */}
              <div className="flex justify-between items-center text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <span>{order.items?.length || 0} Items</span>
                  <span>•</span>
                  <span>₨{order.total || 0}</span>
                  {order.tableNumber && (
                    <>
                      <span>•</span>
                      <span>Table {order.tableNumber}</span>
                    </>
                  )}
                </div>
                
                <div className="text-xs bg-gray-700 px-2 py-1 rounded">
                  {order.orderType?.toUpperCase() || 'DINE-IN'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Show more button */}
      {filteredOrders.length > 5 && (
        <div className="mt-4 text-center">
          <button 
            onClick={handleViewAll}
            className="text-yellow-500 text-sm hover:text-yellow-400 font-medium flex items-center gap-1 mx-auto"
          >
            View All {filteredOrders.length} Orders
            <icons.chevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;