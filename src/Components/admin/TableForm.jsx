import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { icons } from '../../utils/icons';

const TableForm = ({ table, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    number: '',
    capacity: 4,
    location: 'main-hall'
  });
  const [loading, setLoading] = useState(false);

  const locationOptions = [
    { value: 'main-hall', label: 'Main Hall' },
    { value: 'terrace', label: 'Terrace' },
    { value: 'private-room', label: 'Private Room' },
    { value: 'garden', label: 'Garden' },
    { value: 'outdoor', label: 'Outdoor' }
  ];

  useEffect(() => {
    if (table) {
      setFormData({
        number: table.number || '',
        capacity: table.capacity || 4,
        location: table.location || 'main-hall'
      });
    }
  }, [table]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        number: parseInt(formData.number),
        capacity: parseInt(formData.capacity)
      };

      if (table) {
        await api.updateTable(table._id, submitData);
      } else {
        await api.createTable(submitData);
      }

      onSave();
      onClose();
    } catch (error) {
      alert('Error saving table: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getLocationLabel = () => {
    const location = locationOptions.find(l => l.value === formData.location);
    return location ? location.label : 'Main Hall';
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose}
      title={table ? 'Edit Table' : 'Add Table'}
      size="sm"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Table Number *</label>
            <input
              type="number"
              required
              min="1"
              max="100"
              value={formData.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
              className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
              placeholder="e.g., 1, 2, 3..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Capacity *</label>
            <input
              type="number"
              required
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', e.target.value)}
              className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full bg-[#222] border border-gray-600 rounded-lg px-4 py-3 outline-none focus:border-yellow-500"
            >
              {locationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="p-4 bg-[#222] rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Preview</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Table {formData.number || '?'}</p>
                <p className="text-sm text-gray-400">{getLocationLabel()}</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-semibold">{formData.capacity} seats</p>
                <p className="text-xs text-gray-400">Capacity</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              className="flex-1"
            >
              <icons.check />
              {table ? 'Update Table' : 'Create Table'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              <icons.close />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TableForm;