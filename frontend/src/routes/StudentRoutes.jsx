import Profile from "../components/profile";
// import Profile from "../components/Profile";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";
import MyExpenses from "../pages/Shared/MyExpenses";
import MyGroups from "../pages/Shared/MyGroups";
import MyImpact from "../pages/Shared/MyImpact";

export const StudentRoutes = {
    path: "student/",
    element: <StudentLayout />,
    children: [
        {
            path: "dashboard",
            element: <StudentDashboard />,
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