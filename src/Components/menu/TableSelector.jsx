import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  TableIcon, 
  UsersIcon, 
  MapPinIcon, 
  UserIcon, 
  UserCheckIcon,
  ClockIcon,
  PlusIcon,
  EditIcon
} from '../../utils/icons';

const TableSelector = ({ 
  tables, 
  selectedTable, 
  onTableSelect, 
  customerName, 
  onCustomerNameChange,
  waiterName,
  onWaiterNameChange
}) => {
  const { actions } = useApp();
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [newWaiterName, setNewWaiterName] = useState('');
  const [waiters, setWaiters] = useState([
    'Waiter 1',
    'Waiter 2', 
    'Waiter 3',
    'Waiter 4'
  ]);

  const handleTableSelect = (table) => {
    if (table.status !== 'available') return;
    
    onTableSelect(table);
    actions.setOrderTable(table.number);

    if (table.customerName) {
      onCustomerNameChange(table.customerName);
      actions.setOrderCustomer(table.customerName);
    }

    if (table.waiterName) {
      onWaiterNameChange(table.waiterName);
    }
  };

  const handleAddWaiter = () => {
    if (newWaiterName.trim() && !waiters.includes(newWaiterName.trim())) {
      const updatedWaiters = [...waiters, newWaiterName.trim()];
      setWaiters(updatedWaiters);
      onWaiterNameChange(newWaiterName.trim());
      setNewWaiterName('');
      setShowWaiterModal(false);
    }
  };

  const handleRemoveWaiter = (waiterToRemove) => {
    if (waiters.length <= 1) {
      alert('You must have at least one waiter');
      return;
    }
    
    const updatedWaiters = waiters.filter(waiter => waiter !== waiterToRemove);
    setWaiters(updatedWaiters);
    
    // If the removed waiter was selected, clear the selection
    if (waiterName === waiterToRemove) {
      onWaiterNameChange('');
    }
  };

  const getTableStatusText = (table) => {
    switch (table.status) {
      case 'available': return 'Available';
      case 'occupied': return 'Occupied';
      case 'reserved': return 'Reserved';
      case 'cleaning': return 'Cleaning';
      default: return table.status;
    }
  };

  const getLocationText = (location) => {
    const map = {
      'main-hall': 'Main Hall',
      'terrace': 'Terrace',
      'private-room': 'Private Room',
      'garden': 'Garden',
      'outdoor': 'Outdoor'
    };
    return map[location] || location;
  };

  const getStatusColor = (status) => ({
    available: 'bg-green-500',
    occupied: 'bg-red-500',
    reserved: 'bg-yellow-500',
    cleaning: 'bg-blue-500'
  }[status] || 'bg-gray-500');

  const getStatusBorderColor = (status) => ({
    available: 'border-green-500',
    occupied: 'border-red-500',
    reserved: 'border-yellow-500',
    cleaning: 'border-blue-500'
  }[status] || 'border-gray-500');

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Select Table & Customer</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
        {/* Customer Name */}
        <div>
          <label className="text-sm mb-2 block">Customer Name *</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => {
              onCustomerNameChange(e.target.value);
              actions.setOrderCustomer(e.target.value);
            }}
            placeholder="Enter customer name"
            className="w-full bg-[#222] rounded-lg px-3 py-2 outline-none border border-gray-600 focus:border-yellow-500 text-sm"
            required
          />
        </div>

        {/* Waiter Selection */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm">Waiter *</label>
            <button
              type="button"
              onClick={() => setShowWaiterModal(true)}
              className="text-yellow-500 hover:text-yellow-400 text-xs flex items-center gap-1"
            >
              <PlusIcon size={12} />
              Add Waiter
            </button>
          </div>
          
          <div className="flex gap-2">
            <select
              value={waiterName}
              onChange={(e) => onWaiterNameChange(e.target.value)}
              className="flex-1 bg-[#222] rounded-lg px-3 py-2 outline-none border border-gray-600 focus:border-yellow-500 text-sm"
              required
            >
              <option value="">Select Waiter</option>
              {waiters.map((waiter, index) => (
                <option key={index} value={waiter}>
                  {waiter}
                </option>
              ))}
            </select>
            
            {waiterName && (
              <button
                type="button"
                onClick={() => onWaiterNameChange('')}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                title="Clear selection"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table List */}
      <label className="text-sm font-medium mb-2 block">
        Select Table *
        <span className="text-gray-400 ml-2">
          {tables.filter(t => t.status === 'available').length} available
        </span>
      </label>

      {tables.length === 0 ? (
        <div className="text-center py-6 bg-[#222] rounded-lg">
          <div className="text-4xl mb-1">🍽️</div>
          <p className="text-gray-400 text-sm">No tables available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tables.map(table => {
            const isAvailable = table.status === 'available';
            const isSelected = selectedTable?._id === table._id;

            return (
              <div
                key={table._id}
                onClick={() => isAvailable && handleTableSelect(table)}
                className={`
                  bg-[#1a1a1a] rounded-xl p-3 border min-h-[150px] flex flex-col relative
                  transition-all
                  ${isSelected
                    ? "border-yellow-500 bg-yellow-500/10 ring-1 ring-yellow-500/40"
                    : isAvailable
                      ? `${getStatusBorderColor(table.status)} hover:border-yellow-400 hover:scale-[1.02] cursor-pointer`
                      : `${getStatusBorderColor(table.status)} opacity-60 cursor-not-allowed`
                  }
                `}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${getStatusColor(table.status)}`}>
                      <TableIcon size={14} className="text-white" />
                    </div>
                    <h3 className="font-bold text-base">Table {table.number}</h3>
                  </div>

                  <div className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(table.status)}`}>
                    {getTableStatusText(table)}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 text-xs flex-1">
                  
                  {/* Capacity */}
                  <div className="flex items-center gap-2">
                    <UsersIcon size={14} className="text-blue-400" />
                    <span>{table.capacity} persons</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={14} className="text-green-400" />
                    <span>{getLocationText(table.location)}</span>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} className={table.customerName ? "text-yellow-400" : "text-gray-400"} />
                    <span className={table.customerName ? "text-white" : "text-gray-400"}>
                      {table.customerName || "No customer"}
                    </span>
                  </div>

                  {/* Waiter */}
                  {table.waiterName && (
                    <div className="flex items-center gap-2">
                      <UserCheckIcon size={14} className="text-purple-400" />
                      <span>{table.waiterName}</span>
                    </div>
                  )}

                  {/* Active Order */}
                  {table.status === "occupied" && table.currentOrder && (
                    <div className="bg-red-500/20 p-2 rounded-lg mt-1">
                      <div className="flex items-center gap-1 text-red-300 text-[11px]">
                        <ClockIcon size={12} /> Active Order
                      </div>
                      {table.currentOrder.orderNumber && (
                        <div className="text-red-200 text-[11px]">#{table.currentOrder.orderNumber}</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="pt-2 mt-2 border-t border-yellow-500/30 text-center text-yellow-400 text-xs font-semibold flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    Selected
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Waiter Management Modal */}
      {showWaiterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manage Waiters</h3>
              <button
                onClick={() => setShowWaiterModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Add New Waiter */}
            <div className="mb-4">
              <label className="text-sm mb-2 block">Add New Waiter</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWaiterName}
                  onChange={(e) => setNewWaiterName(e.target.value)}
                  placeholder="Enter waiter name"
                  className="flex-1 bg-[#222] border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddWaiter()}
                />
                <button
                  onClick={handleAddWaiter}
                  disabled={!newWaiterName.trim()}
                  className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Existing Waiters List */}
            <div>
              <label className="text-sm mb-2 block">Current Waiters ({waiters.length})</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {waiters.map((waiter, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-[#222] p-3 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheckIcon size={16} className="text-green-400" />
                      <span className="font-medium">{waiter}</span>
                      {waiterName === waiter && (
                        <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-semibold">
                          Selected
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveWaiter(waiter)}
                      disabled={waiters.length <= 1}
                      className="text-red-400 hover:text-red-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                      title={waiters.length <= 1 ? "Cannot remove last waiter" : "Remove waiter"}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowWaiterModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSelector;