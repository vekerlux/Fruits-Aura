import client from './client';

/**
 * Reviews API
 */

// Get reviews for a product
export const getProductReviews = async (productId) => {
    const response = await client.get(`/reviews/product/${productId}`);
    return response.data;
};

// Create a review
export const createReview = async (productId, reviewData) => {
    const response = await client.post('/reviews', {
        productId,
        ...reviewData
    });
    return response.data;
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
    const response = await client.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
};

// Delete a review
export const deleteReview = async (reviewId) => {
    const response = await client.delete(`/reviews/${reviewId}`);
    return response.data;
};

// Get user's reviews
export const getUserReviews = async () => {
    const response = await client.get('/reviews/my-reviews');
    return response.data;
};
