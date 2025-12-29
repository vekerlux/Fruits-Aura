/**
 * Currency Utilities for Nigerian Naira
 */

export const formatNaira = (amount) => {
    if (amount === undefined || amount === null) return '₦0.00';

    // Convert to number if string
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Format with thousands separator
    return `₦${num.toLocaleString('en-NG', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
};

export const formatNairaWithoutDecimals = (amount) => {
    if (amount === undefined || amount === null) return '₦0';

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    return `₦${num.toLocaleString('en-NG', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}`;
};

export const parseNaira = (nairaString) => {
    if (!nairaString) return 0;
    // Remove ₦ symbol and commas, then parse
    return parseFloat(nairaString.replace(/[₦,]/g, ''));
};
