import React from 'react';
import { useSelector } from 'react-redux';

const FamilyDashboard = () => {
    const currentUser = useSelector((state) => state.user.user);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Family Dashboard</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="mb-4">Welcome, {currentUser?.name}!</p>
                <p>This is the family dashboard where you can manage household expenses and budget.</p>
            </div>
        </div>
    );
};

export default FamilyDashboard;
