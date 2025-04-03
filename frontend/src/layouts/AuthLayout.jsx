import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthLayout = () => {
    const currentUser = useSelector((state) => state.user.user);

    // Redirect logged-in users away from auth pages
    if (currentUser) {
        // Redirect based on user role
        switch (currentUser.role) {
            case 'student':
                return <Navigate to="/student/dashboard" replace />;
            case 'employee':
                return <Navigate to="/employee/dashboard" replace />;
            case 'family':
                return <Navigate to="/family/dashboard" replace />;
            case 'srcitizen':
                return <Navigate to="/senior/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return (
        <div className="min-h-screen w-full">
            <Outlet />
        </div>
    );
};

export default AuthLayout;