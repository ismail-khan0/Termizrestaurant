import React, { useState, useEffect } from 'react';
import Header from '../Components/common/Header';
import Button from '../Components/common/Button';
import { useSettings } from '../contexts/SettingsContext';
import { icons } from '../utils/icons';

const Settings = () => {
  const { settings, updateSettings, loading: contextLoading } = useSettings();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        ...formData,
        taxRate: parseFloat(formData.taxRate)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (contextLoading) {
    return (
      <div className="min-h-screen w-full bg-[#111] text-white p-4 pb-32">
        <Header title="Restaurant Settings" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#111] text-white p-4 pb-32">
      <Header title="Restaurant Settings" />
      
      <div className="max-w-2xl mx-auto mt-6">
        {saved && (
          <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <icons.check />
            Settings saved successfully!
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <icons.settings />
            Restaurant Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Restaurant Name</label>
              <input
                type="text"
                value={formData.restaurantName || ''}
                onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                placeholder="Enter restaurant name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  value={formData.taxRate || ''}
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                  step="0.01"
                  min="0"
                  max="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select 
                  value={formData.currency || 'PKR'}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                >
                  <option value="PKR">Pakistani Rupee (₨)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                rows="2"
                placeholder="Restaurant address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                  placeholder="+92 300 1234567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                  placeholder="info@restaurant.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">GSTIN/Tax ID</label>
                <input
                  type="text"
                  value={formData.gstin || ''}
                  onChange={(e) => handleInputChange('gstin', e.target.value)}
                  className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                  placeholder="PK-123456789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
                  placeholder="www.restaurant.com"
                />
              </div>
            </div>
          </div>

          {/* Settings Preview */}
          <div className="p-4 bg-[#222] rounded-lg border border-gray-700">
            <h3 className="font-semibold mb-3 text-yellow-400 flex items-center gap-2">
              <icons.eye />
              Settings Preview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Restaurant:</strong> {formData.restaurantName || 'Not set'}</p>
                <p><strong>Tax Rate:</strong> {formData.taxRate || '0'}%</p>
                <p><strong>Currency:</strong> {formData.currency || 'PKR'}</p>
              </div>
              <div>
                <p><strong>Phone:</strong> {formData.phone || 'Not set'}</p>
                <p><strong>Email:</strong> {formData.email || 'Not set'}</p>
                <p><strong>Tax ID:</strong> {formData.gstin || 'Not set'}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-600">
              <p className="text-xs text-gray-400">
                <strong>Address:</strong> {formData.address || 'Not set'}
              </p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            loading={saving}
            className="w-full"
          >
            <icons.save />
            Save Settings
          </Button>
        </div>

        {/* System Information */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <icons.info />
            System Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p><strong>POS Version:</strong> 2.0.0</p>
              <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Database:</strong> Local JSON</p>
            </div>
            <div className="space-y-2">
              <p><strong>Support:</strong> support@termizrestaurant.com</p>
              <p><strong>Emergency Contact:</strong> +92 300 1234567</p>
              <p><strong>Status:</strong> <span className="text-green-400">● Operational</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;