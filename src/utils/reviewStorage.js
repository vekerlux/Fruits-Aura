// Review storage utilities
const REVIEWS_STORAGE_KEY = 'fruitsAuraReviews';

export const getStoredReviews = () => {
    try {
        const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Error loading reviews:', error);
        return {};
    }
};

export const saveReview = (productId, review) => {
    try {
        const allReviews = getStoredReviews();

        if (!allReviews[productId]) {
            allReviews[productId] = [];
        }

        allReviews[productId].unshift(review); // Add new review at the beginning

        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(allReviews));

        return true;
    } catch (error) {
        console.error('Error saving review:', error);
        return false;
    }
};

export const getProductReviews = (productId, defaultReviews = []) => {
    const storedReviews = getStoredReviews();
    const userReviews = storedReviews[productId] || [];

    // Combine user-submitted reviews with default reviews
    return [...userReviews, ...defaultReviews];
};

export const getProductRating = (reviews) => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
};
