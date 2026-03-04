import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user } = useAuth();

    // In a real app, you might want a loading state while checking the user
    if (!user || user.role?.toLowerCase() !== 'admin') {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
