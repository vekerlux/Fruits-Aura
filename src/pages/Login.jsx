import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        setIsLoading(true);

        try {
            await login(formData);
            showToast('Welcome back! Fresh aura incoming.', 'success');
            navigate('/');
        } catch (error) {
            showToast(error.message || 'Verification failed. Please check your credentials.', 'error');
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
                        <h1>Welcome Back</h1>
                        <p>Sign in to refresh your aura</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
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
                            <label htmlFor="password">Access Key</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <Button
                            className="auth-btn"
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Decrypting...' : 'Enter Aura'}
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            New to the garden?{' '}
                            <Link to="/register" className="auth-link">Plant an account</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
