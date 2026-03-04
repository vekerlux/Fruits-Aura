import React, { createContext, useContext, useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'CONSUMER' | 'DISTRIBUTOR' | 'ADMIN';
    plan: string;
    avatar?: string;   // base64 or ObjectURL for local preview
    address?: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, authToken: string) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('fruitsAuraUser');
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem('fruitsAuraToken')
    );

    const login = (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('fruitsAuraUser', JSON.stringify(userData));
        localStorage.setItem('fruitsAuraToken', authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('fruitsAuraUser');
        localStorage.removeItem('fruitsAuraToken');
    };

    const updateUser = (updates: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, ...updates };
            localStorage.setItem('fruitsAuraUser', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
