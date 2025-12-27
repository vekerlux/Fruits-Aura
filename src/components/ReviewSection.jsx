import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, ChevronDown } from 'lucide-react';
import './ReviewSection.css';

const ReviewSection = ({ reviews, rating, reviewCount }) => {
    const [sortBy, setSortBy] = useState('recent');
    const [showAll, setShowAll] = useState(false);

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'helpful') return b.helpful - a.helpful;
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        return 0;
    });

    const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);

    const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: reviews.filter(r => r.rating === stars).length,
        percentage: (reviews.filter(r => r.rating === stars).length / reviews.length) * 100
    }));

    return (
        <div className="review-section">
            <div className="review-header">
                <h3>Customer Reviews</h3>
                <div className="rating-summary">
                    <div className="rating-score">
                        <span className="score">{rating}</span>
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < Math.floor(rating) ? "#FDD835" : "none"}
                                    color="#FDD835"
                                />
                            ))}
                        </div>
                        <span className="review-count">{reviewCount} reviews</span>
                    </div>
                </div>
            </div>

            <div className="rating-breakdown">
                {ratingBreakdown.map(item => (
                    <div key={item.stars} className="breakdown-row">
                        <span className="stars-label">{item.stars} ★</span>
                        <div className="bar-container">
                            <div className="bar" style={{ width: `${item.percentage}%` }}></div>
                        </div>
                        <span className="count">{item.count}</span>
                    </div>
                ))}
            </div>

            <div className="review-controls">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                    <option value="recent">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                </select>
            </div>

            <div className="reviews-list">
                <AnimatePresence>
                    {displayedReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            className="review-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="review-header-row">
                                <div className="reviewer-info">
                                    <span className="reviewer-name">{review.author}</span>
                                    <div className="review-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                fill={i < review.rating ? "#FDD835" : "none"}
                                                color="#FDD835"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <div className="review-footer">
                                <button className="helpful-btn">
                                    <ThumbsUp size={14} /> Helpful ({review.helpful})
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {reviews.length > 3 && (
                <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
                    <ChevronDown size={16} className={showAll ? 'rotate' : ''} />
                </button>
            )}
        </div>
    );
};

export default ReviewSection;
