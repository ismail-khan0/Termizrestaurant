// src/Components/admin/MenuItemForm.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { icons } from '../../utils/icons';

const MenuItemForm = ({ item, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    preparationTime: 15,
    ingredients: '',
    spicyLevel: 'mild',
    isAvailable: true,
    // Direct size prices - all sizes enabled by default
    supportsSizes: true,
    sizePrices: {
      small: '',
      medium: '', 
      large: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const spicyLevels = [
    { value: 'mild', label: 'Mild', color: 'text-green-500' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
    { value: 'high', label: 'High', color: 'text-red-500' }
  ];

  const sizeLabels = {
    small: { label: 'Small', emoji: '🟢', color: 'border-green-500' },
    medium: { label: 'Medium', emoji: '🟡', color: 'border-yellow-500' },
    large: { label: 'Large', emoji: '🔴', color: 'border-red-500' }
  };

  useEffect(() => {
    if (item) {
      const categoryId = item.category?._id || item.category || '';
      
      // Convert existing data to direct prices
      const basePrice = item.price || 0;
      const existingSizePrices = item.sizePrices || {};
      
      setFormData({
        title: item.title || '',
        category: categoryId,
        description: item.description || '',
        preparationTime: item.preparationTime || 15,
        ingredients: Array.isArray(item.ingredients) 
          ? item.ingredients.join(', ') 
          : (item.ingredients || ''),
        spicyLevel: item.spicyLevel || 'mild',
        isAvailable: item.isAvailable !== false,
        supportsSizes: item.supportsSizes !== false,
        sizePrices: {
          small: existingSizePrices.small ? Math.round(basePrice * existingSizePrices.small).toString() : '',
          medium: basePrice.toString(),
          large: existingSizePrices.large ? Math.round(basePrice * existingSizePrices.large).toString() : ''
        }
      });
    }
  }, [item, categories]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Item name is required');
      return false;
    }

    if (!formData.category) {
      setError('Category is required');
      return false;
    }

    if (!formData.preparationTime || formData.preparationTime < 1) {
      setError('Preparation time must be at least 1 minute');
      return false;
    }

    // Validate that at least one size has price
    const hasValidPrice = Object.values(formData.sizePrices).some(
      price => price && parseFloat(price) > 0
    );
    
    if (!hasValidPrice) {
      setError('At least one size must have a price');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use medium price as base price for calculations
      const mediumPrice = parseFloat(formData.sizePrices.medium) || 0;
      

const submitData = {
  title: formData.title.trim(),
  price: mediumPrice, // Use medium as base price
  category: formData.category,
  description: formData.description.trim(),
  preparationTime: parseInt(formData.preparationTime),
  ingredients: formData.ingredients
    .split(',')
    .map(i => i.trim())
    .filter(i => i),
  spicyLevel: formData.spicyLevel,
  isAvailable: formData.isAvailable,
  supportsSizes: formData.supportsSizes,
  // Store actual prices for each size
  sizePrices: {
    small: formData.sizePrices.small ? parseFloat(formData.sizePrices.small) : 0,
    medium: mediumPrice,
    large: formData.sizePrices.large ? parseFloat(formData.sizePrices.large) : 0
  }
};

      console.log('Submitting menu item:', submitData);

      if (item) {
        await api.updateMenuItem(item._id, submitData);
      } else {
        await api.createMenuItem(submitData);
      }

      console.log('Menu item saved successfully');
      
      if (onSave) {
        onSave();
      }
      
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error('Menu item save error:', error);
      setError(`Error saving menu item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleSizePriceChange = (size, value) => {
    setFormData(prev => ({
      ...prev,
      sizePrices: {
        ...prev.sizePrices,
        [size]: value
      }
    }));
  };

  const getCategoryName = () => {
    const category = categories.find(c => c._id === formData.category);
    return category ? category.name : 'Not selected';
  };

  // Auto-fill other sizes when medium price is entered
  const autoFillSizes = (baseValue) => {
    if (!baseValue) return;
    
    const mediumPrice = parseFloat(baseValue);
    if (isNaN(mediumPrice)) return;

    const newSizePrices = { ...formData.sizePrices };
    
    if (!newSizePrices.small) newSizePrices.small = Math.round(mediumPrice * 0.7).toString();
    if (!newSizePrices.large) newSizePrices.large = Math.round(mediumPrice * 1.5).toString();
    
    setFormData(prev => ({
      ...prev,
      sizePrices: newSizePrices
    }));
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose}
      title={item ? 'Edit Menu Item' : 'Add Menu Item'}
      size="lg"
    >
      <div className="p-6">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Item Name *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
              placeholder="e.g., Chicken Biryani, Paneer Butter Masala"
              disabled={loading}
            />
          </div>

          {/* Size Prices - Always shown */}
          <div className="bg-[#1a1a1a] p-5 rounded-lg border border-gray-700">
            <label className="block text-sm font-medium mb-4 text-yellow-400">
              🍽️ Set Prices for All Sizes *
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {['small', 'medium', 'large'].map((size) => (
                <div 
                  key={size} 
                  className={`bg-[#222] p-4 rounded-lg border-2 ${sizeLabels[size].color} transition-all hover:shadow-lg hover:shadow-${sizeLabels[size].color.replace('border-', '')}/20`}
                >
                  <div className="text-center mb-3">
                    <div className="text-3xl mb-2">{sizeLabels[size].emoji}</div>
                    <div className="font-semibold text-lg capitalize">{sizeLabels[size].label}</div>
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">RS</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={formData.sizePrices[size]}
                      onChange={(e) => {
                        handleSizePriceChange(size, e.target.value);
                        if (size === 'medium') {
                          autoFillSizes(e.target.value);
                        }
                      }}
                      className="w-full bg-[#333] border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-center text-lg font-semibold outline-none focus:border-yellow-500"
                      placeholder="0"
                      disabled={loading}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Enter price in rupees
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-3">
              <p className="text-sm text-blue-300 text-center">
                💡 <strong>Pro Tip:</strong> Enter the Medium price first, and we'll automatically suggest prices for Small and Large sizes!
              </p>
            </div>
          </div>

          {/* Category & Preparation Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                disabled={loading || categories.length === 0}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-red-400 text-xs mt-1">No categories available. Please create a category first.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preparation Time (minutes) *</label>
              <input
                type="number"
                required
                min="1"
                max="120"
                value={formData.preparationTime}
                onChange={(e) => handleInputChange('preparationTime', e.target.value)}
                className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
              rows="3"
              placeholder="Describe the dish, ingredients, taste, special features..."
              disabled={loading}
            />
          </div>

          {/* Ingredients & Spicy Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ingredients</label>
              <input
                type="text"
                value={formData.ingredients}
                onChange={(e) => handleInputChange('ingredients', e.target.value)}
                className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                placeholder="Chicken, Rice, Spices, Herbs, Vegetables..."
                disabled={loading}
              />
              <p className="text-gray-400 text-xs mt-1">Separate ingredients with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Spicy Level</label>
              <select
                value={formData.spicyLevel}
                onChange={(e) => handleInputChange('spicyLevel', e.target.value)}
                className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                disabled={loading}
              >
                {spicyLevels.map(level => (
                  <option key={level.value} value={level.value} className={level.color}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center p-4 bg-[#222] rounded-lg border border-gray-700">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
              className="w-5 h-5 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
              disabled={loading}
            />
            <label htmlFor="isAvailable" className="ml-3 text-sm font-medium flex items-center gap-2">
              <icons.check className={formData.isAvailable ? 'text-green-500' : 'text-gray-500'} />
              Available for ordering
            </label>
          </div>

          {/* Form Preview */}
          <div className="p-4 bg-[#222] rounded-lg border border-gray-700">
            <h3 className="font-semibold mb-4 text-yellow-400 flex items-center gap-2 text-lg">
              <icons.eye />
              Customer View Preview
            </h3>
            
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-yellow-500 border-opacity-30">
              <h4 className="font-semibold text-xl mb-4 border-b border-gray-700 pb-2">
                {formData.title || 'Item Name'}
              </h4>
              
              {/* Size Selection Preview */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Select Size:</p>
                <div className="grid grid-cols-3 gap-3">
                  {['small', 'medium', 'large'].map(size => {
                    const price = formData.sizePrices[size];
                    const isValidPrice = price && parseFloat(price) > 0;
                    
                    return (
                      <div 
                        key={size}
                        className={`text-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isValidPrice 
                            ? `${sizeLabels[size].color} bg-${sizeLabels[size].color.replace('border-', '')} bg-opacity-10 hover:bg-opacity-20` 
                            : 'border-gray-600 bg-gray-800 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-2xl mb-1">{sizeLabels[size].emoji}</div>
                        <div className="text-sm text-gray-400 capitalize mb-1">{sizeLabels[size].label}</div>
                        <div className="text-yellow-400 font-bold text-lg">
                          {isValidPrice ? `RS${price}` : 'Not available'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="text-sm text-gray-400 space-y-2 border-t border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span><strong>Category:</strong></span>
                  <span>{getCategoryName()}</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Prep Time:</strong></span>
                  <span>{formData.preparationTime} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Spice Level:</strong></span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    formData.spicyLevel === 'high' ? 'bg-red-500' :
                    formData.spicyLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                    {formData.spicyLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Status:</strong></span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    formData.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {formData.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              variant="secondary"
              className="flex-1"
            >
              <icons.close />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || categories.length === 0}
              loading={loading}
              className="flex-1"
            >
              <icons.check />
              {item ? 'Update Item' : 'Create Item'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default MenuItemForm;