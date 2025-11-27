// Get initials from customer name
export const getInitials = (name) => {
  if (!name) return 'CN';
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

// Pakistani Rupee formatter
export const formatCurrency = (amount) => {
  return `Rs${parseFloat(amount).toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

// Date formatter
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Time formatter
export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit'
  });
};