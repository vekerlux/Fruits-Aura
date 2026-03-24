import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutGrid, ShoppingBag, Store, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
    const location = useLocation();
    const { cartCount } = useCart();
    const { user } = useAuth();
    const { t } = useTranslation();

    const navItems = [
        { path: '/home', icon: Home, label: t('nav.home') },
        { path: '/menu', icon: LayoutGrid, label: t('nav.menu') },
        { path: '/cart', icon: ShoppingBag, label: t('nav.cart'), isCenter: true },
        { path: '/locations', icon: Store, label: t('nav.locations') },
        { path: '/profile', icon: User, label: t('nav.profile') },
    ];

    const adminItem = { path: '/admin', icon: ShieldCheck, label: t('nav.dashboard') };

    const currentNavItems = [...navItems];
    if (user && user.role?.toLowerCase() === 'admin') {
        currentNavItems.push(adminItem);
    }

    const hideOnPaths = ['/', '/login', '/register', '/admin'];
    if (location.pathname.startsWith('/admin')) return null;
    if (hideOnPaths.includes(location.pathname)) return null;

    const isActive = (path: string) =>
        path === '/menu'
            ? location.pathname.includes('/menu') || location.pathname.includes('/product')
            : location.pathname === path || location.pathname === path.replace('/cart', '/checkout');

    return (
        <motion.nav
            className="fixed bottom-8 left-1/2 z-50 pointer-events-none"
            initial={{ y: 100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.2 }}
            style={{ width: '90%', maxWidth: '420px' }}
        >
            <div className="glass rounded-[2.5rem] h-[72px] flex items-center justify-around px-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 relative pointer-events-auto">
                {currentNavItems.map((item) => {
                    const Icon = item.icon;
                    if (item.isCenter) {
                        const active = isActive(item.path);
                        return (
                            <div key={item.path} className="relative -top-8">
                                <Link to={item.path}>
                                    <motion.div
                                        whileTap={{ scale: 0.9 }}
                                        whileHover={{ y: -2 }}
                                        className="relative"
                                    >
                                        {/* Dynamic Glow Ring */}
                                        <AnimatePresence>
                                            {cartCount > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.2, 0.4] }}
                                                    exit={{ scale: 0.8, opacity: 0 }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                                    className="absolute inset-[-8px] rounded-full bg-primary/20 blur-xl"
                                                />
                                            )}
                                        </AnimatePresence>
                                        
                                        <div
                                            className={`w-[68px] h-[68px] rounded-full flex items-center justify-center text-white shadow-2xl border-[6px] border-[#0c0c0c] transition-all duration-500 relative z-10 ${active ? 'bg-primary' : 'bg-[#1a1a1a]'}`}
                                            style={{ 
                                                boxShadow: active 
                                                    ? '0 12px 35px rgba(242,127,13,0.5), inset 0 2px 4px rgba(255,255,255,0.3)' 
                                                    : '0 8px 30px rgba(0,0,0,0.4)' 
                                            }}
                                        >
                                            <Icon className={`w-7 h-7 ${active ? 'stroke-[3px]' : 'stroke-[2px]'}`} />
                                        </div>

                                        {/* Cart count badge */}
                                        <AnimatePresence>
                                            {cartCount > 0 && (
                                                <motion.span
                                                    key="badge"
                                                    initial={{ scale: 0, y: 10 }}
                                                    animate={{ scale: 1, y: 0 }}
                                                    exit={{ scale: 0, y: 10 }}
                                                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                                    className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-[3px] border-[#0c0c0c] leading-none z-20 shadow-lg"
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
                            className="relative flex flex-col items-center justify-center w-12 h-12"
                        >
                            {active && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm"
                                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                                />
                            )}
                            <motion.div
                                whileTap={{ scale: 0.8 }}
                                animate={{ 
                                    color: active ? '#f27f0d' : '#64748b',
                                    y: active ? -2 : 0
                                }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10"
                            >
                                <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(242,127,13,0.3)]' : 'stroke-[2px]'}`} />
                            </motion.div>
                            {active && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-1 h-1 bg-primary rounded-full absolute bottom-1"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
};

export default Navigation;
