import Profile from "../components/profile";
import FamilyLayout from "../layouts/FamilyLayout";
import FamilyDashboard from "../pages/Dashboard/FamilyDashboard";
import GroupSplit from "../pages/Shared/GroupSplit";
import MyExpenses from "../pages/Shared/MyExpenses";
import MyGroups from "../pages/Shared/MyGroups";
import MyImpact from "../pages/Shared/MyImpact";

export const FamilyRoutes = {
    path: "family/",
    element: <FamilyLayout />,
    children: [
        {
            path: "dashboard",
            element: <FamilyDashboard />,
        },
        {
            path: "my-impact",
            element: <MyImpact />,
        },
        {
            path: "my-expenses",
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
        {
            path: "group-splits",
            element: <GroupSplit />,
        }
    ],
};