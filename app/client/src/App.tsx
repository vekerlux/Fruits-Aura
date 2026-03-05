import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';

// Pages
import Splash from './pages/Splash';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Locations from './pages/Locations';
import Featured from './pages/Featured';
import Dashboard from './pages/admin/Dashboard';
import OrderSuccess from './pages/OrderSuccess';
import AdminRoute from './components/AdminRoute';
import NotificationBanner from './components/NotificationBanner';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <NotificationBanner />
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
        <Navigation />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
