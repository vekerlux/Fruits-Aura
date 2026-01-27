import client from './client';

/**
 * Voting API
 */

// Vote for a coming soon mix
export const voteForMix = async (mixId, comment = '') => {
    const response = await client.post(`/voting/${mixId}/vote`, { comment });
    return response.data;
};

// Get all coming soon mixes with rankings
export const getComingSoonMixes = async () => {
    const response = await client.get('/voting/rankings');
    return response.data;
};

// Check if user voted for a product
export const getVoteStatus = async (productId) => {
    const response = await client.get(`/voting/${productId}/vote-status`);
    return response.data;
};
