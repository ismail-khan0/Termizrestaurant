import React from 'react';

const CurrencyDisplay = ({ amount, className = "" }) => {
  return (
    <span className={className}>
      Rs{typeof amount === 'number' ? amount.toFixed(2) : '0.00'}
    </span>
  );
};

export default CurrencyDisplay;