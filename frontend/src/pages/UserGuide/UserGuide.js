import React from 'react';
import SideBar from '../../components/SideBar/SideBar';
import UserGuideContent from './UserGuideContent';
import '../../assets/CSS/SideBar.css'
import "../../assets/CSS/Dashboard.css";

function UserGuide() {
  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar/>
      </div>
      <div className="itemsContainer">
      <div className="homeWidgets">
        <UserGuideContent/>
      </div>
      </div>
    </div>
  );
}

export default UserGuide;
