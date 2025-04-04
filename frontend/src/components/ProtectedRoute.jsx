import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const currentUser = useSelector((state) => state.user.user);

    if (!currentUser) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    // Render children or outlet based on which is provided
    return children ? children : <Outlet />;
};

export default ProtectedRoute;