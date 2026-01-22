import client from './client';

/**
 * Voting API
 */

// Vote for a coming soon product
export const voteForProduct = async (productId) => {
    const response = await client.post(`/voting/${productId}/vote`);
    return response.data;
};

// Get rankings for coming soon products
export const getVotingRankings = async () => {
    const response = await client.get('/voting/rankings');
    return response.data;
};

// Check if user voted for a product
export const getVoteStatus = async (productId) => {
    const response = await client.get(`/voting/${productId}/vote-status`);
    return response.data;
};
