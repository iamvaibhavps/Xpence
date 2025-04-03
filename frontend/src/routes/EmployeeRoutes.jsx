import Profile from "../components/Profile";
import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../pages/Dashboard/EmployeeDashboard";
import MyExpenses from "../pages/Shared/MyExpenses";
import MyGroups from "../pages/Shared/MyGroups";
import MyImpact from "../pages/Shared/MyImpact";

export const EmployeeRoutes = {
    path: "employee/",
    element: <EmployeeLayout />,
    children: [
        {
            path: "dashboard",
            element: <EmployeeDashboard />,
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
