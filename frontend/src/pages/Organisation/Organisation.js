import React from "react";
import SideBar from "../../components/SideBar/SideBar";
import OrganisationTableList from "../../components/WidgetLg/OrganisationTableList";
import "../../assets/CSS/SideBar.css";
import "../../assets/CSS/Dashboard.css";

function Organisation(props) {
  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar join={props?.join} />
      </div>
      <div className="itemsContainer">
        <div className="homeWidgets">
          <OrganisationTableList />
        </div>
      </div>
    </div>
  );
}

export default Organisation;
