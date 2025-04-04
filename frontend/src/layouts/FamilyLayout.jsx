import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import NavbarList from '../components/NavbarList';

const FamilyLayout = () => {
    const currentUser = useSelector((state) => state.user.user);
    const location = useLocation();
    const routeTitles = {
        "/family/dashboard": `Hi, ${currentUser?.name}!`,
        "/family/my-impact": `My Impact`,
        "/family/my-transactions": "Transactions",
        "/family/notifications": "Notifications",
        "/family/profile": "Profile",
        "/family/my-groups": "My Group",
        "/family/my-expenses": "My Expenses",
        "/family/group-splits": "Splits",
    };

    const pageTitle = routeTitles[location?.pathname] || "Default Title";


    if (!currentUser) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (currentUser.role !== 'family') {
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

export default FamilyLayout;
