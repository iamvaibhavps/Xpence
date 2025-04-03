import SeniorCitizenLayout from "../layouts/SeniorCitizenLayout";
import SeniorDashboard from "../pages/Dashboard/SeniorDashboard";

export const SeniorRoutes = {
    path: "senior/",
    element: <SeniorCitizenLayout />,
    children: [
        {
            path: "dashboard",
            element: <SeniorDashboard />,
        },
    ],
};
