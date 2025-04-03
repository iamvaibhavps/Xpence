import FamilyLayout from "../layouts/FamilyLayout";
import FamilyDashboard from "../pages/Dashboard/FamilyDashboard";

export const FamilyRoutes = {
    path: "family/",
    element: <FamilyLayout />,
    children: [
        {
            path: "dashboard",
            element: <FamilyDashboard />,
        },
    ],
};
