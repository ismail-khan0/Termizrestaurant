// src/utils/formatters.js
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'Pak'
  }).format(amount);
};

// src/utils/helpers.js
export const getInitials = (name) => {
  if (!name) return 'CN';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const generateOrderNumber = () => {
  const date = new Date();
  const timestamp = date.getTime();
  return `ORD${timestamp}`;
};