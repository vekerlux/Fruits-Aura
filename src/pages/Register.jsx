import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import './Register.css';

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
            showToast('Passwords do not match', 'error');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            showToast('Account created successfully! Welcome to Fruits Aura', 'success');
            navigate('/');
        } catch (error) {
            showToast(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="register-page">
                <motion.div
                    className="register-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="register-header">
                        <h1>Create Account</h1>
                        <p>Join Fruits Aura and start your healthy journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                autoComplete="name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Account Type</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="consumer">Consumer (Personal Use)</option>
                                <option value="distributor">Distributor (Business)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
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
                            <label htmlFor="confirmPassword">Confirm Password</label>
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
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="register-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="link">Sign in</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
