import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = 'product' }) => {
    if (type === 'product') {
        return (
            <div className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-footer">
                        <div className="skeleton-price"></div>
                        <div className="skeleton-button"></div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default LoadingSkeleton;
