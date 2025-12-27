import client from './client';

/**
 * Products API
 */

// Get all products
export const getAllProducts = async (params = {}) => {
    const response = await client.get('/products', { params });
    return response.data;
};

// Get product by ID
export const getProductById = async (id) => {
    const response = await client.get(`/products/${id}`);
    return response.data;
};

// Search products
export const searchProducts = async (query) => {
    const response = await client.get('/products/search', {
        params: { q: query }
    });
    return response.data;
};

// Get products by category
export const getProductsByCategory = async (category) => {
    const response = await client.get('/products', {
        params: { category }
    });
    return response.data;
};

// Get featured products
export const getFeaturedProducts = async () => {
    const response = await client.get('/products/featured');
    return response.data;
};

// Vote for a product
export const voteForProduct = async (id) => {
    const response = await client.post(`/products/${id}/vote`);
    return response.data;
};
