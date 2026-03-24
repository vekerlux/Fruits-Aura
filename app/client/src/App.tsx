import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Navigation from './components/Navigation';
import NotificationBanner from './components/NotificationBanner';
import ErrorBoundary from './components/ErrorBoundary';
import AdminRoute from './components/AdminRoute';
import { Toaster } from 'sonner';

// Lazy-loaded pages for code splitting
const Splash = lazy(() => import('./pages/Splash'));
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Locations = lazy(() => import('./pages/Locations'));
const Featured = lazy(() => import('./pages/Featured'));
import Dashboard from './pages/admin/Dashboard';
// const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));

const PageLoader = () => (
  <div className="bg-background-dark min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Loading Aura...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" theme="dark" closeButton richColors />
        <NotificationBanner />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/home" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/featured" element={<Featured />} />
            <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          </Routes>
        </Suspense>
        <Navigation />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

