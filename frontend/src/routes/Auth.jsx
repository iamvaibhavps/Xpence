import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";




export const AuthRoutes = {
    path: "auth/",
    element: <AuthLayout />,
    children: [
        {
            path: "sign-in",
            element: <Login />,
        },
        {
            path: "sign-up",
            element: <Register />,
        },
    ],
}