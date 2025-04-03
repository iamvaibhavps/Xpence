import EmployeeLayout from "../layouts/EmployeeLayout";
import EmployeeDashboard from "../pages/Dashboard/EmployeeDashboard";

export const EmployeeRoutes = {
    path: "employee/",
    element: <EmployeeLayout />,
    children: [
        {
            path: "dashboard",
            element: <EmployeeDashboard />,
        },
    ],
};
