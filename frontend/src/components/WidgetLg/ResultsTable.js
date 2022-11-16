import React, {useState, useEffect, useRef} from "react";
import "../../assets/CSS/Dashboard.css";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RequestHelper from "../../RequestHelper";
import Session from "../../SessionParser";
import WaveformChart from "../Chart/WaveformChart";
import {mysqlDatetimeToString} from "../../misc";
import AggregateChart from "../Chart/AggregateChart";


export default function ResultsTable(props) {
  const [resultData, setResultData] = useState();

  //Expanding tables
  // State variable to keep track of all the expanded rows
  const [expandedRows, setExpandedRows] = React.useState([]);

  // State variable to keep track which row is currently expanded
  const [expandState, setExpandedState] = React.useState([]);

  const graphRef = React.useRef();


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

  React.useEffect(() => {
    console.log("Results table updated: ", props.resultData);
    if (props.resultData) {
      setResultData(props.resultData);
    } else if (props.queryResult) {
      RequestHelper.createRequest('get', `/result/person/${props.queryResult.id}`, null).then(res => {
        console.log("response: ", res);
        let personResults = res.data;

        setResultData(personResults);
      });
    }
  }, [props.resultData, props.queryResult]);

  if (props.aggregateResults) {//First, need to convert the resultData into a sesion array
    console.log("resultData: ", resultData);
    if (resultData && resultData.length) {
      let sessions = new Array(resultData.length);

      for(var i=0; i<resultData.length; i++) {
        sessions[i] = new Session(resultData[i]);
      }

      console.log("Parsed sessions: ", sessions);

      return <AggregateChart aspect={5} data={sessions} graphRef={graphRef}/>
    } else {
      return <NoSessions/>
    }
  } else {
    return (
      <div className="widgetLg">
        <h3 className="chartTitle">{props.title}</h3>
        <table className="widgetLgTable">
          <thead>
            <tr className="widgetLgTr" key="-1">
            <th className="widgetLgTh"></th>
              <th className="widgetLgTh">C/M</th>
              <th className="widgetLgTh">Session Time</th>
              <th className="widgetLgTh">Created</th>
            </tr>
          </thead>
          <tbody>
            {resultData && resultData.length ? (
                resultData.map((result, ind) => {
                  let isExpanded = expandedRows.includes(ind)
                  
                  let icon = isExpanded ? <RemoveIcon/> : <AddIcon/>;

                  // Additional session calculations for displaying
                  let session = new Session(result);
                  let waveform = session.waveform;
                  console.log("waveform: ", waveform);

                  return (
                    <>
                    <tr className="widgetLgTrClickable" 
                        key={ind}
                        onClick={(event) => handleExpandRow(event, ind)}>
                      
                      <td className="widgetLgTh">{icon}</td>
                      <td className="widgetLgTh">{session.compressionFrequency}</td>
                      <td className="widgetLgTh">{session.sessionTime / 60000}m</td>
                      <td className="widgetLgDate">{mysqlDatetimeToString(result.createdDatetime)}</td>
                    </tr>
                    {isExpanded ? 
                    <tr>
                      <td className="widgetLgDate" colSpan="4">
                        <div className="chartContainer">
                          <WaveformChart waveform={waveform} graphCont={graphRef}/>
                        </div>
                      </td>
                    </tr> : null
                    }
                    </>
                  );
              })) : 
              <NoSessions/>
            }
          </tbody>
        </table>
      </div>
    )
  }
}

const NoSessions = function() {
  return (<tr key="-1">
  <td colSpan="2" className="widgetLgTh">No sessions exist...</td>
</tr>)
}