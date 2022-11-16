import React, { useEffect, useState } from "react";
import "../../assets/CSS/Dashboard.css";
import "../../assets/CSS/SideBar.css";
import SideBar from "../../components/SideBar/SideBar";
import WidgetDummies from "../../components/WidgetDummies";
import UsersTableList from "../../components/WidgetLg/UsersTableList";
import { roleToName } from "../../constants";
import RequestHelper from "../../RequestHelper";

export default function Users(props) {
  //Default Data For Dummies To Display
  const [dumData, setDumData] = useState();
  const [peopleData, setPeopleData] = useState();

  useEffect(() => {
    //Get people by organisation
    RequestHelper.createRequest('get', '/organisation/people', null).then(data => {
      let people = data.data;

      people = people.map(person => {return {roleName: roleToName(person.roleId), ...person}})

      console.log("People: ", people);
      setPeopleData(people);
    });

    //Get dummies by organisation
    RequestHelper.createRequest('get', '/dummy/byOrganisation', null).then(data => {
        let dummies = data.data;
        console.log("Dummies: ", dummies);
        setDumData(dummies);
    });
}, [])

  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar join={true} />
      </div>
      <div className="itemsContainer">
        <div className="homeWidgets">
          <UsersTableList peopleData={peopleData}/>
        </div>
        <div className="homeWidgets">
          <WidgetDummies dummyData={dumData} />
        </div>
      </div>
    </div>
  );
}