import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldCheck, Loader, CreditCard, X } from 'lucide-react';
import Button from './Button';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, amount, onSuccess }) => {
    const [step, setStep] = useState('input'); // input, processing, success, error

    useEffect(() => {
        if (isOpen) {
            setStep('input');
        }
    }, [isOpen]);

    const handlePay = () => {
        setStep('processing');
        // Simulate network delay
        setTimeout(() => {
            setStep('success');
            // Wait a bit before closing/triggering success
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="payment-modal-overlay">
                <motion.div
                    className="payment-modal"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                >
                    {step === 'input' && (
                        <>
                            <div className="modal-header">
                                <ShieldCheck size={24} className="security-icon" />
                                <h3>Secure Payment</h3>
                                <button className="close-btn" onClick={onClose}><X size={20} /></button>
                            </div>
                            <div className="modal-body">
                                <div className="amount-display">
                                    <span className="currency">NGN</span>
                                    <span className="amount">{amount.toLocaleString()}</span>
                                </div>
                                <div className="card-mock">
                                    <div className="card-chip"></div>
                                    <p className="card-number">**** **** **** 4242</p>
                                    <div className="card-footer">
                                        <span>John Doe</span>
                                        <span>12/25</span>
                                    </div>
                                </div>
                                <Button variant="primary" onClick={handlePay} className="pay-btn">
                                    Pay NGN {amount.toLocaleString()}
                                </Button>
                                <p className="secure-note">
                                    <ShieldCheck size={12} /> Encrypted & Secure
                                </p>
                            </div>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className="modal-status">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <Loader size={48} className="spinner" />
                            </motion.div>
                            <h3>Processing Payment...</h3>
                            <p>Please do not close this window</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="modal-status success">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            >
                                <CheckCircle size={64} className="success-icon" />
                            </motion.div>
                            <h3>Payment Successful!</h3>
                            <p>Redirecting you...</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
