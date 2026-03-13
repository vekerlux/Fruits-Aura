import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Splash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => navigate('/home'), 2800);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="bg-background-dark min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Aurora background */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.22) 0%, transparent 65%)', translateX: '-50%', translateY: '-50%' }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-64 h-64 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 65%)' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Logo icon */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                    className="w-32 h-32 flex items-center justify-center mb-6 relative"
                >
                    {/* Pulsing ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-white/20 blur-xl"
                        animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <img src="/logo.png" alt="Fruits Aura" className="w-full h-full object-contain filter drop-shadow-2xl z-10" />
                </motion.div>

                {/* Brand name */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
                    className="text-4xl font-black text-white tracking-tighter"
                >
                    Fruits Aura
                </motion.h1>


                {/* Tagline */}
                <motion.p
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.45 }}
                    className="text-primary text-xs font-black uppercase tracking-[0.25em] mt-2"
                >
                    Nigeria's Finest
                </motion.p>
            </div>

            {/* Loading dots */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Splash;
