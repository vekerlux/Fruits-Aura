import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import './Auth.css';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'consumer',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            showToast('Aura mismatch: Passwords do not match', 'error');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            showToast('Security alert: Access Key must be at least 6 characters', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            showToast('Account initialized! Welcome to the garden.', 'success');
            navigate('/');
        } catch (error) {
            showToast(error.message || 'Initialization failed. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="auth-page">
                <motion.div
                    className="auth-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, type: "spring" }}
                >
                    <div className="auth-header">
                        <img src="/images/fruits-aura-logo.png" alt="Fruits Aura" className="auth-logo" />
                        <h1>Grow Your Aura</h1>
                        <p>Join the future of fresh wellness</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Identity</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                                autoComplete="name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Identity</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@email.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Aura Type</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="consumer">Consumer (Standard)</option>
                                <option value="distributor">Distributor (Premium)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Access Key</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="At least 6 characters"
                                required
                                autoComplete="new-password"
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Re-enter Key</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <Button
                            className="auth-btn"
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Initializing...' : 'Plant Account'}
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already planted?{' '}
                            <Link to="/login" className="auth-link">Login here</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
