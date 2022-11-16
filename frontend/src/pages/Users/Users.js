import React, { useEffect, useState } from "react";
import "../../assets/CSS/Dashboard.css";
import "../../assets/CSS/SideBar.css";
import SideBar from "../../components/SideBar/SideBar";
import UsersTableList from "../../components/WidgetLg/UsersTableList";

export default function Users(props) {
  const [peopleData, setPeopleData] = useState();

  console.log("props.state: ", props.state);

  useEffect(() => {
    //The table will show the supplied people into a table
    if (props.state && props.state.peopleData) {
      setPeopleData(props.state.peopleData);
    }
}, [props.state])

  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar join={true} />
      </div>
      <div className="itemsContainer">
        <div className="homeWidgets">
          <UsersTableList peopleData={peopleData}/>
        </div>
      </div>
    </div>
  );
}