// src/Pages/Orders.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/common/Header';
import OrderTabs from '../Components/orders/OrderTabs';
import OrderCard from '../Components/orders/OrderCard';
import Pagination from '../Components/common/Pagination';
import { useOrders } from '../hooks/useOrders';
import { usePagination } from '../hooks/usePagination';
import { icons } from '../utils/icons';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const { orders, loading, error, updateOrderStatus } = useOrders(activeTab);
  
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedOrders,
    goToPage
  } = usePagination(orders, 6);

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length,
    };
  };

  const stats = getOrderStats();

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white p-4 pb-32">
        <Header title="Orders" />
        <div className="text-red-500 text-center py-8 bg-red-900 bg-opacity-20 rounded-xl">
          <icons.warning className="text-4xl mx-auto mb-2" />
          <p className="text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2 mx-auto"
          >
            <icons.refresh />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white p-4 pb-32">
      <Header title="Orders Management" />

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center border border-gray-800">
          <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center border border-yellow-500 border-opacity-50">
          <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          <div className="text-xs text-gray-400">Pending</div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center border border-blue-500 border-opacity-50">
          <div className="text-2xl font-bold text-blue-400">{stats.preparing}</div>
          <div className="text-xs text-gray-400">Preparing</div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center border border-green-500 border-opacity-50">
          <div className="text-2xl font-bold text-green-400">{stats.ready}</div>
          <div className="text-xs text-gray-400">Ready</div>
        </div>
        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center border border-gray-500 border-opacity-50">
          <div className="text-2xl font-bold text-gray-400">{stats.completed}</div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
      </div>

      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading orders...</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusUpdate={updateOrderStatus}
              />
            ))}
          </div>

          {paginatedOrders.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-[#1a1a1a] rounded-xl border border-gray-800">
              <icons.clipboard className="text-6xl mx-auto mb-4" />
              <p className="text-lg">No orders found</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;