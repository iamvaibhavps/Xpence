import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";

export const StudentRoutes = {
    path: "student/",
    element: <StudentLayout />,
    children: [
        {
            path: "dashboard",
            element: <StudentDashboard />,
        },
    ],
};
