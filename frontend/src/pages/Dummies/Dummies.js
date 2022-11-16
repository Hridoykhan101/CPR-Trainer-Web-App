import { useEffect, useState } from "react";
import SideBar from '../../components/SideBar/SideBar';
import WidgetDummies from '../../components/WidgetDummies';
import '../../assets/CSS/SideBar.css';
import "../../assets/CSS/Dashboard.css"; 
import RequestHelper from "../../RequestHelper";


let Dummies = () => {
    const [dumData, setDumData] = useState();

    //Get Owned Dummies
    useEffect(() => {
        RequestHelper.createRequest('get', '/dummy', null).then(data => {
            let dummies = data.data;
            console.log("Dummies: ", dummies);
            setDumData(dummies);
        });
    }, [])

    return(
    <div className="dashboard">
        <div className="SideBarContainer">
          <SideBar/>
        </div>
        <div className="itemsContainer">
            <div className="homeWidgets">
                <WidgetDummies dummyData={dumData} />
            </div>
        </div>
      </div>
    )
}

export default Dummies;