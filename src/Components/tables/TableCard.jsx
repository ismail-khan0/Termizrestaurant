import React from 'react';
import { TableIcon, UsersIcon, MapPinIcon, UserIcon, ClockIcon, UserCheckIcon } from '../../utils/icons';

const TableCard = ({ table, isSelected = false, onSelect, showDetails = true }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-500';
      case 'cleaning': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'occupied': return 'Occupied';
      case 'reserved': return 'Reserved';
      case 'cleaning': return 'Cleaning';
      default: return status;
    }
  };

  const getLocationText = (location) => {
    const locations = {
      'main-hall': 'Main Hall',
      'terrace': 'Terrace',
      'private-room': 'Private Room',
      'garden': 'Garden',
      'outdoor': 'Outdoor'
    };
    return locations[location] || location;
  };

  const formatTableNumber = (number) => {
    return `Table ${number}`;
  };

  return (
    <div 
      className={`bg-[#1a1a1a] rounded-xl p-4 border-2 transition-all cursor-pointer hover:scale-105 min-h-[200px] flex flex-col ${
        isSelected 
          ? 'border-yellow-500 bg-yellow-500 bg-opacity-10' 
          : table.status === 'available'
          ? 'border-green-500 hover:border-green-400'
          : table.status === 'occupied'
          ? 'border-red-500 hover:border-red-400'
          : table.status === 'reserved'
          ? 'border-yellow-500 hover:border-yellow-400'
          : 'border-gray-600 hover:border-gray-500'
      }`}
      onClick={() => onSelect && onSelect(table)}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            table.status === 'available' ? 'bg-green-500' :
            table.status === 'occupied' ? 'bg-red-500' :
            table.status === 'reserved' ? 'bg-yellow-500' :
            'bg-blue-500'
          }`}>
            <TableIcon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl">{formatTableNumber(table.number)}</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(table.status)} mt-2`}>
              {getStatusText(table.status).toUpperCase()}
            </div>
          </div>
        </div>
        
        {/* Capacity Badge */}
        <div className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          <UsersIcon size={16} />
          <span>{table.capacity} seats</span>
        </div>
      </div>

      {/* Details Section */}
      {showDetails && (
        <div className="space-y-3 flex-1">
          {/* Location */}
          <div className="flex items-center gap-3 text-gray-300 bg-[#222] p-3 rounded-lg">
            <MapPinIcon size={18} className="text-blue-400" />
            <div>
              <div className="text-sm text-gray-400">Location</div>
              <div className="font-semibold">{getLocationText(table.location)}</div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="flex items-center gap-3 text-gray-300 bg-[#222] p-3 rounded-lg">
            <UserIcon size={18} className={
              table.customerName ? "text-green-400" : "text-gray-400"
            } />
            <div className="flex-1">
              <div className="text-sm text-gray-400">Customer</div>
              <div className={`font-semibold ${
                table.customerName ? "text-white" : "text-gray-400"
              }`}>
                {table.customerName || 'No customer name'}
              </div>
            </div>
          </div>

          {/* Waiter Information */}
          {table.waiterName && (
            <div className="flex items-center gap-3 text-gray-300 bg-[#222] p-3 rounded-lg">
              <UserCheckIcon size={18} className="text-yellow-400" />
              <div>
                <div className="text-sm text-gray-400">Waiter</div>
                <div className="font-semibold text-white">{table.waiterName}</div>
              </div>
            </div>
          )}

          {/* Order Information */}
          {table.status === 'occupied' && table.currentOrder && (
            <div className="bg-red-500 bg-opacity-20 p-3 rounded-lg border border-red-500 border-opacity-30">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon size={16} className="text-red-300" />
                <span className="text-sm font-semibold text-red-300">Active Order</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-red-200">Order #</span>
                  <span className="text-red-100 font-bold">
                    {table.currentOrder.orderNumber || 'N/A'}
                  </span>
                </div>
                {table.currentOrder.startTime && (
                  <div className="flex justify-between text-xs">
                    <span className="text-red-200">Started</span>
                    <span className="text-red-100">
                      {new Date(table.currentOrder.startTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                )}
                {table.currentOrder.itemsCount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-red-200">Items</span>
                    <span className="text-red-100">{table.currentOrder.itemsCount}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reservation Information */}
          {table.status === 'reserved' && (
            <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg border border-yellow-500 border-opacity-30">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon size={16} className="text-yellow-300" />
                <span className="text-sm font-semibold text-yellow-300">Reservation</span>
              </div>
              <div className="space-y-1">
                {table.reservationName && (
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-200">Name</span>
                    <span className="text-yellow-100 font-semibold">{table.reservationName}</span>
                  </div>
                )}
                {table.reservationTime && (
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-200">Time</span>
                    <span className="text-yellow-100">
                      {new Date(table.reservationTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                )}
                {table.reservationGuests && (
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-200">Guests</span>
                    <span className="text-yellow-100">{table.reservationGuests}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Table Specifications */}
          <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-gray-700">
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">Type</div>
              <div className="font-semibold text-gray-300 text-sm">
                {table.tableType || 'Standard'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">Shape</div>
              <div className="font-semibold text-gray-300 text-sm">
                {table.shape || 'Rectangle'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        {table.status === 'available' && (
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <UserIcon size={16} />
            Assign Customer
          </button>
        )}
        {table.status === 'occupied' && (
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <TableIcon size={16} />
            View Order Details
          </button>
        )}
        {table.status === 'reserved' && (
          <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <ClockIcon size={16} />
            View Reservation
          </button>
        )}
        {table.status === 'cleaning' && (
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            🧹
            Mark Clean
          </button>
        )}
      </div>
    </div>
  );
};

export default TableCard;