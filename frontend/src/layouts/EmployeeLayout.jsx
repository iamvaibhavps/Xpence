import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import NavbarList from '../components/NavbarList';

const EmployeeLayout = () => {
    const currentUser = useSelector((state) => state.user.user);

    const routeTitles = {
        "/employee/dashboard": `Hi, ${currentUser?.name}!`,
        "/employee/tasks/my-tasks": "My Tasks",
        "/employee/tasks/assigned-tasks": "Assigned Tasks",
        "/employee/tasks/create-task": "Create Tasks",
        "/employee/tasks/all-tasks": "All Tasks",
        "/employee/goals/my-goals": "My Goals",
        "/employee/goals/assigned-goals": "Assigned Goals",
        "/employee/goals/create-goal": "Create Goals",
        "/employee/goals/all-goals": "All Goals",
        "/employee/profile": "My Profile",
        "/employee/my-impact": "My Impact",
        "/employee/categories/teams-data": "Teams",
        "/employee/categories/team-performance": "Team Performance",
        "/employee/organization": "Organization",
        "/employee/people": "Users",
        "/employee/user-performance": "User Performance",
        "/employee/help": "Help",
        "/employee/settings": "Settings",
        "/employee/invite-users": "Invite Users",
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
