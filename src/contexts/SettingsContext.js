import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    restaurantName: 'Restaurant',
    taxRate: 5.25,
    currency: 'PKR',
    address: '123 Food Street, Karachi, Pakistan',
    phone: '+92 300 1234567',
    gstin: 'PK-123456789',
    email: 'info@termizrestaurant.com',
    website: 'www.termizrestaurant.com'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = await api.updateSettings(newSettings);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const getCurrencySymbol = () => 'Rs';

  const calculateTax = (subtotal) => {
    return subtotal * (settings.taxRate / 100);
  };

  const formatCurrency = (amount) => {
    return `Rs${parseFloat(amount).toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  const value = {
    settings,
    loading,
    updateSettings,
    getCurrencySymbol,
    calculateTax,
    formatCurrency,
    refreshSettings: loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};