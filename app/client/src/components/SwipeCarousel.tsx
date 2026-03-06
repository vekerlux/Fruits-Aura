import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import type { Product } from '../api/products';

const AUTOPLAY_INTERVAL = 4500;

const SwipeCarousel = () => {
    const [popularProducts, setPopularProducts] = useState<Product[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const dragStartX = useRef(0);

    const gradients = [
        'from-orange-950 via-red-900 to-orange-800',
        'from-green-950 via-emerald-900 to-green-800',
        'from-purple-950 via-purple-900 to-indigo-900',
        'from-blue-950 via-cyan-900 to-blue-800'
    ];

    const accentColors = ['#FF6B00', '#4ade80', '#a78bfa', '#22d3ee'];

    const fetchPopular = async () => {
        try {
            const data = await getProducts();
            const filtered = data.filter(p => p.isPopular);
            // If no products are marked popular, take the first 3 as fallback
            setPopularProducts(filtered.length > 0 ? filtered : data.slice(0, 3));
        } catch (error) {
            console.error('Carousel fetch failed', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopular();
    }, []);

    const totalSlides = popularProducts.length;

    const startAutoplay = () => {
        stopAutoplay();
        if (totalSlides <= 1) return;
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % totalSlides);
        }, AUTOPLAY_INTERVAL);
    };

    const stopAutoplay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
        if (!loading && totalSlides > 0) {
            startAutoplay();
        }
        return () => stopAutoplay();
    }, [loading, totalSlides]);

    const goTo = (index: number) => {
        if (totalSlides === 0) return;
        setCurrent((index + totalSlides) % totalSlides);
        startAutoplay();
    };

    if (loading) return <div className="h-72 rounded-[2.5rem] shimmer opacity-20" />;
    if (totalSlides === 0) return null;

    const currentProduct = popularProducts[current];
    const accentColor = accentColors[current % accentColors.length];
    const gradient = gradients[current % gradients.length];

    return (
        <div
            className="relative h-72 rounded-[2.5rem] overflow-hidden select-none"
            onPointerDown={(e) => { dragStartX.current = e.clientX; }}
            onPointerUp={(e) => {
                const delta = e.clientX - dragStartX.current;
                if (Math.abs(delta) > 40) {
                    goTo(current + (delta < 0 ? 1 : -1));
                }
            }}
            style={{ cursor: 'grab', touchAction: 'pan-y' }}
        >
            {/* Background gradients */}
            {popularProducts.map((p, i) => (
                <motion.div
                    key={`bg-${p.id}`}
                    className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]}`}
                    animate={{ opacity: i === current ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
            ))}

            <motion.div
                className="absolute right-6 top-6 w-32 h-32 rounded-full opacity-20 blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: accentColor }}
            />

            {/* Floating Bottle Image */}
            <motion.div
                key={`img-${currentProduct.id}`}
                initial={{ opacity: 0, x: 40, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                className="absolute -right-4 bottom-2 w-48 h-56 z-0"
            >
                <motion.img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    loading="lazy"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    style={{ filter: currentProduct.cssFilter }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>

            {/* Content */}
            <motion.div
                key={`content-${currentProduct.id}`}
                className="absolute inset-0 z-10 p-7 flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="space-y-2">
                    <span
                        className="inline-block text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] text-white border border-white/20"
                        style={{ background: `${accentColor}44` }}
                    >
                        {currentProduct.subtext || 'Featured Aura'}
                    </span>
                    <h2 className="text-3xl font-black leading-[1.1] text-white whitespace-pre-line drop-shadow-lg max-w-[200px]">
                        {currentProduct.name}
                    </h2>
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                        ₦{currentProduct.price.toLocaleString()} • Premium Cold Pressed
                    </p>
                </div>

                <Link to={`/product/${currentProduct.id}`} draggable={false}>
                    <motion.button
                        whileTap={{ scale: 0.94 }}
                        whileHover={{ scale: 1.05 }}
                        className="text-white font-black px-7 py-3 rounded-2xl text-[10px] uppercase tracking-[0.2em] border border-white/20 backdrop-blur-md shadow-xl"
                        style={{ background: `${accentColor}33` }}
                    >
                        Experience Aura →
                    </motion.button>
                </Link>
            </motion.div>

            {/* Indicators */}
            {totalSlides > 1 && (
                <div className="absolute bottom-5 right-6 flex gap-2.5 z-20">
                    {popularProducts.map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => goTo(i)}
                            animate={{
                                width: i === current ? 24 : 7,
                                opacity: i === current ? 1 : 0.3,
                                backgroundColor: i === current ? accentColor : '#ffffff',
                            }}
                            transition={{ duration: 0.4 }}
                            className="h-1.5 rounded-full cursor-pointer"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SwipeCarousel;
