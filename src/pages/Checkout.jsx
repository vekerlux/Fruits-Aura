import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, MapPin, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatNaira, formatNairaWithoutDecimals } from '../utils/currency';
import { createOrder } from '../api/ordersApi';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { showToast } = useToast();
    const { user } = useAuth();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Please login to place an order', 'error');
            navigate('/login', { state: { from: '/checkout' } });
        }
    }, [navigate, showToast]);

    // Calculate totals and limits
    const { deliveryFee, limitError } = useMemo(() => {
        let bottles = 0;
        let bundles = 0;
        let fee = 0;
        let error = null;

        cart.forEach(item => {
            const isBundle = item.name.toLowerCase().includes('auraset') || item.isBundle;
            if (isBundle) {
                bundles += item.quantity;
                bottles += item.quantity * 5;
            } else {
                bottles += item.quantity;
            }
        });

        // Delivery Fee Logic (Abakaliki)
        if (bundles > 0 || bottles >= 5) fee = 2000;
        else if (bottles === 4) fee = 1500;
        else if (bottles === 3) fee = 1500;
        else if (bottles === 2) fee = 1200;
        else if (bottles === 1) fee = 700;

        // Limit Logic
        if (user) {
            const isDistributor = user.role === 'distributor';
            const bottleLimit = isDistributor ? 50 : 20;
            const bundleLimit = isDistributor ? 10 : 3;

            if (bottles > bottleLimit) {
                error = `Order exceeds daily limit of ${bottleLimit} bottles.`;
            } else if (bundles > bundleLimit) {
                error = `Order exceeds daily limit of ${bundleLimit} Aurasets.`;
            }
        }

        return { deliveryFee: fee, limitError: error };
    }, [cart, user]);

    const orderTotal = getCartTotal() + deliveryFee;

    const handleInitiatePayment = () => {
        if (limitError) {
            showToast(limitError, 'error');
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async () => {
        setIsPlacingOrder(true);
        // Modal stays open showing success state while we create order in background
        // Wait a tiny bit for the modal success animation to play out fully if needed,
        // but the modal component handles its own delay before calling onSuccess.
        // Actually, PaymentModal calls onSuccess AFTER the success animation.
        // So we can proceed immediately.

        try {
            // Format cart items for backend
            const items = cart.map(item => ({
                productId: String(item.id).replace('-bundle', ''),
                name: item.name,
                price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price,
                quantity: item.quantity,
                subtotal: (typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price) * item.quantity,
                isBundle: item.isBundle || item.name.toLowerCase().includes('auraset')
            }));

            const orderData = {
                items,
                total: orderTotal,
                deliveryAddress: {
                    street: '123 Main Street, Apt 4B',
                    city: 'City Center',
                    zipCode: '12345'
                },
                deliveryInstructions: 'Please ring doorbell',
                paymentStatus: 'paid', // Mark as paid since simulation succeeded
                paymentMethod: 'card'
            };

            const response = await createOrder(orderData);

            if (response.success) {
                clearCart();
                setShowPaymentModal(false);
                showToast('Order placed successfully!', 'success');
                navigate('/track');
            }
        } catch (error) {
            console.error('Order placement error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
            showToast(errorMessage, 'error');
            setShowPaymentModal(false);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (cart.length === 0) {
        return (
            <PageTransition>
                <div className="checkout-container">
                    <div className="empty-checkout">
                        <h2>Your cart is empty</h2>
                        <Button variant="primary" onClick={() => navigate('/menu')}>
                            Browse Menu
                        </Button>
                    </div>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="checkout-container">
                <div className="checkout-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Checkout</h2>
                </div>

                <div className="checkout-content">
                    {limitError && (
                        <div className="limit-warning">
                            <AlertCircle size={20} />
                            <p>{limitError}</p>
                        </div>
                    )}

                    {/* Order Summary */}
                    <section className="checkout-section">
                        <h3>Order Summary</h3>
                        <div className="order-items">
                            {cart.map((item) => (
                                <div key={item.id} className="checkout-item">
                                    <div className="item-details">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">× {item.quantity}</span>
                                    </div>
                                    <span className="item-price">
                                        ${(typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price) * item.quantity.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-rows">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatNairaWithoutDecimals(getCartTotal())}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery Fee</span>
                                <span>{formatNairaWithoutDecimals(deliveryFee)}</span>
                            </div>
                            <div className="total-row">
                                <span>Total</span>
                                <span className="total-amount">{formatNairaWithoutDecimals(orderTotal)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Delivery Address */}
                    <section className="checkout-section">
                        <h3><MapPin size={18} /> Delivery Address</h3>
                        <div className="info-card">
                            <p className="address-text">123 Main Street, Apt 4B</p>
                            <p className="address-subtext">City Center, 12345</p>
                            <button className="change-btn">Change</button>
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section className="checkout-section">
                        <h3><CreditCard size={18} /> Payment Method</h3>
                        <div className="info-card">
                            <p className="payment-text">•••• •••• •••• 4242</p>
                            <p className="payment-subtext">Expires 12/25</p>
                            <button className="change-btn">Change</button>
                        </div>
                    </section>
                </div>

                <div className="checkout-footer">
                    <Button
                        variant="primary"
                        className="place-order-btn"
                        onClick={handleInitiatePayment}
                        disabled={isPlacingOrder || limitError}
                    >
                        {isPlacingOrder ? 'Processing...' : `Pay Now • ${formatNairaWithoutDecimals(orderTotal)}`}
                    </Button>
                </div>

                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    amount={orderTotal}
                    onSuccess={handlePaymentSuccess}
                />
            </div>
        </PageTransition>
    );
};

export default Checkout;
