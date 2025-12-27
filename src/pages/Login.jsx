import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';

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
            showToast('Welcome back! Logged in successfully', 'success');
            navigate('/');
        } catch (error) {
            showToast(error.message || 'Login failed. Please check your credentials.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="login-page">
                <motion.div
                    className="login-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to your Fruits Aura account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
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
                            <label htmlFor="password">Password</label>
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
                            type="submit"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="login-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="link">Sign up</Link>
                        </p>
                    </div>

                    <div className="demo-credentials">
                        <p>Demo Admin Account:</p>
                        <p className="credentials-text">
                            Email: <code>admin@fruitsaura.com</code><br />
                            Password: <code>Admin123!</code>
                        </p>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
}
