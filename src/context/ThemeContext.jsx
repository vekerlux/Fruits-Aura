import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('fruitsAuraTheme');
        const wantsDark = savedTheme === 'dark';
        if (wantsDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        return wantsDark;
    });

    const toggleTheme = () => {
        setIsDark(prev => {
            const newTheme = !prev;
            localStorage.setItem('fruitsAuraTheme', newTheme ? 'dark' : 'light');
            document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
