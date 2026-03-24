import api from './client';

export interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export const getProductReviews = async (productId: string): Promise<Review[]> => {
    try {
        const { data } = await api.get(`/reviews/${productId}`);
        return data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return []; // Return empty array on failure to prevent blocking
    }
};

export const createReview = async (productId: string, rating: number, comment: string) => {
    const { data } = await api.post(`/reviews/${productId}`, { rating, comment });
    return data;
};
