import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/common/Header';
import PrintComponent from '../Components/common/PrintComponent';
import Button from '../Components/common/Button';
import Modal from '../Components/common/Modal';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import { api } from '../services/api';
import { FiDollarSign, FiPrinter, FiEdit, FiX, FiCheck, FiUser, FiTable, FiClock, FiTrash2, FiPlus, FiRefreshCw, FiSearch, FiFilter } from 'react-icons/fi';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddItemSidebar, setShowAddItemSidebar] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState('customer');
  const [paymentData, setPaymentData] = useState({
    amountPaid: '',
    paymentMethod: 'cash',
    customerName: ''
  });
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrderDetails();
    fetchMenuData();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const allOrders = await api.getOrders('All');
      const foundOrder = allOrders.find(o => o._id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
        setPaymentData(prev => ({
          ...prev,
          customerName: foundOrder.customerName,
          amountPaid: foundOrder.total || ''
        }));
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError('Failed to load order details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuData = async () => {
    try {
      const [items, cats] = await Promise.all([
        api.getMenuItems(),
        api.getCategories()
      ]);
      setAllMenuItems(items);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load menu data:', err);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Change order status to "${getStatusText(newStatus)}"?`)) return;

    setUpdating(true);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await fetchOrderDetails();
    } catch (err) {
      alert('Error updating order status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleItemUpdate = async (itemIndex, field, value) => {
    if (!order) return;

    const updatedItems = [...order.items];
    if (field === 'quantity') {
      const quantity = parseInt(value) || 0;
      if (quantity === 0) {
        updatedItems.splice(itemIndex, 1);
      } else {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: quantity,
          total: updatedItems[itemIndex].price * quantity
        };
      }
    } else if (field === 'remove') {
      updatedItems.splice(itemIndex, 1);
    }

    updateOrderTotals(updatedItems);
  };

  const handleAddNewItem = (menuItem) => {
    if (!order) return;

    const existingItemIndex = order.items.findIndex(item => item._id === menuItem._id);
    
    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = [...order.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
        total: updatedItems[existingItemIndex].price * (updatedItems[existingItemIndex].quantity + 1)
      };
    } else {
      const newItem = {
        ...menuItem,
        quantity: 1,
        total: menuItem.price
      };
      updatedItems = [...order.items, newItem];
    }

    updateOrderTotals(updatedItems);
  };

  const updateOrderTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.0525;
    const total = subtotal + tax;

    const updatedOrder = {
      ...order,
      items: items,
      subtotal,
      tax,
      total
    };

    setOrder(updatedOrder);
  };

  const handleSaveOrder = async () => {
    if (!order) return;

    setUpdating(true);
    try {
      await api.deleteOrder(orderId);
      const newOrder = await api.createOrder(order);
      setOrder(newOrder);
      setEditing(false);
      setShowAddItemSidebar(false);
      alert('Order updated successfully!');
    } catch (err) {
      alert('Error updating order: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentData.amountPaid || !order) return;

    const amountPaid = parseFloat(paymentData.amountPaid);
    const change = amountPaid - order.total;

    if (change < 0) {
      alert('Amount paid is less than total amount!');
      return;
    }

    setUpdating(true);
    try {
      const paymentResult = await api.processPayment(orderId, {
        paymentMethod: paymentData.paymentMethod,
        amountPaid: amountPaid
      });
      
      setOrder(prev => ({ 
        ...prev, 
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: paymentData.paymentMethod,
        amountPaid: amountPaid,
        paidAt: new Date().toISOString()
      }));
      
      setShowPaymentModal(false);
      alert(`Payment successful! Change: ₨${change.toFixed(2)}`);
      await fetchOrderDetails();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Error processing payment: ' + (err.message || 'Please check the server connection'));
    } finally {
      setUpdating(false);
    }
  };

  const filteredMenuItems = allMenuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || 
      (item.category && item.category._id === selectedCategory);
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
      pending: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['completed'],
      completed: [],
      cancelled: []
    };
    return statusFlow[currentStatus] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] text-white p-4">
        <Header title="Order Details" onBack={() => navigate('/orders')} />
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
          <p className="mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#111] text-white p-4">
        <Header title="Order Details" onBack={() => navigate('/orders')} />
        <div className="text-center py-12 bg-red-900 bg-opacity-20 rounded-xl">
          <p className="text-lg text-red-400">{error || 'Order not found'}</p>
          <Button 
            onClick={() => navigate('/orders')}
            className="mt-4 mx-auto"
          >
            <FiX />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const change = paymentData.amountPaid ? parseFloat(paymentData.amountPaid) - order.total : 0;

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="flex">
        {/* Main Content - moves left when sidebar opens */}
        <div className={`flex-1 transition-all duration-300 ${showAddItemSidebar ? 'lg:mr-96' : ''}`}>
          <div className="p-4 pb-32">
            <Header title="Order Details" onBack={() => navigate('/orders')} />

            <div className="max-w-4xl mx-auto">
              {/* Order Header */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 border border-gray-800">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Order #{order.orderNumber}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiTable size={14} />
                        Table {order.tableNumber}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FiClock size={14} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-lg text-white font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                    <Button
                      onClick={() => setEditing(!editing)}
                      variant="secondary"
                    >
                      {editing ? <FiX size={16} /> : <FiEdit size={16} />}
                      {editing ? 'Cancel Edit' : 'Edit Order'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#222] p-3 rounded-lg">
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <FiUser size={14} />
                      Customer
                    </p>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                  <div className="bg-[#222] p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Order Type</p>
                    <p className="font-semibold capitalize">{order.type}</p>
                  </div>
                  <div className="bg-[#222] p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="font-semibold text-yellow-400 text-xl">₨{order.total?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Status Update Section */}
              {!editing && (
                <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 border border-gray-800">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FiRefreshCw />
                    Update Order Status
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {getNextStatusOptions(order.status).map((status) => (
                      <Button
                        key={status}
                        onClick={() => handleStatusUpdate(status)}
                        disabled={updating}
                        variant={
                          status === 'preparing' ? 'secondary' :
                          status === 'ready' ? 'success' :
                          status === 'completed' ? 'secondary' :
                          'danger'
                        }
                      >
                        {updating ? (
                          <LoadingSpinner size="small" />
                        ) : (
                          <FiCheck />
                        )}
                        {getStatusText(status)}
                      </Button>
                    ))}
                    {getNextStatusOptions(order.status).length === 0 && (
                      <p className="text-gray-400">No further status updates available</p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FiUser />
                    Order Items ({order.items?.length || 0})
                  </h2>
                  {editing && (
                    <Button
                      onClick={() => setShowAddItemSidebar(true)}
                      variant="success"
                    >
                      <FiPlus size={16} />
                      Add Item
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-[#222] p-4 rounded-lg group">
                      <div className="flex-1">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-gray-400 text-sm">₨{item.price} each</p>
                        {editing && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-2 bg-[#333] px-3 py-1 rounded">
                              <button 
                                onClick={() => handleItemUpdate(index, 'quantity', item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-600 rounded transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => handleItemUpdate(index, 'quantity', item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-600 rounded transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => handleItemUpdate(index, 'remove')}
                              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
                            >
                              <FiTrash2 size={14} />
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-semibold">₨{item.total}</p>
                        {!editing && (
                          <p className="text-gray-400 text-sm">{item.quantity} × ₨{item.price}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {order.items?.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <FiUser className="text-4xl mx-auto mb-2" />
                      <p>No items in this order</p>
                      {editing && (
                        <Button
                          onClick={() => setShowAddItemSidebar(true)}
                          variant="success"
                          className="mt-3 mx-auto"
                        >
                          <FiPlus size={16} />
                          Add First Item
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Order Totals */}
                <div className="border-t border-gray-700 mt-6 pt-6 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₨{order.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5.25%)</span>
                    <span>₨{order.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-2">
                    <span>Total Amount</span>
                    <span className="text-yellow-400">₨{order.total?.toFixed(2)}</span>
                  </div>

                  {/* Payment Information */}
                  {order.paymentStatus === 'paid' && (
                    <div className="mt-4 p-3 bg-green-900 bg-opacity-20 rounded-lg border border-green-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">Payment Status:</span>
                        <span className="text-green-400 font-semibold">PAID</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Payment Method:</span>
                        <span className="capitalize">{order.paymentMethod}</span>
                      </div>
                      {order.amountPaid && (
                        <div className="flex justify-between text-sm mt-1">
                          <span>Amount Paid:</span>
                          <span>₨{order.amountPaid}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {editing ? (
                    <>
                      <Button
                        onClick={handleSaveOrder}
                        disabled={updating || order.items.length === 0}
                        variant="success"
                        loading={updating}
                      >
                        <FiCheck />
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setEditing(false)}
                        variant="secondary"
                      >
                        <FiX />
                        Cancel Edit
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          setPrintType('customer');
                          setShowPrintModal(true);
                        }}
                        variant="secondary"
                      >
                        <FiPrinter />
                        Print Bill
                      </Button>
                      <Button
                        onClick={() => {
                          setPrintType('kitchen');
                          setShowPrintModal(true);
                        }}
                        variant="secondary"
                      >
                        🍳
                        Kitchen Print
                      </Button>
                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <Button
                          onClick={() => setShowPaymentModal(true)}
                          variant="success"
                        >
                          <FiDollarSign />
                          Process Payment
                        </Button>
                      )}
                      <Button
                        onClick={() => navigate('/orders')}
                        variant="secondary"
                      >
                        <FiX />
                        Back to Orders
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Item Sidebar */}
        {showAddItemSidebar && (
          <div className="fixed right-0 top-0 h-full w-96 bg-[#1a1a1a] border-l border-gray-700 z-50 transform transition-transform duration-300">
            <div className="h-full flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FiPlus />
                    Add Items to Order
                  </h2>
                  <button
                    onClick={() => setShowAddItemSidebar(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="p-4 border-b border-gray-700 space-y-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#222] rounded-lg pl-10 pr-4 py-2 outline-none border border-gray-600 focus:border-yellow-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FiFilter size={14} className="text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 bg-[#222] rounded-lg px-3 py-2 outline-none border border-gray-600 focus:border-yellow-500 text-sm"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-400">
                  {filteredMenuItems.length} items found
                </div>
              </div>

              {/* Menu Items List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-3">
                  {filteredMenuItems.map(item => (
                    <div
                      key={item._id}
                      className="bg-[#222] p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer group"
                      onClick={() => handleAddNewItem(item)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold group-hover:text-yellow-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-yellow-400 text-lg font-bold">₨{item.price}</p>
                        </div>
                        {item.isAvailable === false && (
                          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                            Unavailable
                          </span>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiClock size={10} />
                          {item.preparationTime}min
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          item.spicyLevel === 'high' ? 'bg-red-600' :
                          item.spicyLevel === 'medium' ? 'bg-orange-600' : 'bg-green-600'
                        }`}>
                          {item.spicyLevel}
                        </span>
                      </div>
                      
                      {item.category && (
                        <div className="mt-2">
                          <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                            {item.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredMenuItems.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <FiUser className="text-4xl mx-auto mb-2" />
                      <p>No menu items found</p>
                      <p className="text-sm">Try changing your search or filter</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-700">
                <div className="space-y-3">
                  <Button
                    onClick={handleSaveOrder}
                    disabled={updating || order.items.length === 0}
                    variant="success"
                    loading={updating}
                    className="w-full"
                  >
                    <FiCheck />
                    Save Order Changes
                  </Button>
                  <Button
                    onClick={() => setShowAddItemSidebar(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    <FiX />
                    Close Sidebar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Modal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        title="Process Payment"
        size="md"
      >
        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-[#222] p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Total Amount:</span>
                <span className="text-yellow-400 font-semibold text-lg">₨{order.total?.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-400">
                Order #: {order.orderNumber} • Table: {order.tableNumber}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount Paid</label>
              <input
                type="number"
                value={paymentData.amountPaid}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  amountPaid: e.target.value 
                }))}
                className="w-full bg-[#222] rounded-lg px-4 py-3 outline-none border border-gray-600 focus:border-yellow-500 text-lg font-semibold"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {['cash', 'card', 'upi', 'online'].map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: method }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paymentData.paymentMethod === method 
                        ? 'border-yellow-500 bg-yellow-500 bg-opacity-20' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-sm font-semibold capitalize">{method}</div>
                  </button>
                ))}
              </div>
            </div>

            {paymentData.amountPaid && (
              <div className={`p-3 rounded-lg border-2 ${
                change >= 0 
                  ? 'bg-green-900 bg-opacity-20 border-green-700' 
                  : 'bg-red-900 bg-opacity-20 border-red-700'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm">
                      {change >= 0 ? 'Change to Return:' : 'Amount Short:'}
                    </div>
                    <div className="text-xs text-gray-400">
                      Paid: ₨{parseFloat(paymentData.amountPaid).toFixed(2)}
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${
                    change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ₨{Math.abs(change).toFixed(2)}
                  </span>
                </div>
                
                {change >= 0 && (
                  <div className="mt-2 text-xs text-green-400">
                    ✓ Payment sufficient
                  </div>
                )}
                {change < 0 && (
                  <div className="mt-2 text-xs text-red-400">
                    ✗ Additional ₨{Math.abs(change).toFixed(2)} needed
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handlePayment}
                disabled={!paymentData.amountPaid || change < 0 || updating}
                loading={updating}
                variant="success"
                className="flex-1"
              >
                <FiCheck />
                Confirm Payment
              </Button>
              <Button
                onClick={() => setShowPaymentModal(false)}
                variant="secondary"
                className="flex-1"
              >
                <FiX />
                Cancel
              </Button>
            </div>

            {paymentData.amountPaid && change >= 0 && (
              <div className="text-center text-xs text-gray-400">
                This will mark the order as completed and free the table
              </div>
            )}
          </div>
        </div>
      </Modal>

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

export default OrderDetails;