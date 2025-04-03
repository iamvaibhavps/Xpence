import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthRoutes } from './routes/Auth';
import { ToastContainer } from 'react-toastify';
import Homepage from './pages/Homepage';


const queryClient = new QueryClient();

const router = createBrowserRouter([

    {
        path: "/",
        element: <Homepage />,
    },

    AuthRoutes,

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