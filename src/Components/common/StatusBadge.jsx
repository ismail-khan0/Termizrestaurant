import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-500', text: 'Pending' },
    preparing: { color: 'bg-blue-500', text: 'Preparing' },
    ready: { color: 'bg-green-500', text: 'Ready' },
    completed: { color: 'bg-gray-500', text: 'Completed' },
    cancelled: { color: 'bg-red-500', text: 'Cancelled' },
    available: { color: 'bg-green-500', text: 'Available' },
    occupied: { color: 'bg-red-500', text: 'Occupied' }
  };

  const config = statusConfig[status] || { color: 'bg-gray-500', text: status };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`${config.color} ${sizeClasses[size]} text-white rounded-lg font-semibold`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;