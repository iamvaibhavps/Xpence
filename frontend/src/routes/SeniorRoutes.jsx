// import Profile from "../components/Profile.jsx";
import SeniorCitizenLayout from "../layouts/SeniorCitizenLayout";
import SeniorDashboard from "../pages/Dashboard/SeniorDashboard";
import GroupSplit from "../pages/Shared/GroupSplit";
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
        // {
        //     path: "my-profile",
        //     element: <Profile />,
        // },
        {
            path: "group-splits",
            element: <GroupSplit />,
        }
    ],
};