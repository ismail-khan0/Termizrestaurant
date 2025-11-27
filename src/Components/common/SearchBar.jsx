import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ 
  placeholder = "Search...", 
  value = "", 
  onChange,
  className = "",
  size = "small" 
}) => {
  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    medium: "px-3 py-2",
    large: "px-4 py-3 text-sm"
  };

  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-gray-400 text-sm" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-9 pr-3 ${sizeClasses[size]} text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors`}
      />
    </div>
  );
};

export default SearchBar;