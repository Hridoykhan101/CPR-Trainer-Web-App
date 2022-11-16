import React from 'react';
import SideBar from '../../components/SideBar/SideBar';
import AdminMenu from './AdminMenu';
import '../../assets/CSS/SideBar.css'
import "../../assets/CSS/Dashboard.css";

function Admin() {
  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar/>
      </div>
      <div className="itemsContainer">
      <div className="homeWidgets">
        <AdminMenu/>
      </div>
      </div>
    </div>
  );
}

export default Admin;
