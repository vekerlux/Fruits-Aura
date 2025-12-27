import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import Button from './Button';
import './AddReview.css';

const AddReview = ({ productName, onSubmit, onClose }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [author, setAuthor] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!author.trim()) {
            newErrors.author = 'Name is required';
        }

        if (rating === 0) {
            newErrors.rating = 'Please select a rating';
        }

        if (!comment.trim()) {
            newErrors.comment = 'Review comment is required';
        } else if (comment.trim().length < 10) {
            newErrors.comment = 'Review must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const review = {
                id: Date.now(),
                author: author.trim(),
                rating,
                comment: comment.trim(),
                date: new Date().toISOString().split('T')[0],
                helpful: 0
            };

            onSubmit(review);

            // Reset form
            setRating(0);
            setComment('');
            setAuthor('');
            setErrors({});
        }
    };

    return (
        <motion.div
            className="add-review-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="add-review-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="review-modal-header">
                    <h3>Write a Review</h3>
                    <button className="close-btn" onClick={onClose} aria-label="Close review form">
                        <X size={24} />
                    </button>
                </div>

                <p className="review-product-name">for {productName}</p>

                <form onSubmit={handleSubmit} className="review-form">
                    <div className="form-group">
                        <label htmlFor="reviewer-name">Your Name *</label>
                        <input
                            id="reviewer-name"
                            type="text"
                            className={`form-input ${errors.author ? 'error' : ''}`}
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Enter your name"
                            aria-required="true"
                            aria-invalid={!!errors.author}
                            aria-describedby={errors.author ? "author-error" : undefined}
                        />
                        {errors.author && <span id="author-error" className="error-text">{errors.author}</span>}
                    </div>

                    <div className="form-group">
                        <label>Your Rating *</label>
                        <div className="star-rating-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                    key={star}
                                    type="button"
                                    className="star-btn"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={`Rate ${star} stars`}
                                >
                                    <Star
                                        size={32}
                                        fill={(hoverRating || rating) >= star ? "#FDD835" : "none"}
                                        color="#FDD835"
                                    />
                                </motion.button>
                            ))}
                        </div>
                        {errors.rating && <span className="error-text">{errors.rating}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="review-comment">Your Review *</label>
                        <textarea
                            id="review-comment"
                            className={`form-textarea ${errors.comment ? 'error' : ''}`}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts about this product..."
                            rows="5"
                            aria-required="true"
                            aria-invalid={!!errors.comment}
                            aria-describedby={errors.comment ? "comment-error" : undefined}
                        />
                        <div className="char-count">{comment.length} characters</div>
                        {errors.comment && <span id="comment-error" className="error-text">{errors.comment}</span>}
                    </div>

                    <div className="form-actions">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Submit Review
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AddReview;
