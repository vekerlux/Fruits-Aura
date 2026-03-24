import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    isBundle: boolean;
    size?: 'big' | 'small';
    subtext?: string;
    cssFilter?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, isBundle: boolean, size?: 'big' | 'small') => void;
    updateQuantity: (id: string, isBundle: boolean, delta: number, size?: 'big' | 'small') => void;
    clearCart: () => void;
    cartCount: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('fruitsAuraCart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('fruitsAuraCart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newItem: CartItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(
                item => item.id === newItem.id && item.isBundle === newItem.isBundle && item.size === newItem.size
            );
            if (existingItem) {
                return prevCart.map(item =>
                    (item.id === newItem.id && item.isBundle === newItem.isBundle && item.size === newItem.size)
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prevCart, newItem];
        });
    };

    const removeFromCart = (id: string, isBundle: boolean, size?: 'big' | 'small') => {
        setCart(prevCart => prevCart.filter(item => !(item.id === id && item.isBundle === isBundle && item.size === size)));
    };

    const updateQuantity = (id: string, isBundle: boolean, delta: number, size?: 'big' | 'small') => {
        setCart(prevCart =>
            prevCart.map(item => {
                if (item.id === id && item.isBundle === isBundle && item.size === size) {
                    const newQty = item.quantity + delta;
                    return { ...item, quantity: Math.max(1, newQty) };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal }}
        >
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
