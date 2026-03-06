// MOCK DATA for Fruits Aura until the real backend is connected

export interface Product {
    id: string;
    name: string;
    subtext: string;
    price: number;
    image: string;
    cssFilter?: string;
    ingredients: string[];
    nutrition: {
        kcal: number;
        sugar: string;
        vitC: string;
        hydration: string;
    };
    isPopular?: boolean;
}

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Apple Glow Aura',
        subtext: 'Signature Blend',
        price: 1900,
        image: '/assets/brand/bottle-base.png',
        cssFilter: 'hue-rotate(90deg) brightness(1.1)', // Green
        ingredients: ['Organic Apple', 'Ginger', 'Lime'],
        nutrition: { kcal: 120, sugar: '8g', vitC: 'High', hydration: 'Max' },
        isPopular: true
    },
    {
        id: '2',
        name: 'Pineapple Zen',
        subtext: 'Tropical Mix',
        price: 1900,
        image: '/assets/brand/bottle-base.png',
        cssFilter: 'sepia(0.5) hue-rotate(10deg) saturate(2) brightness(1.2)', // Yellowish
        ingredients: ['Pineapple', 'Mint', 'Coconut Water'],
        nutrition: { kcal: 110, sugar: '10g', vitC: 'Medium', hydration: 'High' }
    },
    {
        id: '3',
        name: 'Grape Royale',
        subtext: 'Antioxidant Infusion',
        price: 2100,
        image: '/assets/brand/bottle-base.png',
        cssFilter: 'hue-rotate(260deg) saturate(1.5)', // Purple
        ingredients: ['Red Grapes', 'Beetroot', 'Lemon'],
        nutrition: { kcal: 130, sugar: '12g', vitC: 'High', hydration: 'Medium' }
    }
];

import api from './client';

export const getProducts = async (keyword?: string, category?: string): Promise<Product[]> => {
    try {
        const response = await api.get('/products', {
            params: {
                keyword,
                category
            }
        });
        return response.data;
    } catch (error) {
        console.warn('Backend unavailable, falling back to mock data.', error);
        let products = mockProducts;
        if (keyword) {
            products = products.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
        }
        // Category filtering for mock data would require adding category to Product interface/mock, 
        // but since we are moving towards real backend, we'll keep it simple.
        return products;
    }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.warn('Backend unavailable, falling back to mock data.', error);
        return mockProducts.find(p => p.id === id); // Fallback
    }
};
