// src/utils/icons.js
import React from 'react';
import { 
  FiDollarSign, 
  FiClipboard, 
  FiEdit,
  FiTrash2,
  FiTable,
  FiPrinter,
  FiEye,
  FiSave,
  FiMapPin,
  FiUsers,
  FiTag,
  FiFilter,  // Add this import
  FiDivide
} from 'react-icons/fi';

import { 
  MdRestaurant,
  MdLocalDining,
  MdKitchen
} from 'react-icons/md';

import { 
  IoReceipt,
  IoAnalytics,
  IoCog,
  IoHome,
  IoTime,
  IoCalendar,
  IoSearch,
  IoAdd,
  IoClose,
  IoCheckmark,
  IoChevronForward,
  IoChevronBack,
  IoChevronUp,
  IoChevronDown,
  IoArrowForward,
  IoArrowBack,
  IoRefresh,
  IoPerson,
  IoPeople,
  IoPersonAdd,
  IoLocation,
  IoCart,
  IoWarning,
  IoAlertCircle,
  IoInformationCircle,
  IoCheckmarkCircle,
  IoCloseCircle
} from 'react-icons/io5';

// Create an Icon component that handles rendering
const Icon = ({ name, size = 16, className = "", ...props }) => {
  const iconMap = {
    // Common UI Icons
    close: IoClose,
    check: IoCheckmark,
    plus: IoAdd,
    edit: FiEdit,
    delete: FiTrash2,
    refresh: IoRefresh,
    search: IoSearch,
    settings: IoCog,
    filter: FiFilter,  // Add this line
    
    // Navigation
    home: IoHome,
    back: IoArrowBack,
    forward: IoArrowForward,
    chevronRight: IoChevronForward,
    chevronLeft: IoChevronBack,
    chevronDown: IoChevronDown,
    chevronUp: IoChevronUp,
    
    // Finance
    dollar: FiDollarSign,
    clipboard: FiClipboard,
    chart: IoAnalytics,
    receipt: IoReceipt,
    printer: FiPrinter,
    calculator: FiDivide,
    
    // Restaurant Specific
    restaurant: MdRestaurant,
    dining: MdLocalDining,
    table: FiTable,
    kitchen: MdKitchen,
    
    // User & People
    user: IoPerson,
    users: IoPeople,
    userCheck: IoPersonAdd,
    
    // Time & Date
    clock: IoTime,
    calendar: IoCalendar,
    
    // Actions
    eye: FiEye,
    save: FiSave,
    
    // Payment & Shopping
    shoppingCart: IoCart,
    cart: IoCart,
    
    // Status & Feedback
    warning: IoWarning,
    alert: IoAlertCircle,
    info: IoInformationCircle,
    success: IoCheckmarkCircle,
    error: IoCloseCircle,
    
    // Location
    mapPin: IoLocation,

    // Discount/Tags
    tag: FiTag
  };

  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return <IoWarning size={size} className={className} {...props} />;
  }

  return <IconComponent size={size} className={className} {...props} />;
};

