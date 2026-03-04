import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/menu', icon: 'restaurant_menu', label: 'Menu' },
    { path: '/cart', icon: 'shopping_bag', label: 'Cart', isCenter: true },
    { path: '/locations', icon: 'share_location', label: 'Stores' },
    { path: '/profile', icon: 'person', label: 'Profile' },
];

const Navigation = () => {
    const location = useLocation();
    const { cartCount } = useCart();
    const { user } = useAuth();

    const adminItem = { path: '/admin', icon: 'shield_person', label: 'Admin' };

    // Create local copy of navItems so we don't mutate the global one
    const currentNavItems = [...navItems];
    if (user && user.role?.toLowerCase() === 'admin') {
        // Replace locations or profile with Admin for better fit? 
        // Or just push it. Let's push it after Menu.
        currentNavItems.splice(2, 0, adminItem);
    }

    const hideOnPaths = ['/', '/login', '/register'];
    if (hideOnPaths.includes(location.pathname)) return null;

    const isActive = (path: string) =>
        path === '/menu'
            ? location.pathname.includes('/menu') || location.pathname.includes('/product')
            : location.pathname === path || location.pathname === path.replace('/cart', '/checkout');

    return (
        <motion.nav
            className="fixed bottom-6 left-1/2 z-50"
            initial={{ y: 100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.2 }}
            style={{ width: '92%' }}
        >
            <div className={`glass rounded-[2.5rem] h-[68px] flex items-center justify-around px-2 shadow-2xl shadow-black/60 border border-white/10 relative ${user?.role?.toLowerCase() === 'admin' ? 'gap-0' : 'px-3'}`}>
                {currentNavItems.map((item) => {
                    if (item.isCenter) {
                        const active = isActive(item.path);
                        return (
                            <div key={item.path} className="relative -top-7">
                                <Link to={item.path}>
                                    <motion.div
                                        whileTap={{ scale: 0.88 }}
                                        whileHover={{ scale: 1.05 }}
                                        className="relative"
                                    >
                                        {/* Pulsing glow ring */}
                                        {cartCount > 0 && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full"
                                                animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                                                style={{ background: 'rgba(255,107,0,0.5)' }}
                                            />
                                        )}
                                        <div
                                            className={`w-[62px] h-[62px] rounded-full flex items-center justify-center text-white shadow-xl border-[5px] border-[#0A0A0A] transition-all duration-300 ${active ? 'bg-orange-500' : 'bg-primary'}`}
                                            style={{ boxShadow: '0 8px 30px rgba(255,107,0,0.45)' }}
                                        >
                                            <span className={`material-symbols-outlined text-2xl ${active ? 'filled' : ''}`}>
                                                {item.icon}
                                            </span>
                                        </div>
                                        {/* Cart count badge */}
                                        <AnimatePresence>
                                            {cartCount > 0 && (
                                                <motion.span
                                                    key="badge"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                                    className="absolute top-0 right-0 bg-white text-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A0A0A] leading-none"
                                                >
                                                    {cartCount > 9 ? '9+' : cartCount}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </Link>
                            </div>
                        );
                    }

                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="relative w-12 h-12 flex items-center justify-center"
                        >
                            {active && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 rounded-2xl bg-primary/12"
                                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                                />
                            )}
                            <motion.span
                                whileTap={{ scale: 0.85 }}
                                animate={{ color: active ? '#FF6B00' : '#94a3b8' }}
                                transition={{ duration: 0.2 }}
                                className={`material-symbols-outlined text-2xl z-10 ${active ? 'filled' : ''}`}
                            >
                                {item.icon}
                            </motion.span>
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
};

export default Navigation;
