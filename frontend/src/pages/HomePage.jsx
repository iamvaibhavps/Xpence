import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const currentUser = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            // Redirect to the appropriate dashboard based on role
            switch (currentUser.role) {
                case 'student':
                    navigate('/student/dashboard');
                    break;
                case 'employee':
                    navigate('/employee/dashboard');
                    break;
                case 'family':
                    navigate('/family/dashboard');
                    break;
                case 'srcitizen':
                    navigate('/senior/dashboard');
                    break;
                default:
                    // If no valid role, stay on homepage
                    break;
            }
        }
    }, [currentUser, navigate]);

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
            <div className='text-center p-8 bg-white rounded-lg shadow-md'>
                <h1 className='text-3xl font-bold mb-4'>Welcome to Smart Expense Management</h1>
                <p className='mb-8'>Your personal finance companion</p>
                
                {!currentUser ? (
                    <div className='space-x-4'>
                        <button 
                            onClick={() => navigate('/auth/sign-in')}
                            className='px-6 py-2 bg-black text-white rounded-full'
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => navigate('/auth/sign-up')}
                            className='px-6 py-2 border border-black rounded-full'
                        >
                            Sign Up
                        </button>
                    </div>
                ) : (
                    <p>Redirecting to your dashboard...</p>
                )}
            </div>
        </div>
    );
}