// Export individual icons as components
export const CloseIcon = (props) => <Icon name="close" {...props} />;
export const CheckIcon = (props) => <Icon name="check" {...props} />;
export const PlusIcon = (props) => <Icon name="plus" {...props} />;
export const EditIcon = (props) => <Icon name="edit" {...props} />;
export const DeleteIcon = (props) => <Icon name="delete" {...props} />;
export const RefreshIcon = (props) => <Icon name="refresh" {...props} />;
export const SearchIcon = (props) => <Icon name="search" {...props} />;
export const SettingsIcon = (props) => <Icon name="settings" {...props} />;
export const FilterIcon = (props) => <Icon name="filter" {...props} />;  // Add this line
export const HomeIcon = (props) => <Icon name="home" {...props} />;
export const BackIcon = (props) => <Icon name="back" {...props} />;
export const ForwardIcon = (props) => <Icon name="forward" {...props} />;
export const ChevronRightIcon = (props) => <Icon name="chevronRight" {...props} />;
export const ChevronLeftIcon = (props) => <Icon name="chevronLeft" {...props} />;
export const ChevronDownIcon = (props) => <Icon name="chevronDown" {...props} />;
export const ChevronUpIcon = (props) => <Icon name="chevronUp" {...props} />;
export const DollarIcon = (props) => <Icon name="dollar" {...props} />;
export const ClipboardIcon = (props) => <Icon name="clipboard" {...props} />;
export const ChartIcon = (props) => <Icon name="chart" {...props} />;
export const ReceiptIcon = (props) => <Icon name="receipt" {...props} />;
export const PrinterIcon = (props) => <Icon name="printer" {...props} />;
export const CalculatorIcon = (props) => <Icon name="calculator" {...props} />;
export const RestaurantIcon = (props) => <Icon name="restaurant" {...props} />;
export const DiningIcon = (props) => <Icon name="dining" {...props} />;
export const TableIcon = (props) => <Icon name="table" {...props} />;
export const KitchenIcon = (props) => <Icon name="kitchen" {...props} />;
export const UserIcon = (props) => <Icon name="user" {...props} />;
export const UsersIcon = (props) => <Icon name="users" {...props} />;
export const UserCheckIcon = (props) => <Icon name="userCheck" {...props} />;
export const ClockIcon = (props) => <Icon name="clock" {...props} />;
export const CalendarIcon = (props) => <Icon name="calendar" {...props} />;
export const EyeIcon = (props) => <Icon name="eye" {...props} />;
export const SaveIcon = (props) => <Icon name="save" {...props} />;
export const ShoppingCartIcon = (props) => <Icon name="shoppingCart" {...props} />;
export const CartIcon = (props) => <Icon name="cart" {...props} />;
export const WarningIcon = (props) => <Icon name="warning" {...props} />;
export const AlertIcon = (props) => <Icon name="alert" {...props} />;
export const InfoIcon = (props) => <Icon name="info" {...props} />;
export const SuccessIcon = (props) => <Icon name="success" {...props} />;
export const ErrorIcon = (props) => <Icon name="error" {...props} />;
export const MapPinIcon = (props) => <Icon name="mapPin" {...props} />;
export const TagIcon = (props) => <Icon name="tag" {...props} />;

// Legacy export for backward compatibility
export const icons = {
  close: (props) => <CloseIcon {...props} />,
  check: (props) => <CheckIcon {...props} />,
  plus: (props) => <PlusIcon {...props} />,
  edit: (props) => <EditIcon {...props} />,
  delete: (props) => <DeleteIcon {...props} />,
  refresh: (props) => <RefreshIcon {...props} />,
  search: (props) => <SearchIcon {...props} />,
  settings: (props) => <SettingsIcon {...props} />,
  filter: (props) => <FilterIcon {...props} />,  // Add this line
  home: (props) => <HomeIcon {...props} />,
  back: (props) => <BackIcon {...props} />,
  forward: (props) => <ForwardIcon {...props} />,
  chevronRight: (props) => <ChevronRightIcon {...props} />,
  chevronLeft: (props) => <ChevronLeftIcon {...props} />,
  chevronDown: (props) => <ChevronDownIcon {...props} />,
  chevronUp: (props) => <ChevronUpIcon {...props} />,
  dollar: (props) => <DollarIcon {...props} />,
  clipboard: (props) => <ClipboardIcon {...props} />,
  chart: (props) => <ChartIcon {...props} />,
  receipt: (props) => <ReceiptIcon {...props} />,
  printer: (props) => <PrinterIcon {...props} />,
  calculator: (props) => <CalculatorIcon {...props} />,
  restaurant: (props) => <RestaurantIcon {...props} />,
  dining: (props) => <DiningIcon {...props} />,
  table: (props) => <TableIcon {...props} />,
  kitchen: (props) => <KitchenIcon {...props} />,
  user: (props) => <UserIcon {...props} />,
  users: (props) => <UsersIcon {...props} />,
  userCheck: (props) => <UserCheckIcon {...props} />,
  clock: (props) => <ClockIcon {...props} />,
  calendar: (props) => <CalendarIcon {...props} />,
  eye: (props) => <EyeIcon {...props} />,
  save: (props) => <SaveIcon {...props} />,
  shoppingCart: (props) => <ShoppingCartIcon {...props} />,
  cart: (props) => <CartIcon {...props} />,
  warning: (props) => <WarningIcon {...props} />,
  alert: (props) => <AlertIcon {...props} />,
  info: (props) => <InfoIcon {...props} />,
  success: (props) => <SuccessIcon {...props} />,
  error: (props) => <ErrorIcon {...props} />,
  mapPin: (props) => <MapPinIcon {...props} />,
  tag: (props) => <TagIcon {...props} />,
};

export default Icon;