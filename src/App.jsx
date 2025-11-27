import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { useToast } from './hooks/useToast';
import ErrorBoundary from './Components/common/ErrorBoundary';
import BottomNavigation from './Components/common/BottomNavigation';

// Import pages
import Dashboard from './Pages/Dashboard';
import Menu from './Pages/Menu';
import OrdersPage from './Pages/Orders';
import OrderDetails from './Pages/OrderDetails';
import Settings from './Pages/Settings';
import MenuManagement from './Pages/MenuManagement';
import TableManagement from './Pages/TableManagement';

import './index.css';

const ToastWrapper = ({ children }) => {
  const { ToastContainer } = useToast();
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <AppProvider>
          <Router>
            <ToastWrapper>
              <div className="App bg-[#111] min-h-screen compact">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:orderId" element={<OrderDetails />} />
                  <Route path="/tables" element={<TableManagement />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin/menu" element={<MenuManagement />} />
                  <Route path="/admin/tables" element={<TableManagement />} />
                </Routes>
                <BottomNavigation />
              </div>
            </ToastWrapper>
          </Router>
        </AppProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;