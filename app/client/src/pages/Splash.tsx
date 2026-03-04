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
                    initial={{ scale: 0, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 12, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                    className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl border-2 border-white/15 mb-6 relative"
                    style={{ boxShadow: '0 0 60px rgba(255,107,0,0.4), 0 20px 40px rgba(0,0,0,0.5)' }}
                >
                    {/* Pulsing ring */}
                    <motion.div
                        className="absolute inset-0 rounded-[2.5rem] border-2 border-primary/50"
                        animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <motion.span
                        animate={{ rotate: [-12, -12] }}
                        className="material-symbols-outlined text-white text-5xl font-black -rotate-12"
                    >
                        spa
                    </motion.span>
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
