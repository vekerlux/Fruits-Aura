import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'ig', name: 'Igbo', flag: '🇳🇬' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative z-[100]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-white/10 hover:border-primary/50 transition-colors active:scale-95"
            >
                <span className="text-sm">{currentLanguage.flag}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">{currentLanguage.code}</span>
                <span className={`material-symbols-outlined text-sm text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-40 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-1"
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left ${
                                    i18n.language === lang.code ? 'bg-primary/20 text-primary font-black' : 'text-slate-300 hover:bg-white/5 font-bold'
                                }`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <span className="text-xs">{lang.name}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;
