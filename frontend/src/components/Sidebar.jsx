import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
} from "@material-tailwind/react";

import { commonList } from "./SidebarLists/commonList";

const renderSidebarItems = (items) => {

    return items.map((item, index) => (
        <ListItem key={index} className="p-3 mb-3">
            <ListItemPrefix>
                <item.icon className="h-5 w-5" strokeWidth={2} />
            </ListItemPrefix>
            {item.name}
        </ListItem>
    ));
}

export default function Sidebar() {
    return (
        <Card className="h-[calc(100vh)] w-64 p-4 shadow-xl shadow-blue-gray-900/5 border-r ">
            <div className="mb-2 p-4">
                <Typography variant="h5" color="blue-gray">
                    Sidebar
                </Typography>
                <div className="mt-8 flex flex-col items-center gap-2">
                    {renderSidebarItems(commonList)}
                </div>
            </div>


        </Card>
    );
}