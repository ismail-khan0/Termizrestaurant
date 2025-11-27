// src/contexts/AppContext.js
import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  orders: [],
  menuItems: [],
  categories: [],
  tables: [],
  currentOrder: {
    items: [],
    tableNumber: null,
    customerName: '',
    type: 'dine-in'
  },
  settings: {},
  loading: false,
  sidebarOpen: false,
  notifications: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    
    case 'SET_ORDERS': // Fixed typo: was 'SET_ORDErs'
      return { ...state, orders: action.payload };
    
    case 'SET_MENU_ITEMS':
      return { ...state, menuItems: action.payload };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_TABLES':
      return { ...state, tables: action.payload };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'ADD_TO_ORDER':
      const existingItemIndex = state.currentOrder.items.findIndex(
        item => item._id === action.payload._id
      );
      
      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.currentOrder.items.map((item, index) =>
          index === existingItemIndex
            ? { 
                ...item, 
                quantity: item.quantity + action.payload.quantity,
                total: (item.quantity + action.payload.quantity) * item.price
              }
            : item
        );
      } else {
        newItems = [...state.currentOrder.items, {
          ...action.payload,
          total: action.payload.price * action.payload.quantity
        }];
      }
      
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: newItems
        }
      };
    
    case 'UPDATE_ORDER_ITEM_QUANTITY':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: state.currentOrder.items.map(item =>
            item._id === action.payload.itemId
              ? { 
                  ...item, 
                  quantity: action.payload.quantity,
                  total: action.payload.quantity * item.price
                }
              : item
          ).filter(item => item.quantity > 0)
        }
      };
    
    case 'REMOVE_FROM_ORDER':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: state.currentOrder.items.filter(item => item._id !== action.payload)
        }
      };
    
    case 'SET_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: action.payload || initialState.currentOrder
      };
    
    case 'SET_ORDER_TABLE':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          tableNumber: action.payload
        }
      };
    
    case 'SET_ORDER_CUSTOMER':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          customerName: action.payload
        }
      };
    
    case 'SET_ORDER_TYPE':
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          type: action.payload
        }
      };
    
    case 'CLEAR_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: initialState.currentOrder
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      };
    
    case 'UPDATE_ORDER_STATUS': // Fixed typo: was 'updateOrderstatus'
      return {
        ...state,
        orders: state.orders.map(order =>
          order._id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    
    case 'UPDATE_TABLE_STATUS':
      return {
        ...state,
        tables: state.tables.map(table =>
          table._id === action.payload.tableId
            ? { 
                ...table, 
                status: action.payload.status,
                customerName: action.payload.customerName || table.customerName,
                customerInitials: action.payload.customerName 
                  ? action.payload.customerName.split(' ').map(n => n[0]).join('').toUpperCase()
                  : table.customerInitials
              }
            : table
        )
      };
    
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setSidebarOpen: (open) => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open }),
    setOrders: (orders) => dispatch({ type: 'SET_ORDERS', payload: orders }),
    setMenuItems: (menuItems) => dispatch({ type: 'SET_MENU_ITEMS', payload: menuItems }),
    setCategories: (categories) => dispatch({ type: 'SET_CATEGORIES', payload: categories }),
    setTables: (tables) => dispatch({ type: 'SET_TABLES', payload: tables }),
    setSettings: (settings) => dispatch({ type: 'SET_SETTINGS', payload: settings }),
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    
    // Order actions
    addToOrder: (item) => dispatch({ type: 'ADD_TO_ORDER', payload: item }),
    updateOrderItemQuantity: (itemId, quantity) => 
      dispatch({ type: 'UPDATE_ORDER_ITEM_QUANTITY', payload: { itemId, quantity } }),
    removeFromOrder: (itemId) => dispatch({ type: 'REMOVE_FROM_ORDER', payload: itemId }),
    setCurrentOrder: (order) => dispatch({ type: 'SET_CURRENT_ORDER', payload: order }),
    setOrderTable: (tableNumber) => dispatch({ type: 'SET_ORDER_TABLE', payload: tableNumber }),
    setOrderCustomer: (customerName) => dispatch({ type: 'SET_ORDER_CUSTOMER', payload: customerName }),
    setOrderType: (orderType) => dispatch({ type: 'SET_ORDER_TYPE', payload: orderType }),
    clearCurrentOrder: () => dispatch({ type: 'CLEAR_CURRENT_ORDER' }),
    
    // Notification actions
    addNotification: (notification) => dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    removeNotification: (notificationId) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId }),
    
    // Update actions
    updateOrderStatus: (orderId, status) => 
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } }),
    updateTableStatus: (tableId, status, customerName = '') => 
      dispatch({ type: 'UPDATE_TABLE_STATUS', payload: { tableId, status, customerName } })
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};