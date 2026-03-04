/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#FF6B00",
                secondary: "#4ade80",   // Freshness Green
                "background-dark": "#0A0A0A",
                "card-dark": "#141414",
                "border-dark": "#262626",
                "accent-dark": "#1F1F1F",
            },
            fontFamily: {
                display: ["Plus Jakarta Sans", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "1.5rem",
                'bento': "2rem",
            },
            keyframes: {
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '33%': { transform: 'translateY(-8px) rotate(1deg)' },
                    '66%': { transform: 'translateY(-4px) rotate(-1deg)' },
                },
                'aurora': {
                    '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.15' },
                    '33%': { transform: 'translate(-30%, -60%) scale(1.2)', opacity: '0.25' },
                    '66%': { transform: 'translate(-60%, -40%) scale(0.9)', opacity: '0.1' },
                    '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.15' },
                },
                'aurora-green': {
                    '0%': { transform: 'translate(50%, 50%) scale(1)', opacity: '0.1' },
                    '50%': { transform: 'translate(30%, 30%) scale(1.3)', opacity: '0.2' },
                    '100%': { transform: 'translate(50%, 50%) scale(1)', opacity: '0.1' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(255,107,0,0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(255,107,0,0.6), 0 0 80px rgba(255,107,0,0.2)' },
                },
                'glow-pulse-green': {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(74,222,128,0.2)' },
                    '50%': { boxShadow: '0 0 35px rgba(74,222,128,0.5)' },
                },
                'ping-soft': {
                    '0%': { transform: 'scale(1)', opacity: '0.8' },
                    '100%': { transform: 'scale(1.8)', opacity: '0' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in-up': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'rotate-slow': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'float-slow': 'float-slow 5s ease-in-out infinite',
                'aurora': 'aurora 8s ease-in-out infinite',
                'aurora-green': 'aurora-green 10s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'glow-pulse-green': 'glow-pulse-green 2.5s ease-in-out infinite',
                'ping-soft': 'ping-soft 1.5s ease-out infinite',
                'slide-up': 'slide-up 0.4s ease-out',
                'fade-in-up': 'fade-in-up 0.5s ease-out',
                'rotate-slow': 'rotate-slow 20s linear infinite',
            },
            transitionTimingFunction: {
                'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
        },
    },
    plugins: [],
}
