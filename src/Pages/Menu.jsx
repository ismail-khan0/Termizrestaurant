// src/Pages/Menu.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import Header from '../Components/common/Header';
import CategoryCard from '../Components/menu/CategoryCard';
import MenuItem from '../Components/menu/MenuItem';
import Ordersummary from '../Components/menu/OrderSummary';
import TableSelector from '../Components/menu/TableSelector';
import SearchBar from '../Components/common/SearchBar';
import { api } from '../services/api';

const Menu = () => {
  const { state, dispatch } = useApp();
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [waiterName, setWaiterName] = useState('');
  const [orderType, setOrderType] = useState('dine-in');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Menu Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuItems, categories, tables] = await Promise.all([
          api.getMenuItems(),
          api.getCategories(),
          api.getTables()
        ]);
        
        dispatch({ type: 'SET_MENU_ITEMS', payload: menuItems });
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
        dispatch({ type: 'SET_TABLES', payload: tables });
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Filter menu items based on category and search
  const filteredItems = useMemo(() => {
    let items = activeCategory === 'All'
      ? state.menuItems
      : state.menuItems.filter(item => item.category._id === activeCategory);

    if (searchTerm) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items;
  }, [state.menuItems, activeCategory, searchTerm]);

  const handleAddToOrder = (item, quantity) => {
    if (orderType === 'dine-in' && !selectedTable) {
      return alert('Please select a table first');
    }
    if (orderType === 'delivery' && !deliveryAddress) {
      return alert('Please enter delivery address');
    }

    dispatch({
      type: 'ADD_TO_ORDER',
      payload: {
        ...item,
        quantity,
        total: item.price * quantity,
      },
    });
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    dispatch({ type: 'SET_ORDER_TYPE', payload: type });

    if (type === 'delivery') {
      setDeliveryCharges(100);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white p-4 pb-32">
        <Header title="Termiz Restaurant" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col pb-32">
      <Header title="Termiz Restaurant" />

      <div className="flex flex-1">
        {/* ------- MAIN CONTENT ------- */}
        <div className="flex-1 p-4 md:p-6">
          {/* Order Type Section */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Type</h2>
            <div className="grid grid-cols-3 gap-3">
              {['dine-in', 'takeaway', 'delivery'].map(type => (
                <button
                  key={type}
                  onClick={() => handleOrderTypeChange(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    orderType === type
                      ? 'border-yellow-500 bg-yellow-500 bg-opacity-20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold capitalize">{type.replace('-', ' ')}</div>
                  <div className="text-xs text-gray-400">
                    {type === 'dine-in' ? 'Restaurant' :
                     type === 'takeaway' ? 'Pickup' : 'Home Delivery'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Table Select - Dine In */}
          {orderType === 'dine-in' && (
            <TableSelector
              tables={state.tables}
              selectedTable={selectedTable}
              onTableSelect={setSelectedTable}
              customerName={customerName}
              onCustomerNameChange={setCustomerName}
              waiterName={waiterName}
              onWaiterNameChange={setWaiterName}
            />
          )}

          {/* Delivery Fields */}
          {orderType === 'delivery' && (
            <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-sm font-medium mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#222] rounded-lg px-4 py-3 border border-gray-600 outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-[#222] rounded-lg px-4 py-3 border border-gray-600 outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#222] rounded-lg px-4 py-3 border border-gray-600 outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Charges</label>
                  <input
                    type="number"
                    value={deliveryCharges}
                    onChange={(e) => setDeliveryCharges(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#222] rounded-lg px-4 py-3 border border-gray-600 outline-none focus:border-yellow-500"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Waiter Select */}
          {orderType === 'dine-in' && (
            <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6">
              <label className="block text-sm font-medium mb-2">Waiter</label>
              <select
                value={waiterName}
                onChange={(e) => setWaiterName(e.target.value)}
                className="w-full bg-[#222] rounded-lg px-4 py-3 border border-gray-600 outline-none focus:border-yellow-500"
              >
                <option value="">Select Waiter</option>
                <option value="Waiter 1">Waiter 1</option>
                <option value="Waiter 2">Waiter 2</option>
                <option value="Waiter 3">Waiter 3</option>
                <option value="Waiter 4">Waiter 4</option>
              </select>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
            />
          </div>

          {/* Categories */}
          <h2 className="text-xl font-semibold mt-6 mb-4">Menu Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            <div
              onClick={() => setActiveCategory('All')}
              className={`bg-gray-700 text-white p-3 rounded-xl cursor-pointer hover:opacity-90 transition-all ${
                activeCategory === 'All' ? 'ring-2 ring-yellow-500 scale-105' : ''
              }`}
            >
              <p className="font-semibold text-sm">All</p>
              <p className="text-xs text-gray-300">{state.menuItems.length} Items</p>
            </div>

            {state.categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                isActive={activeCategory === category._id}
                onClick={() => setActiveCategory(category._id)}
              />
            ))}
          </div>

          {/* Menu List */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {activeCategory === 'All'
                ? 'All Menu Items'
                : state.categories.find(cat => cat._id === activeCategory)?.name + ' Items'}

              {searchTerm && ` - Search: "${searchTerm}"`}
            </h2>

            <span className="text-gray-400 text-sm">
              {filteredItems.length} items found
            </span>
          </div>

          {/* Menu Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <MenuItem
                key={item._id}
                item={item}
                onAddToOrder={handleAddToOrder}
                disabled={orderType === 'dine-in' && !selectedTable}
                size="medium"
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🍽️</div>
              <p>No items found {searchTerm && `for "${searchTerm}"`}</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-yellow-500 hover:text-yellow-400"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* ------- RIGHT SIDEBAR ------- */}
        <div className="hidden lg:block w-96 bg-[#111] border-l border-gray-800">
          <Ordersummary
            selectedTable={selectedTable}
            customerName={customerName}
            waiterName={waiterName}
            orderType={orderType}
            deliveryAddress={deliveryAddress}
            deliveryCharges={deliveryCharges}
            onClearOrder={() => dispatch({ type: 'CLEAR_CURRENT_ORDER' })}
          />
        </div>
      </div>

      {/* ------- MOBILE ORDER SUMMARY BAR ------- */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">
              {state.currentOrder.items.length} Items • rs
              {state.currentOrder.items.reduce((sum, item) => sum + item.total, 0)}
            </p>
            <p className="text-sm text-gray-400">
              {orderType === 'dine-in' && selectedTable
                ? `Table ${selectedTable.number}`
                : orderType}
            </p>
          </div>

          <button
            onClick={() => document.getElementById('mobile-order-modal').showModal()}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600"
          >
            View Order
          </button>
        </div>
      </div>

      {/* ------- MOBILE ORDER SUMMARY MODAL ------- */}
      <dialog id="mobile-order-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-[#1a1a1a] text-white max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Current Order</h3>

          <Ordersummary
            selectedTable={selectedTable}
            customerName={customerName}
            waiterName={waiterName}
            orderType={orderType}
            deliveryAddress={deliveryAddress}
            deliveryCharges={deliveryCharges}
            onClearOrder={() => {
              dispatch({ type: 'CLEAR_CURRENT_ORDER' });
              document.getElementById('mobile-order-modal').close();
            }}
            isMobile={true}
          />

          <div className="modal-action">
            <button
              className="btn bg-gray-600 text-white"
              onClick={() => document.getElementById('mobile-order-modal').close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Menu;
