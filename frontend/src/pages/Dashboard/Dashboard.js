import React, {useRef} from 'react';
import SideBar from '../../components/SideBar/SideBar.js';
import AggregateChart from '../../components/Chart/AggregateChart';
import "../../assets/CSS/SideBar.css";
import "../../assets/CSS/Dashboard.css";
import { useEffect, useState } from 'react';
import RequestHelper from "../../RequestHelper";
import Session from "../../SessionParser";

function Dashboard() {

  const [sessionData, setSessionData] = useState();
  const graphRef = useRef();

  //Get Owned Dummies
  useEffect(() => {
      RequestHelper.createRequest('get', '/result/person', null).then(res => {
          let results = res.data;

          let sessions = new Array(results.length);

          //With the supplied results, we wil calculate the C/M for each result, and use that as a key for drawing the results
          for(var i=0; i<results.length; i++) {
            //Parse the result
            sessions[i] = new Session(results[i]);
          }
          
          setSessionData(sessions);
      });
  }, [])

  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar/>
      </div>
      <div className="itemsContainer">
        <div className="chartContainer">
          <AggregateChart data={sessionData} graphRef={graphRef} title="Overall results"/>
        </div>
        {/*<div className="FeaturedInfoContainer">
          <FeaturedInfo/>
        </div>*/}
      </div>
    </div>
  );
}

export default Dashboard;
