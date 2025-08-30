import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthRoutes } from './routes/Auth';
import { StudentRoutes } from './routes/StudentRoutes';
import { EmployeeRoutes } from './routes/EmployeeRoutes';
import { FamilyRoutes } from './routes/FamilyRoutes';
import { SeniorRoutes } from './routes/SeniorRoutes';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage.jsx';


const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    AuthRoutes,
    StudentRoutes,
    EmployeeRoutes,
    FamilyRoutes,
    SeniorRoutes,
]);

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
                <ToastContainer />
            </QueryClientProvider>
        </>
    );
}

export default App;