export const duration = { micro: 0.12, medium: 0.32, page: 0.52 };
export const easing = { standard: [0.2, 0.9, 0.3, 1] };
export const spring = { default: { type: 'spring', stiffness: 300, damping: 30 } };

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: duration.medium } }
};

export const slideInUp = {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1, transition: spring.default }
};

export const cardEntrance = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: duration.medium, ease: easing.standard } },
    hover: { y: -4, scale: 1.01 },
    tap: { scale: 0.98 }
};
