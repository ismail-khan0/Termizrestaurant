// src/Pages/MenuManagement.jsx
import React, { useState, useEffect } from 'react';
import Header from '../Components/common/Header';
import MenuItemForm from '../Components/admin/MenuItemForm';
import CategoryForm from '../Components/admin/CategoryForm';
import Pagination from '../Components/common/Pagination';
import { useMenu } from '../hooks/useMenu';
import { usePagination } from '../hooks/usePagination';
import { api } from '../services/api';
import { icons } from '../utils/icons';

// Safe icon component to handle undefined icons
const SafeIcon = ({ icon: IconComponent, ...props }) => {
  if (!IconComponent || typeof IconComponent === 'undefined') {
    return <span {...props}>□</span>; // Fallback character
  }
  return <IconComponent {...props} />;
};

const MenuManagement = () => {
  const { items, categories, loading, error, refetch } = useMenu();
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('items');

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedMenuItems,
    goToPage
  } = usePagination(items, 9);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSave = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;

    setActionLoading(true);
    try {
      await api.deleteMenuItem(itemId);
      showSuccess('Menu item deleted successfully!');
      await refetch();
    } catch (error) {
      alert('Error deleting menu item: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This will affect all items in this category.')) return;

    setActionLoading(true);
    try {
      await api.deleteCategory(categoryId);
      showSuccess('Category deleted successfully!');
      await refetch();
    } catch (error) {
      alert('Error deleting category: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#111] text-white p-4 pb-32">
        <Header title="Menu Management" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4">Loading menu data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#111] text-white p-4 pb-32">
      <Header title="Menu Management" />

      <div className="max-w-7xl mx-auto">
        {successMessage && (
          <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <SafeIcon icon={icons.check} />
            {successMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'items' 
                ? 'border-yellow-500 text-yellow-500' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <SafeIcon icon={icons.restaurant} className="inline mr-2" size={18} />
            Menu Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'categories' 
                ? 'border-yellow-500 text-yellow-500' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <SafeIcon icon={icons.category} className="inline mr-2" size={18} />
            Categories ({categories.length})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          {activeTab === 'items' ? (
            <button
              onClick={() => { setEditingItem(null); setShowItemForm(true); }}
              disabled={actionLoading || categories.length === 0}
              className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <SafeIcon icon={icons.plus} />
              Add Menu Item
            </button>
          ) : (
            <button
              onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }}
              disabled={actionLoading}
              className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <SafeIcon icon={icons.plus} />
              Add Category
            </button>
          )}
          
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={refetch}
              className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <SafeIcon icon={icons.refresh} />
              Refresh
            </button>
          </div>
        </div>

        {/* Categories Tab Content */}
        {activeTab === 'categories' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Categories ({categories.length})</h2>
            
            {categories.length === 0 ? (
              <div className="text-center py-12 bg-[#1a1a1a] rounded-xl">
                <div className="text-6xl mx-auto mb-4 text-gray-400">📁</div>
                <p className="text-gray-400 text-lg mb-2">No categories yet</p>
                <p className="text-gray-500 text-sm">Create your first category to start adding menu items</p>
                <button
                  onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }}
                  className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4 flex items-center gap-2 mx-auto"
                >
                  <SafeIcon icon={icons.plus} />
                  Create First Category
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map(category => {
                  const categoryItems = items.filter(item => item.category?._id === category._id);
                  return (
                    <div key={category._id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg`}>
                          {category.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <p className="text-gray-400 text-sm">
                            {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      
                      {category.description && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingCategory(category); setShowCategoryForm(true); }}
                          className="flex-1 bg-yellow-600 px-3 py-2 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center gap-2 justify-center"
                        >
                          <SafeIcon icon={icons.edit} size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          disabled={categoryItems.length > 0}
                          className="flex-1 bg-red-600 px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          title={categoryItems.length > 0 ? 'Cannot delete category with items' : ''}
                        >
                          <SafeIcon icon={icons.delete} size={14} />
                          Delete
                        </button>
                      </div>
                      
                      {categoryItems.length > 0 && (
                        <p className="text-xs text-red-400 mt-2 text-center">
                          Contains {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Menu Items Tab Content */}
        {activeTab === 'items' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Menu Items ({items.length})</h2>
              <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
            </div>
            
            {items.length === 0 ? (
              <div className="text-center py-12 bg-[#1a1a1a] rounded-xl">
                <div className="text-6xl mx-auto mb-4 text-gray-400">🍽️</div>
                <p className="text-gray-400 text-lg mb-2">No menu items yet</p>
                <p className="text-gray-500 text-sm mb-4">Start by creating categories, then add your menu items</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }}
                    className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <SafeIcon icon={icons.plus} />
                    Create Category
                  </button>
                  {categories.length > 0 && (
                    <button
                      onClick={() => { setEditingItem(null); setShowItemForm(true); }}
                      className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <SafeIcon icon={icons.plus} />
                      Add Menu Item
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {paginatedMenuItems.map(item => {
                    const category = categories.find(cat => cat._id === item.category) || {};
                    return (
                      <div key={item._id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                            
                            {/* Size Prices Display */}
                            {item.supportsSizes && item.sizePrices ? (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {item.sizePrices.small > 0 && (
                                  <span className="bg-green-600 px-2 py-1 rounded text-xs flex items-center gap-1">
                                    <span>🟢</span>
                                    <span>RS{item.sizePrices.small}</span>
                                  </span>
                                )}
                                {item.sizePrices.medium > 0 && (
                                  <span className="bg-yellow-600 px-2 py-1 rounded text-xs flex items-center gap-1">
                                    <span>🟡</span>
                                    <span>RS{item.sizePrices.medium}</span>
                                  </span>
                                )}
                                {item.sizePrices.large > 0 && (
                                  <span className="bg-red-600 px-2 py-1 rounded text-xs flex items-center gap-1">
                                    <span>🔴</span>
                                    <span>RS{item.sizePrices.large}</span>
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-yellow-500 text-lg font-bold mb-2">RS{item.price}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.isAvailable ? 'bg-green-600' : 'bg-red-600'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                        
                        <div className="flex justify-between text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <SafeIcon icon={icons.clock} size={14} />
                              {item.preparationTime}min
                            </span>
                            {category.name && (
                              <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                                {category.name}
                              </span>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded ${
                            item.spicyLevel === 'high' ? 'bg-red-600' :
                            item.spicyLevel === 'medium' ? 'bg-orange-600' : 'bg-green-600'
                          }`}>
                            {item.spicyLevel}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingItem(item); setShowItemForm(true); }}
                            className="flex-1 bg-yellow-600 px-3 py-2 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center gap-2 justify-center"
                          >
                            <SafeIcon icon={icons.edit} size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="flex-1 bg-red-600 px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-2 justify-center"
                          >
                            <SafeIcon icon={icons.delete} size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showItemForm && (
        <MenuItemForm
          item={editingItem}
          categories={categories}
          onClose={() => { setShowItemForm(false); setEditingItem(null); }}
          onSave={handleSave}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onClose={() => { setShowCategoryForm(false); setEditingCategory(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default MenuManagement;