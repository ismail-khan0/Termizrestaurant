// src/Components/orders/OrderCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrintComponent from '../common/PrintComponent'; 
import { formatDate } from '../../utils/formatters';
import { getInitials } from '../../utils/helpers';
import { icons } from '../../utils/icons';

const OrderCard = ({ order, onStatusUpdate }) => {
  const navigate = useNavigate();
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState('customer');

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      preparing: 'bg-blue-500',
      ready: 'bg-green-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pending',
      preparing: 'Preparing',
      ready: 'Ready to Serve',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusFlow = {
      pending: ['preparing'],
      preparing: ['ready'],
      ready: ['completed'],
      completed: []
    };
    return statusFlow[currentStatus] || [];
  };

  const getStatusButtonText = (status) => {
    const buttonText = {
      preparing: 'Start Preparing',
      ready: 'Mark Ready',
      completed: 'Complete Order'
    };
    return buttonText[status] || status;
  };

  const handleStatusUpdate = (newStatus) => {
    if (window.confirm(`Change order status to "${getStatusText(newStatus)}"?`)) {
      onStatusUpdate(order._id, newStatus);
    }
  };

  const canUpdateStatus = (currentStatus) => {
    return ['pending', 'preparing', 'ready'].includes(currentStatus);
  };

  const nextStatusOptions = getNextStatusOptions(order.status);

  const handlePrintOption = (type) => {
    setPrintType(type);
    setShowPrintModal(true);
  };

  return (
    <div className="bg-[#1D1D1D] rounded-xl p-4 border border-gray-800 hover:border-gray-600 transition-colors group">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex justify-center items-center text-black font-bold">
            {getInitials(order.customerName)}
          </div>
          <div>
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <icons.table size={12} />
              Table {order.tableNumber} • {order.type}
            </p>
          </div>
        </div>

        <div className={`${getStatusColor(order.status)} px-3 py-1 rounded-lg text-xs text-white font-semibold`}>
          {getStatusText(order.status)}
        </div>
      </div>

      {/* Order Info */}
      <div className="mb-3">
        <p className="text-gray-400 text-sm flex items-center gap-1">
          <span>#{order.orderNumber}</span>
          <span>•</span>
          <icons.clock size={12} />
          <span>{formatDate(order.createdAt)}</span>
        </p>
      </div>

      {/* Items Preview */}
      <div className="mb-4">
        <p className="text-sm text-gray-300 mb-2 flex items-center gap-1">
          <icons.restaurant size={14} />
          {order.items?.length || 0} Items:
        </p>
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {order.items?.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-400">
                {item.quantity}x {item.title}
              </span>
              <span className="text-yellow-400">RS{item.total}</span>
            </div>
          ))}
          {order.items?.length > 3 && (
            <p className="text-xs text-gray-500">
              +{order.items.length - 3} more items
            </p>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-700 mb-3">
        <div>
          <p className="text-gray-300 text-sm">Total Amount</p>
          <p className="font-semibold text-lg text-yellow-400">RS{order.total || 0}</p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>Subtotal: RS{order.subtotal}</p>
          <p>Tax: RS{order.tax}</p>
        </div>
      </div>

      {/* Status Progression Buttons */}
      {canUpdateStatus(order.status) && nextStatusOptions.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <icons.refresh size={12} />
            Update Status:
          </p>
          <div className="flex gap-2">
            {nextStatusOptions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                  status === 'preparing' ? 'bg-blue-600 hover:bg-blue-700' :
                  status === 'ready' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {status === 'preparing' && <icons.clock size={12} />}
                {status === 'ready' && <icons.check size={12} />}
                {status === 'completed' && <icons.check size={12} />}
                {getStatusButtonText(status)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-700">
        <button
          onClick={() => navigate(`/orders/${order._id}`)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded text-xs transition-colors flex items-center justify-center gap-1"
        >
          <icons.edit size={12} />
          View Details
        </button>
        <button
          onClick={() => handlePrintOption('customer')}
          className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded text-xs transition-colors flex items-center justify-center gap-1"
        >
          <icons.receipt size={12} />
          Print Bill
        </button>
        <button
          onClick={() => handlePrintOption('kitchen')}
          className="flex-1 bg-orange-600 hover:bg-orange-700 py-2 rounded text-xs transition-colors flex items-center justify-center gap-1"
        >
          <icons.kitchen size={12} />
          Kitchen
        </button>
      </div>

      {/* Print Modal */}
      {showPrintModal && (
        <PrintComponent
          type={printType}
          orderData={order}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};

export default OrderCard;