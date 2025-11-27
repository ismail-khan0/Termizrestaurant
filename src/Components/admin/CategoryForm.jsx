// src/Components/admin/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { icons } from '../../utils/icons';

const CategoryForm = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: 'bg-red-500',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Available color options for categories
  const colorOptions = [
    { value: 'bg-red-500', label: 'Red', color: 'bg-red-500' },
    { value: 'bg-blue-500', label: 'Blue', color: 'bg-blue-500' },
    { value: 'bg-green-500', label: 'Green', color: 'bg-green-500' },
    { value: 'bg-yellow-500', label: 'Yellow', color: 'bg-yellow-500' },
    { value: 'bg-purple-500', label: 'Purple', color: 'bg-purple-500' },
    { value: 'bg-pink-500', label: 'Pink', color: 'bg-pink-500' },
    { value: 'bg-indigo-500', label: 'Indigo', color: 'bg-indigo-500' },
    { value: 'bg-orange-500', label: 'Orange', color: 'bg-orange-500' },
    { value: 'bg-teal-500', label: 'Teal', color: 'bg-teal-500' },
    { value: 'bg-cyan-500', label: 'Cyan', color: 'bg-cyan-500' },
    { value: 'bg-lime-500', label: 'Lime', color: 'bg-lime-500' },
    { value: 'bg-amber-500', label: 'Amber', color: 'bg-amber-500' },
    { value: 'bg-red-600', label: 'Dark Red', color: 'bg-red-600' },
    { value: 'bg-blue-600', label: 'Dark Blue', color: 'bg-blue-600' },
    { value: 'bg-green-600', label: 'Dark Green', color: 'bg-green-600' },
    { value: 'bg-purple-600', label: 'Dark Purple', color: 'bg-purple-600' },
    { value: 'bg-pink-600', label: 'Dark Pink', color: 'bg-pink-600' },
    { value: 'bg-blue-900', label: 'Navy Blue', color: 'bg-blue-900' },
    { value: 'bg-green-900', label: 'Forest Green', color: 'bg-green-900' },
    { value: 'bg-purple-900', label: 'Deep Purple', color: 'bg-purple-900' }
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        color: category.color || 'bg-red-500',
        description: category.description || ''
      });
    } else {
      // Reset form for new category
      setFormData({
        name: '',
        color: 'bg-red-500',
        description: ''
      });
    }
    setError(''); // Clear any previous errors
  }, [category]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return false;
    }
    
    if (formData.name.trim().length < 2) {
      setError('Category name must be at least 2 characters long');
      return false;
    }
    
    if (formData.name.trim().length > 30) {
      setError('Category name must be less than 30 characters');
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

    try {
      const submitData = {
        name: formData.name.trim(),
        color: formData.color,
        description: formData.description.trim()
      };

      console.log('Submitting category:', submitData);

      if (category) {
        await api.updateCategory(category._id, submitData);
      } else {
        await api.createCategory(submitData);
      }

      console.log('Category saved successfully');
      
      // Call onSave to refresh parent component
      if (onSave) {
        onSave();
      }
      
      // Close the form
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error('Category save error:', error);
      setError(`Error saving category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const getSelectedColorLabel = () => {
    const selected = colorOptions.find(c => c.value === formData.color);
    return selected ? selected.label : 'Red';
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add New Category'}
      size="md"
    >
      <div className="p-6">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Starters, Main Course, Desserts"
              className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
              disabled={loading}
              maxLength={30}
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.name.length}/30 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of this category..."
              className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
              rows="3"
              disabled={loading}
              maxLength={200}
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.description.length}/200 characters
            </p>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Color Theme *
            </label>
            <div className="grid grid-cols-5 gap-3 max-h-48 overflow-y-auto p-4 bg-[#222] border border-gray-600 rounded-lg">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => handleInputChange('color', colorOption.value)}
                  disabled={loading}
                  className={`w-10 h-10 rounded-lg ${colorOption.color} border-2 transition-all flex items-center justify-center ${
                    formData.color === colorOption.value 
                      ? 'border-white ring-2 ring-yellow-500 scale-110' 
                      : 'border-transparent hover:scale-105 hover:border-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={colorOption.label}
                >
                  {formData.color === colorOption.value && (
                    <icons.check size={16} className="text-white" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-3 text-center">
              Selected: <span className="text-yellow-400 font-semibold">{getSelectedColorLabel()}</span>
            </p>
          </div>

          {/* Live Preview */}
          <div className="p-4 bg-[#222] border border-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <icons.eye />
              Live Preview
            </h3>
            <div className={`${formData.color} text-white p-4 rounded-lg transition-colors duration-300`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-lg">
                    {formData.name || 'Your Category Name'}
                  </p>
                  {formData.description && (
                    <p className="text-sm opacity-90 mt-1">
                      {formData.description}
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-lg bg-white bg-opacity-20 flex items-center justify-center font-bold text-lg">
                  {formData.name ? formData.name[0].toUpperCase() : 'C'}
                </div>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">
                  Sample Item 1
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">
                  Sample Item 2
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">
                  +{formData.name ? '3 more' : 'more'}
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
              <icons.info size={16} />
              Tips for Categories
            </h4>
            <ul className="text-xs text-blue-300 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                Choose a color that represents your category type
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                Keep names short and descriptive (e.g., "Main Course", "Drinks")
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                Use descriptions to help staff identify categories quickly
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                You cannot delete categories that contain menu items
              </li>
            </ul>
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
              disabled={loading}
              loading={loading}
              className="flex-1"
            >
              <icons.check />
              {category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CategoryForm;