import React, {useState} from "react";
import { useLocation } from "react-router-dom";
import "../../assets/CSS/Dashboard.css";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RequestHelper from "../../RequestHelper";
import Session from "../../SessionParser";
import ResultsTable from "./ResultsTable";
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import { Grid } from "@mui/material";
import DropdownRole from "../DropdownRole";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function UsersTableList(props) {
  const [count, setCount] = React.useState(0);
  const [usersData, setUsersData] = React.useState([]);
  const [useAggregate, setUseAggregate] = React.useState(false);

  //Expanding tables
  // State variable to keep track of all the expanded rows
  const [expandedRows, setExpandedRows] = React.useState([]);

  // State variable to keep track which row is currently expanded
  const [expandState, setExpandedState] = React.useState([]);
    
  let query = useQuery();
  const location = useLocation();

  const handleExpandRow = (event, index) => {
    const currentExpandedRows = expandedRows;
    console.log("CurrentExpandedRows: ", currentExpandedRows);
    const isRowExpanded = currentExpandedRows.includes(index);

    let obj = {}
    isRowExpanded ? (obj[index] = false) : (obj[index] = true);
    setExpandedState(obj);

    // If the row has already been expanded, we are here to hide it
    // So we will remove it. Otherwise, add it
    const newExpandedRows = isRowExpanded ? 
      currentExpandedRows.filter(id => id !== index) :
      currentExpandedRows.concat(index);

      console.log("NewExpandedRows: ", newExpandedRows);
    setExpandedRows(newExpandedRows);
  }

  const selectShortlistedApplicant = (e) => {
    e.stopPropagation();
    setCount(document.querySelectorAll('input[type="checkbox"]:checked').length);
  };
  React.useEffect(() => {
    //List the supplied users
    if (location.state && location.state.peopleState) {
      console.log("location: ", location);
      setUsersData(location.state.peopleState);
    } else if (props.peopleData) {
      console.log("props: ", props);
      setUsersData(props.peopleData);
    }
  }, [props.peopleData, location.state]);

  let toggleIcon = useAggregate ? <ToggleOnIcon/> : <ToggleOffOutlinedIcon/>;

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Users</h3>
      <React.Fragment>
        
        {/*
        //Ultimately, we want to compare results on a separate page. Current method can easily become cluttered
        <button className="unlink-btn" 
                key="btn-compare"
                to={count > 1 ? `/compare?name=${query.get("name")}&count=${count}` : '#'}>Compare</button>

        */}
        <Grid container direction="row" alignItems="center" onClick={() => setUseAggregate(!useAggregate)}>
            {toggleIcon} Aggregate
        </Grid>
        <table className="widgetLgTable">
          
          <thead>
            <tr className="widgetLgTr" key="-1">
            <th className="widgetLgTh"></th>
            {usersData && usersData[0] && usersData[0].roleName && <th className="widgetLgTh">Role</th>}
            <th className="widgetLgTh">Username</th>
            <th className="widgetLgTh">Name</th>
          </tr>
          </thead>
          <tbody>
          {usersData ? usersData.map((user, index) => {
            console.log("expandedState: ", expandState);
            console.log("user: ", user);

            let isExpanded = expandedRows.includes(index);
            let icon = isExpanded ? <RemoveIcon/> : <AddIcon/>;
              return (
                <>
                <tr className="widgetLgTrClickable"
                    onClick={(event) => handleExpandRow(event, index)}
                    key={user.id}>
                  <td className="widgetLgTh">{icon}</td>
                  {/*user.roleName && <td className="widgetLgTh"><DropdownRole user={user} isListOpen={false}/></td>*/}<td className="widgetLgTh">{user.roleName}</td>
                  <td className="widgetLgTh">{user.username}</td>
                  <td className="widgetLgTh" key="name">{user.fName} {user.lName}</td>
                </tr>
                {isExpanded ? 
                  <tr className="widgetLgTr">
                    {/*<td className="widgetLgTh"><input type="checkbox" value="1"
                      onClick={(e) => {
                        selectShortlistedApplicant(e);
                      }}/>
                    </td>*/}
                    {/* ResultsTable also has a queryResult prop, which will query the backend for the user's results */}
                    {/* It's super bad to have inline css. I just need a quick hack to make the whole table look a little darker */}
                    <td className="widgetLgTh" colSpan="4">
                      <ResultsTable queryResult={user} aggregateResults={useAggregate}/>
                    </td>
                  </tr>
                : null}
                </>
              );
          }) : null}
          
          </tbody>
        </table>
      </React.Fragment>
    </div>
  );
}