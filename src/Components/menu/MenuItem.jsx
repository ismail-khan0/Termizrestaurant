import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { icons } from '../../utils/icons';

const MenuItem = ({ item, onAddToOrder, disabled, size = "medium" }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { formatCurrency } = useSettings();

  // Size options with actual prices
  const sizeOptions = [
    { 
      value: 'small', 
      label: 'Small', 
      price: item.sizePrices?.small || Math.round(item.price * 0.7),
      emoji: '🟢',
      color: 'border-green-500'
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      price: item.sizePrices?.medium || item.price,
      emoji: '🟡',
      color: 'border-yellow-500'
    },
    { 
      value: 'large', 
      label: 'Large', 
      price: item.sizePrices?.large || Math.round(item.price * 1.5),
      emoji: '🔴',
      color: 'border-red-500'
    }
  ];

  const getCurrentPrice = () => {
    return sizeOptions.find(s => s.value === selectedSize)?.price || item.price;
  };

  const handleAddClick = () => {
    if (disabled) {
      alert('Please complete order details first');
      return;
    }
    setShowQuantityModal(true);
  };

  const handleConfirmAdd = () => {
    const finalPrice = getCurrentPrice();
    const sizeLabel = sizeOptions.find(s => s.value === selectedSize)?.label;
    
    onAddToOrder({
      ...item,
      price: finalPrice,
      originalPrice: item.price,
      quantity: quantity,
      total: finalPrice * quantity,
      size: selectedSize,
      sizeLabel: sizeLabel,
      specialInstructions: specialInstructions
    }, quantity);
    
    setShowQuantityModal(false);
    setQuantity(1);
    setSelectedSize('medium');
    setSpecialInstructions('');
  };

  const getSpicyLevelColor = (level) => {
    switch (level) {
      case 'mild': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const sizeClasses = {
    small: "p-3 text-sm",
    medium: "p-4",
    large: "p-5 text-lg"
  };

  // Check if item has multiple sizes
  const hasMultipleSizes = item.supportsSizes && item.sizePrices && 
    (item.sizePrices.small > 0 || item.sizePrices.large > 0);

  return (
    <>
      <div className={`bg-[#1a1a1a] rounded-xl hover:bg-[#222] transition-colors border border-gray-800 ${sizeClasses[size]}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold mb-1 text-lg">{item.title}</h3>
            
            {/* Price Display - Show size prices if available */}
            {hasMultipleSizes ? (
              <div className="mb-2">
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((sizeOption) => {
                    const price = sizeOption.price;
                    if (price > 0) {
                      return (
                        <div key={sizeOption.value} className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">{sizeOption.emoji}</span>
                          <span className="text-yellow-400 font-bold">
                            {formatCurrency(price)}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-1">Select size when ordering</p>
              </div>
            ) : (
              <p className="text-yellow-400 text-xl font-bold mb-2">
                {formatCurrency(item.price)}
              </p>
            )}
            
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
          </div>
          {item.image && (
            <div className="w-16 h-16 bg-gray-700 rounded-lg ml-3 flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <icons.clock size={14} />
            {item.preparationTime}min
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${getSpicyLevelColor(item.spicyLevel)}`}>
            {item.spicyLevel}
          </span>
        </div>

        <Button
          onClick={handleAddClick}
          disabled={disabled}
          className="w-full"
          size={size}
        >
          {disabled ? 'Complete Details' : 'Add to Order'}
        </Button>
      </div>

      <Modal 
        isOpen={showQuantityModal} 
        onClose={() => setShowQuantityModal(false)}
        title={item.title}
        size="md"
      >
        <div className="p-6">
          <p className="text-gray-400 text-sm mb-4">{item.description}</p>
          
          {/* Size Selection - Show only if item has multiple sizes */}
          {hasMultipleSizes && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Size</label>
              <div className="grid grid-cols-3 gap-3">
                {sizeOptions.map((sizeOption) => (
                  <button
                    key={sizeOption.value}
                    onClick={() => setSelectedSize(sizeOption.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      selectedSize === sizeOption.value 
                        ? `${sizeOption.color} bg-opacity-20` 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{sizeOption.emoji}</div>
                    <div className="font-semibold text-sm capitalize">{sizeOption.label}</div>
                    <div className="text-yellow-400 font-bold text-lg mt-1">
                      {formatCurrency(sizeOption.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 bg-gray-700 rounded-lg text-xl hover:bg-gray-600 transition-colors"
              >
                -
              </button>
              <span className="text-2xl font-bold mx-4 min-w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 bg-gray-700 rounded-lg text-xl hover:bg-gray-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Special Instructions</label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests, allergies, or cooking preferences..."
              className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
              rows="3"
            />
          </div>

          {/* Total Price */}
          <div className="bg-[#1a1a1a] p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {quantity}x {item.title}
                  {hasMultipleSizes && (
                    <span className="text-gray-400 ml-2">
                      ({sizeOptions.find(s => s.value === selectedSize)?.label})
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-400">
                  {formatCurrency(getCurrentPrice())} each
                </p>
              </div>
              <p className="text-2xl font-bold text-yellow-400">
                {formatCurrency(getCurrentPrice() * quantity)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowQuantityModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAdd}
              className="flex-1"
            >
              Add to Order
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MenuItem;