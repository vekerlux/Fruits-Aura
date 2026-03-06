import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProducts } from '../api/products';
import type { Product } from '../api/products';
import { useCart } from '../context/CartContext';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const categories = [
    { label: 'All', icon: 'apps', value: undefined },
    { label: 'Detox', icon: 'eco', value: 'detox' },
    { label: 'Energy', icon: 'bolt', value: 'energy' },
    { label: 'Immunity', icon: 'health_and_safety', value: 'immunity' },
    { label: 'Glow', icon: 'auto_awesome', value: 'glow' },
];

const Menu = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const categoryValue = categories.find(c => c.label === activeCategory)?.value;
        const delayDebounceFn = setTimeout(() => {
            setLoading(true);
            getProducts(search, categoryValue)
                .then(setProducts)
                .catch(console.error)
                .finally(() => setLoading(false));
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [activeCategory, search]);

    const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, isBundle: false, subtext: product.subtext });
    };

    const filteredProducts = products;

    return (
        <div className="bg-background-dark text-white min-h-screen pb-32">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="px-6 pt-14 pb-5 sticky top-0 z-50 bg-background-dark/90 backdrop-blur-xl border-b border-white/[0.04]"
            >
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-2xl font-black tracking-tight">Our <span className="text-primary">Menu</span></h1>
                    <motion.div whileTap={{ scale: 0.9 }}>
                        <Link to="/cart">
                            <button className="w-10 h-10 rounded-full glass flex items-center justify-center cursor-pointer">
                                <span className="material-symbols-outlined text-white">shopping_basket</span>
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Animated search bar */}
                <motion.div
                    animate={{ boxShadow: searchFocused ? '0 0 0 2px rgba(255,107,0,0.35)' : '0 0 0 0px transparent' }}
                    transition={{ duration: 0.25 }}
                    className="relative rounded-2xl overflow-hidden"
                >
                    <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-primary' : 'text-slate-500'}`}>search</span>
                    <input
                        className="w-full bg-card-dark border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm placeholder:text-slate-600 outline-none text-white"
                        placeholder="Find your aura mix..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-accent-dark w-9 h-9 rounded-xl flex items-center justify-center border border-white/5 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-white text-lg">tune</span>
                    </motion.button>
                </motion.div>

                {/* Category pills */}
                <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.label}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setActiveCategory(cat.label)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${activeCategory === cat.label
                                ? 'bg-primary text-white border-primary shadow-md shadow-primary/30'
                                : 'glass text-slate-400 border-white/8 hover:border-primary/30 hover:text-primary'
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                            {cat.label}
                        </motion.button>
                    ))}
                </div>
            </motion.header>

            <main className="px-5 pt-5">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-base font-black">Best Sellers</h3>
                    <Link to="/featured" className="text-primary text-xs font-black uppercase tracking-widest">View All</Link>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                >
                    {loading ? (
                        <>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-[130px] shimmer rounded-[2.5rem]" />
                            ))}
                        </>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-16 text-slate-500">
                            <span className="material-symbols-outlined text-4xl block mb-2">search_off</span>
                            <p className="text-sm font-bold">No products found</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
                                whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(255,107,0,0.1)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    to={`/product/${product.id}`}
                                    className="bg-card-dark p-4 rounded-[2.5rem] flex items-center gap-4 border border-white/5 product-card-hover block"
                                >
                                    <motion.div
                                        className="w-28 h-28 rounded-3xl bg-accent-dark flex items-center justify-center p-2 shrink-0 overflow-hidden"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            alt={product.name}
                                            loading="lazy"
                                            className="w-full h-full object-contain"
                                            src={product.image}
                                            style={{ filter: product.cssFilter }}
                                        />
                                    </motion.div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-black text-base text-white leading-tight">{product.name}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{product.subtext}</p>
                                            </div>
                                            <motion.button
                                                whileTap={{ scale: 0.8 }}
                                                className={`cursor-pointer ${product.isPopular ? 'text-primary' : 'text-slate-700'}`}
                                            >
                                                <span className={`material-symbols-outlined text-xl ${product.isPopular ? 'filled' : ''}`}>favorite</span>
                                            </motion.button>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-xl font-black text-white">₦{product.price.toLocaleString()}</span>
                                            <motion.button
                                                whileTap={{ scale: 0.85 }}
                                                onClick={(e) => handleQuickAdd(product, e)}
                                                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/35 cursor-pointer"
                                                style={{ boxShadow: '0 4px 20px rgba(255,107,0,0.35)' }}
                                            >
                                                <span className="material-symbols-outlined font-bold">add</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default Menu;
