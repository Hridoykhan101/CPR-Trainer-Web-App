import DashboardIcon from "@material-ui/icons/Dashboard";
import BookmarkAddedIcon from "@material-ui/icons/Bookmark";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ApartmentIcon from "@material-ui/icons//Apartment";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ArticleIcon from '@mui/icons-material/Article';
import GroupIcon from '@mui/icons-material/Group';

export const SideBarData = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/dashboard"
  },
  {
    title: "My Results",
    icon: <BookmarkAddedIcon />,
    link: "/results"
  },
  {
    title: "My Mannequins",
    icon: <ArticleIcon />,
    link: "/dummies"
  },
  {
    title: "My Groups",
    icon: <GroupIcon />,
    link: "/groups"
  },
  {
    title: "Organisations",
    icon: <ApartmentIcon />,
    link: "/organisation"
  }
];

export const SideBarOrganisationData = [
  {
    title: "Manage Users",
    icon: <PeopleAltIcon />,
    link: "/"
  },
  {
    title: "Manage Organisation",
    icon: <ApartmentIcon />,
    link: "/organisation"
  }
];
