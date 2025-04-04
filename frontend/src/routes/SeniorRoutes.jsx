import Profile from "../components/profile";
import SeniorCitizenLayout from "../layouts/SeniorCitizenLayout";
import SeniorDashboard from "../pages/Dashboard/SeniorDashboard";
import MyExpenses from "../pages/Shared/MyExpenses";
import MyGroups from "../pages/Shared/MyGroups";
import MyImpact from "../pages/Shared/MyImpact";

export const SeniorRoutes = {
    path: "senior/",
    element: <SeniorCitizenLayout />,
    children: [
        {
            path: "dashboard",
            element: <SeniorDashboard />,
        },
        {
            path: "my-impact",
            element: <MyImpact />,
        },
        {
            path: "my-transactions",
            element: <MyExpenses />,
        },
        {
            path: "my-groups",
            element: <MyGroups />,
        },
        {
            path: "my-profile",
            element: <Profile />,
        },
    ],
};