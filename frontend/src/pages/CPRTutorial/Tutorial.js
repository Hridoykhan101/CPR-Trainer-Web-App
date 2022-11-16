import React from 'react';
import SideBar from '../../components/SideBar/SideBar';
import TutorialContent from './TutorialContent';
import '../../assets/CSS/SideBar.css'
import "../../assets/CSS/Dashboard.css";

function Tutorial() {
  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar/>
      </div>
      <div className="itemsContainer">
      <div className="homeWidgets">
        <TutorialContent/>
      </div>
      </div>
    </div>
  );
}

export default Tutorial;
