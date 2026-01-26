import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Layout from './components/Layout';
import Splash from './components/Splash';
import Onboarding from './components/Onboarding';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Track from './pages/Track';
import Locations from './pages/Locations';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import NotificationManagement from './pages/admin/NotificationManagement';
import CarouselManagement from './pages/admin/CarouselManagement';
import VotingResults from './pages/admin/VotingResults';
import BottomNav from './components/BottomNav'; // Assuming BottomNav is in components
import './App.css';
import './components/Layout.css';
import './styles/auth.css';
import './pages/admin/AdminLayout.css';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Header from './components/Header';

// Basic Error Boundary for production debugging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Global Crash:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.toString()}</p>
          <button onClick={() => window.location.reload()}>Reload App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  useEffect(() => {
    console.log("App mounted at:", window.location.pathname);
    console.log("API URL:", import.meta.env.VITE_API_URL || "Using Localhost Fallback");
  }, []);

  const location = useLocation();
  const isAuthRoute = ['/login', '/register'].includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showBottomNav = !isAuthRoute && !isAdminRoute;
  const showHeader = !isAuthRoute && !isAdminRoute;

  // State migrated from App component
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return !localStorage.getItem('hasSeenOnboarding');
    } catch (e) {
      console.warn('LocalStorage access failed:', e);
      return false;
    }
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  if (showSplash) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className={`app-layout ${isAdminRoute ? 'admin-mode' : ''}`}>
      {/* Global Background Elements */}
      {!isAdminRoute && (
        <>
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="floating-fruit">🍊</div>
          <div className="floating-fruit">🍋</div>
          <div className="floating-fruit">🍎</div>
        </>
      )}

      {showHeader && <Header />}

      <main className="main-content">
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/track" element={<Track />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Protected Customer Routes */}
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="notifications" element={<NotificationManagement />} />
              <Route path="carousel" element={<CarouselManagement />} />
              <Route path="votes" element={<VotingResults />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <ToastProvider>
                <Router>
                  <AppContent />
                  <FloatingWhatsApp />
                </Router>
              </ToastProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

