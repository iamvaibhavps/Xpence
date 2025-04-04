import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import NavbarList from '../components/NavbarList';

const StudentLayout = () => {
    const currentUser = useSelector((state) => state.user.user);
    const location = useLocation();
    const routeTitles = {
        "/student/dashboard": `Hi, ${currentUser?.name}!`,
        "/student/my-impact": `My Impact`,
        "/student/my-transactions": "Transactions",
        "/student/notifications": "Notifications",
        "/student/profile": "Profile",
        "/student/my-groups": "My Group",
        "/student/my-expenses": "My Expenses",
        "/student/group-splits": "Splits",
    };

    const pageTitle = routeTitles[location?.pathname] || "Default Title";
    if (!currentUser) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (currentUser.role !== 'student') {
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

export default StudentLayout;
