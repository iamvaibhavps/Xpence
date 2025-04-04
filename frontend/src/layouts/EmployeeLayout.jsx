import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import NavbarList from '../components/NavbarList';
import Chatbot from '../pages/Chatbot';
const EmployeeLayout = () => {
    const currentUser = useSelector((state) => state.user.user);
    const location = useLocation();
    const routeTitles = {
        "/employee/dashboard": `Hi, ${currentUser?.name}!`,
        "/employee/my-impact": `My Impact`,
        "/employee/my-transactions": "Transactions",
        "/employee/notifications": "Notifications",
        "/employee/profile": "Profile",
        "/employee/my-groups": "My Group",
        "/employee/my-expenses": "My Expenses",
        "/employee/group-splits": "Splits",
    };

    const pageTitle = routeTitles[location?.pathname] || "Default Title";
    if (!currentUser) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (currentUser.role !== 'employee') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <Chatbot />
            <div className="flex flex-col flex-1 overflow-hidden">
                <NavbarList title={pageTitle} />
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default EmployeeLayout;
