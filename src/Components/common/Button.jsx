import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'rounded-lg font-semibold transition-colors flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-yellow-500 text-black hover:bg-yellow-600 disabled:bg-gray-600 disabled:text-gray-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-600 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-600 disabled:text-gray-400',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-400'
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      )}
      {children}
    </button>
  );
};

export default Button;