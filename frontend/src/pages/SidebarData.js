import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const SidebarData = [
    {
        title: "Dashboard",
        //icon: <DashboardIcon />,
        link: "/dashboard"
    },
    {
        title: "Saved Results",
        //icon: <BookmarkAddedIcon />,
        link: "/results"
    },
    {
        title: "My Profile",
       // icon: <PersonIcon />,
        link: "/profile"
    },
    {
        title: "CPR Tutorial",
       // icon: <OndemandVideoIcon />,
        link: "/tutorial"
    },
    {
        title: "User Guide",
       // icon: <MenuBookIcon />,
        link: "/userguide"
    },
    {
        title: "Admin",
       // icon: <AdminPanelSettingsIcon />,
        link: "/admin"
    },
    {
        title: "Organisation",
       // icon: <AdminPanelSettingsIcon />,
        link: "/organisation"
    },
];