import { useEffect, useState } from "react";
import SideBar from '../../components/SideBar/SideBar';
import '../../assets/CSS/SideBar.css'
import "../../assets/CSS/Dashboard.css";
import ResultsTable from '../../components/WidgetLg/ResultsTable';
import RequestHelper from '../../RequestHelper';

function Results() {
  const [resultData, setResultData] = useState();

  //Get Own results
  useEffect(() => {
    RequestHelper.createRequest('get', '/result/person', null).then(results => {
      //We need to convert the results to include metadata which includes the name of the user

      //Actual result data
      let dbResults = results.data;
      setResultData(dbResults);
    });
  }, []);

  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar/>
      </div>
      <div className="itemsContainer">
        <div className="homeWidgets">
          <ResultsTable resultData={resultData} title="My results"/>
        </div>
      </div>
    </div>
  );
}

export default Results;
