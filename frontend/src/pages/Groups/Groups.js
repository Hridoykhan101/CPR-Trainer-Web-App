import SideBar from "../../components/SideBar/SideBar";
import "../../assets/CSS/SideBar.css";
import "../../assets/CSS/Dashboard.css";
import GroupsTableList from '../../components/WidgetLg/GroupsTableList';

const Groups = () => {
  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar />
      </div>
      <div className="itemsContainer">
        <div className="homeWidgets">
          <GroupsTableList />
        </div>
      </div>
    </div>
  );
};

export default Groups;
