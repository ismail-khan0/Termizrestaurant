// src/Components/common/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '../../utils/icons';

const Header = ({ title, onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={handleBack}
            className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
            title="Go back"
          >
            <icons.close className="text-lg" />
          </button>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <icons.clock size={14} />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </div>
  );
};

export default Header;