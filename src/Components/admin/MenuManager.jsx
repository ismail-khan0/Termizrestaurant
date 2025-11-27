// src/components/admin/MenuManager.jsx
import React, { useState } from 'react';
import { menuAPI } from '../../services/api';

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadData = async () => {
    try {
      const [itemsData, categoriesData] = await Promise.all([
        menuAPI.getMenuItems(),
        menuAPI.getCategories()
      ]);
      setMenuItems(itemsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await menuAPI.updateMenuItem(editingItem._id, formData);
      } else {
        await menuAPI.createMenuItem(formData);
      }
      await loadData();
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await menuAPI.deleteMenuItem(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add New Item
        </button>
      </div>

      {/* Menu items table */}
      <div className="bg-[#1a1a1a] rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item._id} className="border-b border-gray-800">
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.category?.name}</td>
                <td className="p-3">rs{item.price}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                    className="bg-blue-600 px-3 py-1 rounded mr-2 hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <MenuForm
          item={editingItem}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default MenuManager;