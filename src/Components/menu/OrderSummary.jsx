// src/Components/menu/OrderSummary.jsx
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useSettings } from '../../contexts/SettingsContext';
import { api } from '../../services/api';
import Button from '../common/Button';
import PrintComponent from '../common/PrintComponent';
import { 
  ReceiptIcon, 
  DeleteIcon, 
  TableIcon, 
  UserIcon, 
  CheckIcon, 
  PrinterIcon, 
  KitchenIcon,
  TagIcon,
  MapPinIcon,
  DollarIcon,
  CalculatorIcon
} from '../../utils/icons';

const OrderSummary = ({ 
  selectedTable, 
  customerName, 
  waiterName,
  orderType,
  deliveryAddress,
  deliveryCharges = 0,
  onClearOrder, 
  isMobile 
}) => {
  const { state, dispatch } = useApp();
  const { settings, calculateTax, formatCurrency } = useSettings();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState('customer');
  
  // Discount state
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('fixed');
  
  // Simplified payment state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmount, setPaidAmount] = useState(0);

  const calculateTotals = () => {
    const items = state.currentOrder?.items || [];
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    
    const discountAmount = discountType === 'percentage' 
      ? (subtotal * discount) / 100
      : Math.min(discount, subtotal);
    
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const tax = calculateTax(discountedSubtotal);
    const total = discountedSubtotal + tax + (orderType === 'delivery' ? deliveryCharges : 0);
    
    return { 
      subtotal, 
      discount: discountAmount,
      tax, 
      total,
      deliveryCharges: orderType === 'delivery' ? deliveryCharges : 0
    };
  };

  const { subtotal, discount: discountAmount, tax, total, deliveryCharges: finalDeliveryCharges } = calculateTotals();

  // Calculate remaining amount and change
  const remainingAmount = Math.max(0, total - paidAmount);
  const changeAmount = Math.max(0, paidAmount - total);

  const handlePlaceOrder = async () => {
    if (orderType === 'dine-in' && !selectedTable) {
      alert('Please select a table first');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress) {
      alert('Please enter delivery address');
      return;
    }

    if (state.currentOrder.items.length === 0) {
      alert('Please add items to order');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderData = {
        customerName: customerName || `Table ${selectedTable?.number} Customer` || 'Delivery Customer',
        type: orderType,
        tableNumber: selectedTable?.number || null,
        waiterName: waiterName || null,
        deliveryAddress: deliveryAddress || null,
        deliveryCharges: finalDeliveryCharges,
        items: state.currentOrder.items,
        subtotal,
        discount: discountAmount,
        tax,
        total,
        paymentMethod: paymentMethod,
        amountPaid: paidAmount,
        change: changeAmount,
        status: paidAmount >= total ? "completed" : "pending",
        paymentStatus: paidAmount >= total ? "paid" : "pending",
        restaurantName: settings.restaurantName,
        taxRate: settings.taxRate
      };

      const newOrder = await api.createOrder(orderData);
      
      if (paidAmount >= total) {
        await api.processPayment(newOrder._id, {
          paymentMethod: paymentMethod,
          amountPaid: paidAmount
        });
      }

      setPrintType('customer');
      setShowPrintModal(true);
      dispatch({ type: 'CLEAR_CURRENT_ORDER' });
      setDiscount(0);
      setPaymentAmount('');
      setPaidAmount(0);
      
      if (paidAmount >= total) {
        alert(`Order completed! Change: ${formatCurrency(changeAmount)}`);
      } else {
        alert('Order placed successfully! Payment pending.');
      }
    } catch (error) {
      alert('Error placing order: ' + error.message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Simplified payment functions
  const handleAddPayment = () => {
    const amount = parseFloat(paymentAmount) || 0;
    if (amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    
    setPaidAmount(prev => prev + amount);
    setPaymentAmount('');
  };

  const handleFullPayment = () => {
    setPaidAmount(total);
    setPaymentAmount('');
  };

  const handleClearPayment = () => {
    setPaidAmount(0);
    setPaymentAmount('');
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_ORDER', payload: itemId });
    } else {
      dispatch({ type: 'UPDATE_ORDER_ITEM_QUANTITY', payload: { itemId, quantity: newQuantity } });
    }
  };

  const applyDiscount = (amount, type) => {
    setDiscount(amount);
    setDiscountType(type);
  };

  const quickDiscounts = [
    { label: '5%', value: 5, type: 'percentage' },
    { label: '10%', value: 10, type: 'percentage' },
    { label: '15%', value: 15, type: 'percentage' },
    { label: 'RS50', value: 50, type: 'fixed' },
    { label: 'RS100', value: 100, type: 'fixed' },
  ];

  return (
    <div className={`bg-[#111] text-white ${isMobile ? '' : 'h-screen overflow-y-auto'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ReceiptIcon size={20} />
            Current Order
          </h2>
          {state.currentOrder.items.length > 0 && (
            <button 
              onClick={onClearOrder} 
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
            >
              <DeleteIcon size={16} />
              Clear All
            </button>
          )}
        </div>

        {/* Order Type Info */}
        <div className="bg-yellow-500 text-black p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold flex items-center gap-2 capitalize">
                {orderType === 'dine-in' && <TableIcon size={16} />}
                {orderType === 'delivery' && '🚚'}
                {orderType === 'takeaway' && '📦'}
                {orderType} Order
              </p>
              {orderType === 'dine-in' && selectedTable && (
                <p className="text-sm flex items-center gap-2 mt-1">
                  <UserIcon size={14} />
                  Table {selectedTable.number} • {customerName || 'No customer name'}
                  {waiterName && ` • ${waiterName}`}
                </p>
              )}
              {orderType === 'delivery' && (
                <p className="text-sm flex items-center gap-2 mt-1">
                  <MapPinIcon size={14} />
                  {deliveryAddress || 'No address'}
                </p>
              )}
            </div>
            {orderType === 'dine-in' && selectedTable && (
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                {selectedTable.capacity} seats
              </span>
            )}
          </div>
        </div>

        {/* Quick Discount Buttons */}
        {state.currentOrder.items.length > 0 && (
          <div className="bg-[#1a1a1a] p-3 rounded-lg mb-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <TagIcon size={16} />
              Quick Discount
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickDiscounts.map((disc, index) => (
                <button
                  key={index}
                  onClick={() => applyDiscount(disc.value, disc.type)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors"
                >
                  {disc.label}
                </button>
              ))}
              <button
                onClick={() => applyDiscount(0, 'fixed')}
                className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Custom Discount Section */}
        {state.currentOrder.items.length > 0 && (
          <div className="bg-[#1a1a1a] p-3 rounded-lg mb-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CalculatorIcon size={16} />
              Custom Discount
            </h3>
            <div className="flex gap-2 mb-2">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="bg-[#222] rounded-lg px-3 py-2 outline-none border border-gray-600"
              >
                <option value="fixed">Fixed Amount</option>
                <option value="percentage">Percentage</option>
              </select>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder={discountType === 'percentage' ? 'Percentage' : 'Amount'}
                className="flex-1 bg-[#222] rounded-lg px-3 py-2 outline-none border border-gray-600"
                min="0"
                max={discountType === 'percentage' ? 100 : subtotal}
              />
            </div>
            {discount > 0 && (
              <p className="text-green-400 text-sm">
                Discount Applied: {formatCurrency(discountAmount)}
                {discountType === 'percentage' && ` (${discount}%)`}
              </p>
            )}
          </div>
        )}

        {/* Simplified Payment Section */}
        {state.currentOrder.items.length > 0 && (
          <div className="bg-[#1a1a1a] p-4 rounded-lg mb-4 border border-gray-700">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarIcon size={18} />
              Payment
            </h3>
            
            {/* Payment Method Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="grid grid-cols-4 gap-2">
                {['cash', 'card', 'upi', 'online'].map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2 rounded-lg border text-sm transition-all capitalize ${
                      paymentMethod === method 
                        ? 'border-yellow-500 bg-yellow-500 bg-opacity-20' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Add Payment Amount</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="flex-1 bg-[#222] border border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-yellow-500"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
                <Button
                  onClick={handleAddPayment}
                  disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                  className="whitespace-nowrap"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Quick Payment Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[100, 500, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setPaymentAmount(amount.toString())}
                  className="bg-[#222] hover:bg-[#333] p-2 rounded text-sm transition-colors"
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>

            {/* Payment Status */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Bill:</span>
                <span className="text-2xl font-bold text-yellow-400">{formatCurrency(total)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="text-xl font-bold text-green-400">{formatCurrency(paidAmount)}</span>
              </div>

              {paidAmount > 0 && (
                <div className={`p-3 rounded-lg ${
                  paidAmount >= total 
                    ? 'bg-green-900 bg-opacity-20 border border-green-700' 
                    : 'bg-red-900 bg-opacity-20 border border-red-700'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {paidAmount >= total ? 'Change to Return:' : 'Remaining Amount:'}
                    </span>
                    <span className={`text-lg font-bold ${
                      paidAmount >= total ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(Math.abs(total - paidAmount))}
                    </span>
                  </div>
                </div>
              )}

              {/* Payment Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleFullPayment}
                  variant="success"
                  className="flex-1"
                  disabled={paidAmount >= total}
                >
                  Full Payment
                </Button>
                <Button
                  onClick={handleClearPayment}
                  variant="secondary"
                  className="flex-1"
                  disabled={paidAmount === 0}
                >
                  Clear Payment
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {state.currentOrder.items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🍽️</div>
              <p className="text-lg">No items in order</p>
              <p className="text-sm mt-1">Add items from the menu</p>
            </div>
          ) : (
            state.currentOrder.items.map((item) => (
              <div key={item._id} className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-yellow-400 text-sm">
                      {formatCurrency(item.price)} each
                      {item.sizeLabel && ` • ${item.sizeLabel}`}
                    </p>
                  </div>
                  <p className="font-semibold text-yellow-400">{formatCurrency(item.total)}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-[#222] px-3 py-1 rounded">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-2 min-w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => updateQuantity(item._id, 0)}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
                  >
                    <DeleteIcon size={14} />
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Totals */}
        {state.currentOrder.items.length > 0 && (
          <div className="border-t border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({state.currentOrder.items.length} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Discount</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            
            {orderType === 'delivery' && (
              <div className="flex justify-between text-sm">
                <span>Delivery Charges</span>
                <span>{formatCurrency(finalDeliveryCharges)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span>Tax ({settings.taxRate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
              <span>Total Amount</span>
              <span className="text-yellow-400">{formatCurrency(total)}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || state.currentOrder.items.length === 0}
            loading={isPlacingOrder}
            className="w-full"
            variant={paidAmount >= total ? "success" : "primary"}
          >
            <CheckIcon size={16} />
            {paidAmount >= total ? 'Complete Order' : 'Place Order'}
          </Button>

          {state.currentOrder.items.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => {
                  setPrintType('customer');
                  setShowPrintModal(true);
                }}
                variant="secondary"
                className="w-full"
              >
                <PrinterIcon size={16} />
                Print Bill
              </Button>
              <Button
                onClick={() => {
                  setPrintType(orderType === 'delivery' ? 'delivery' : 'kitchen');
                  setShowPrintModal(true);
                }}
                variant="secondary"
                className="w-full"
              >
                {orderType === 'delivery' ? '🚚' : <KitchenIcon size={16} />}
                {orderType === 'delivery' ? 'Delivery' : 'Kitchen'} Print
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Print Modal */}
      {showPrintModal && (
        <PrintComponent
          type={printType}
          orderData={{
            ...state.currentOrder,
            tableNumber: selectedTable?.number,
            customerName: customerName,
            waiterName: waiterName,
            orderType: orderType,
            deliveryAddress: deliveryAddress,
            deliveryCharges: finalDeliveryCharges,
            discount: discountAmount,
            amountPaid: paidAmount,
            change: changeAmount,
            paymentMethod: paymentMethod,
            orderNumber: `TEMP-${Date.now()}`,
            subtotal,
            tax,
            total,
            restaurantName: settings.restaurantName,
            taxRate: settings.taxRate,
            address: settings.address,
            phone: settings.phone
          }}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};

export default OrderSummary;