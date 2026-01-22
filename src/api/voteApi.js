import client from './client';

export const getMyVote = () => client.get('/votes/my-vote');

export const submitVote = (voteData) => client.post('/votes', voteData);

export const getComingSoonMixes = () => client.get('/products?category=Coming Soon');
