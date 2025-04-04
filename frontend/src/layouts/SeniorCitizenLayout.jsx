import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import NavbarList from '../components/NavbarList';

const SeniorCitizenLayout = () => {
    const currentUser = useSelector((state) => state.user.user);
    const location = useLocation();
    const routeTitles = {
        "/srcitizen/dashboard": `Hi, ${currentUser?.name}!`,
        "/srcitizen/my-impact": `My Impact`,
        "/srcitizen/my-transactions": "Transactions",
        "/srcitizen/notifications": "Notifications",
        "/srcitizen/profile": "Profile",
        "/srcitizen/my-groups": "My Group",
        "/srcitizen/my-expenses": "My Expenses",
        "/srcitizen/group-splits": "Splits",
    };

    const pageTitle = routeTitles[location?.pathname] || "Default Title";
    if (!currentUser) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (currentUser.role !== 'srcitizen') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <NavbarList title={pageTitle} />
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SeniorCitizenLayout;
