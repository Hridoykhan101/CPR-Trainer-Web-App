import React from 'react';
import SideBar from '../../components/SideBar/SideBar';
import '../../assets/CSS/SideBar.css'
import "../../assets/CSS/Dashboard.css";

function Profile() {
  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar/>
      </div>
      <div className="itemsContainer">
      <h1>Profile</h1>
      </div>
    </div>
  );
}

export default Profile;
