import api from './client';

export interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export const getProductReviews = async (productId: string): Promise<Review[]> => {
    const { data } = await api.get(`/reviews/${productId}`);
    return data;
};

export const createReview = async (productId: string, rating: number, comment: string) => {
    const { data } = await api.post(`/reviews/${productId}`, { rating, comment });
    return data;
};
