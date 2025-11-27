// src/utils/constants.js
export const ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in progress',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const TABLE_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  OCCUPIED: 'occupied'
};

export const CATEGORY_COLOrs = {
  starters: 'bg-red-500',
  main: 'bg-purple-500',
  beverages: 'bg-pink-600',
  soups: 'bg-yellow-600',
  desserts: 'bg-blue-900',
  pizzas: 'bg-green-700',
  alcoholic: 'bg-red-700',
  salads: 'bg-purple-700'
};

export const TAX_RATE = 0.0525; // 5.25%