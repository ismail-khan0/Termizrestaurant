// src/Components/common/PrintComponent.jsx
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSettings } from '../../contexts/SettingsContext';
import Modal from './Modal';
import { icons } from '../../utils/icons';

const PrintComponent = ({ type, orderData, onClose }) => {
  const contentRef = useRef();
  const { settings, formatCurrency } = useSettings();

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: type === 'customer' ? `Bill-${orderData.orderNumber}` : 
                   type === 'delivery' ? `Delivery-Order-${orderData.orderNumber}` : 
                   `Kitchen-Order-${orderData.orderNumber}`,
    onAfterPrint: onClose
  });

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate payment details
  const calculatePaymentDetails = () => {
    const total = orderData.total || 0;
    const amountPaid = orderData.amountPaid || 0;
    const remainingAmount = Math.max(0, total - amountPaid);
    const changeAmount = Math.max(0, amountPaid - total);
    const isFullyPaid = amountPaid >= total;
    
    return {
      total,
      amountPaid,
      remainingAmount,
      changeAmount,
      isFullyPaid
    };
  };

  const { total, amountPaid, remainingAmount, changeAmount, isFullyPaid } = calculatePaymentDetails();

  // Customer Bill
  if (type === 'customer') {
    return (
      <Modal isOpen={true} onClose={onClose} title="Customer Bill" size="md">
        <div className="p-6">
          <div ref={contentRef} className="bg-white text-black p-6 rounded-lg max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-4 border-b pb-4">
              <h1 className="text-2xl font-bold">{settings.restaurantName || 'TERMIZ RESTAURANT'}</h1>
              <p className="text-gray-600">Fine Dining Experience</p>
              <p className="text-sm text-gray-500">{settings.address || 'Karachi, Pakistan'}</p>
              <p className="text-sm text-gray-500">Phone: {settings.phone || '+92 300 1234567'}</p>
            </div>

            {/* Order Info */}
            <div className="mb-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Order #:</span>
                <span>{orderData.orderNumber}</span>
              </div>
              {orderData.tableNumber && (
                <div className="flex justify-between">
                  <span>Table:</span>
                  <span>Table {orderData.tableNumber}</span>
                </div>
              )}
              {orderData.waiterName && (
                <div className="flex justify-between">
                  <span>Waiter:</span>
                  <span>{orderData.waiterName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{orderData.customerName}</span>
              </div>
              {orderData.deliveryAddress && (
                <div className="flex justify-between">
                  <span>Delivery Address:</span>
                  <span className="text-right max-w-xs">{orderData.deliveryAddress}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Order Type:</span>
                <span className="capitalize">{orderData.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{getCurrentTime()}</span>
              </div>
            </div>

            {/* Items */}
            <div className="border-y py-4 mb-4">
              <div className="grid grid-cols-12 gap-2 text-sm font-semibold mb-2">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {orderData.items?.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 text-sm mb-1">
                  <div className="col-span-6">
                    {item.title}
                    {item.sizeLabel && ` (${item.sizeLabel})`}
                  </div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-right">{formatCurrency(item.price)}</div>
                  <div className="col-span-2 text-right">{formatCurrency(item.total)}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({orderData.items?.length || 0} items):</span>
                <span>{formatCurrency(orderData.subtotal)}</span>
              </div>
              
              {orderData.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(orderData.discount)}</span>
                </div>
              )}
              
              {orderData.deliveryCharges > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span>{formatCurrency(orderData.deliveryCharges)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Tax ({orderData.taxRate || settings.taxRate}%):</span>
                <span>{formatCurrency(orderData.tax)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Amount:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment Section */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Payment Method:</span>
                <span className="capitalize">{orderData.paymentMethod || 'cash'}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Amount Paid:</span>
                <span className="text-green-600 font-semibold">{formatCurrency(amountPaid)}</span>
              </div>
              
              {!isFullyPaid && (
                <div className="flex justify-between text-sm bg-red-50 p-2 rounded">
                  <span className="text-red-600 font-semibold">Remaining Amount:</span>
                  <span className="text-red-600 font-semibold">{formatCurrency(remainingAmount)}</span>
                </div>
              )}
              
              {isFullyPaid && changeAmount > 0 && (
                <div className="flex justify-between text-sm bg-green-50 p-2 rounded">
                  <span className="text-green-600 font-semibold">Change to Return:</span>
                  <span className="text-green-600 font-semibold">{formatCurrency(changeAmount)}</span>
                </div>
              )}
              
              {isFullyPaid && changeAmount === 0 && (
                <div className="text-center bg-green-50 p-2 rounded">
                  <span className="text-green-600 font-semibold">✓ Payment Completed - Exact Amount</span>
                </div>
              )}
              
              <div className={`text-center p-2 rounded font-semibold ${
                isFullyPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {isFullyPaid ? 'PAYMENT COMPLETED' : 'PAYMENT PENDING'}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">Thank you for dining with us!</p>
              <p className="text-xs text-gray-500">Visit again soon</p>
              <p className="text-xs text-gray-400 mt-2">GSTIN: {settings.gstin || 'PK-123456789'}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handlePrint}
              className="flex-1 bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              <icons.printer />
              Print Bill
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <icons.close />
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // Delivery Order
  if (type === 'delivery') {
    return (
      <Modal isOpen={true} onClose={onClose} title="Delivery Order" size="md">
        <div className="p-6">
          <div ref={contentRef} className="bg-white text-black p-6 rounded-lg border-2 border-green-500 max-w-md mx-auto">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-green-600">DELIVERY ORDER</h1>
              <p className="text-lg font-semibold">Order #{orderData.orderNumber}</p>
              <p className="text-sm">{getCurrentTime()}</p>
            </div>

            {/* Customer & Delivery Info */}
            <div className="mb-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Customer:</span>
                <span>{orderData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{orderData.phone || 'Not provided'}</span>
              </div>
              <div className="border-t pt-2">
                <p className="font-semibold text-green-700">Delivery Address:</p>
                <p className="text-sm">{orderData.deliveryAddress}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(orderData.subtotal)}</span>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(orderData.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span>{formatCurrency(orderData.deliveryCharges)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatCurrency(orderData.tax)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Payment Status</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className={amountPaid > 0 ? 'text-green-600 font-semibold' : ''}>
                    {formatCurrency(amountPaid)}
                  </span>
                </div>
                {!isFullyPaid && (
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Remaining:</span>
                    <span>{formatCurrency(remainingAmount)}</span>
                  </div>
                )}
                {isFullyPaid && changeAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Change Due:</span>
                    <span>{formatCurrency(changeAmount)}</span>
                  </div>
                )}
                <div className={`text-center p-1 rounded text-xs font-semibold ${
                  isFullyPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {isFullyPaid ? 'PAID' : 'PENDING PAYMENT'}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-4">
              <h3 className="font-semibold border-b pb-1">Order Items</h3>
              {orderData.items?.map((item, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">{item.quantity}x {item.title}</p>
                      {item.sizeLabel && (
                        <p className="text-sm text-gray-600">Size: {item.sizeLabel}</p>
                      )}
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      <p>{formatCurrency(item.total)}</p>
                      <p className="text-gray-500">Prep: {item.preparationTime || 10}min</p>
                      {item.spicyLevel && item.spicyLevel !== 'mild' && (
                        <p className={`text-xs font-semibold ${
                          item.spicyLevel === 'high' ? 'text-red-600' : 
                          item.spicyLevel === 'medium' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {item.spicyLevel.toUpperCase()}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.notes && (
                    <p className="text-sm text-red-600 font-semibold mt-1">Note: {item.notes}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-6 pt-4 border-t">
              <p className="text-sm font-semibold text-green-600">*** DELIVERY COPY ***</p>
              <p className="text-xs text-gray-500 mt-1">{settings.restaurantName}</p>
              <p className="text-xs text-gray-400">Phone: {settings.phone}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handlePrint}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <icons.printer />
              Print Delivery Copy
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <icons.close />
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // Kitchen Print
  return (
    <Modal isOpen={true} onClose={onClose} title="Kitchen Order" size="md">
      <div className="p-6">
        <div ref={contentRef} className="bg-white text-black p-6 rounded-lg border-2 border-red-500 max-w-md mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-red-600">KITCHEN ORDER</h1>
            <p className="text-lg font-semibold">Order #{orderData.orderNumber}</p>
            <p className="text-sm">
              {orderData.tableNumber ? `Table ${orderData.tableNumber}` : orderData.orderType.toUpperCase()}
              {orderData.customerName && ` • ${orderData.customerName}`}
            </p>
            <p className="text-xs text-gray-500">{getCurrentTime()}</p>
          </div>

          {/* Order Info */}
          <div className="mb-4 space-y-1 text-sm">
            {orderData.tableNumber && (
              <div className="flex justify-between">
                <span>Table:</span>
                <span>Table {orderData.tableNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Order Type:</span>
              <span className="capitalize">{orderData.orderType}</span>
            </div>
            {orderData.waiterName && (
              <div className="flex justify-between">
                <span>Waiter:</span>
                <span>{orderData.waiterName}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold">
              <span>Total Items:</span>
              <span>{orderData.items?.length || 0}</span>
            </div>
          </div>

          {/* Payment Status for Kitchen */}
          <div className="mb-4 p-2 bg-gray-100 rounded-lg">
            <div className="flex justify-between text-sm font-semibold">
              <span>Total Amount:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className={`text-center text-xs font-semibold mt-1 ${
              isFullyPaid ? 'text-green-600' : 'text-red-600'
            }`}>
              {isFullyPaid ? '✓ PAID' : '⚠ PENDING PAYMENT'}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold border-b pb-1 text-center">ITEMS TO PREPARE</h3>
            {orderData.items?.map((item, index) => (
              <div key={index} className="border-b pb-2">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{item.quantity}x {item.title}</p>
                    {item.sizeLabel && (
                      <p className="text-sm text-gray-600">Size: {item.sizeLabel}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(item.total)}</p>
                    <p className="text-xs text-gray-500">Each: {formatCurrency(item.price)}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold">Prep Time:</span> {item.preparationTime || 10} min
                  </div>
                  {item.spicyLevel && item.spicyLevel !== 'mild' && (
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.spicyLevel === 'high' ? 'bg-red-100 text-red-700' : 
                      item.spicyLevel === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.spicyLevel.toUpperCase()} SPICE
                    </span>
                  )}
                </div>
                
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
                
                {item.notes && (
                  <p className="text-sm text-red-600 font-semibold mt-1 bg-red-50 p-1 rounded">
                    🚩 SPECIAL NOTE: {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-6 pt-4 border-t">
            <p className="text-sm font-semibold text-red-600">*** KITCHEN COPY ***</p>
            <p className="text-xs text-gray-500 mt-1">{settings.restaurantName}</p>
            <p className="text-xs text-gray-400">Order Time: {getCurrentTime()}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <icons.printer />
            Print Kitchen Copy
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <icons.close />
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PrintComponent;