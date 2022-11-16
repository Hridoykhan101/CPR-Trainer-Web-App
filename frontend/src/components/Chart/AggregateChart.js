import '../../assets/CSS/Dashboard.css';
import '../../assets/CSS/Chart.css';
import { useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Brush
} from "recharts";
import { useState } from 'react';
import CprChart from './WaveformChart';
import Session from "../../SessionParser";
import { mysqlDatetimeToStringDate, mysqlDatetimeToString } from '../../misc';

export default function AggregateChart({ title, data, graphRef, aspect }) {

  const [showGraphModal, setShowGraphModal] = useState(false);
  const [showWaveform, setShowResult] = useState();
  
  useEffect(() => {
    if(showGraphModal){
      //console.log('Show Modal Just Now');
    }
  }, [showGraphModal]);

  if (data) {
      return (
        <div className="chart position-relative">
          { showGraphModal &&
          <div className='chart-modal'>
            <CprChart showSelf={setShowGraphModal} waveform={showWaveform} />
          </div>}
          
            <div ref={graphRef}>
              <h3 className="chartTitle">{title}</h3>
              {(data && data.length) ?
              <div className='graph-cont'>
                <ResponsiveContainer width="100%" aspect={aspect || (3 / 1)} align>
                  <LineChart data={data} onClick={onPointClick}>
                    <ReferenceArea y2={100} y1={120} fill="lime"/>
                    <XAxis dataKey="createdDatetime" tickFormatter={formatDate}/>
                    <YAxis domain={[0,120]} interval="preserveStartEnd"/>
                    <Line type="linear" dataKey="compressionFrequency" stroke="#5550bd"/>

                    {<Tooltip animationDuration={100} content={ <CustomToolTip graphCont={graphRef} /> } />}
                    <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />

                    <Brush/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              : <p>No results are available</p>}
            </div>
        </div>
      );
    } else {
      return null;
    }

    function onPointClick(point) {
      if (point) {
        setShowGraphModal(true)
        setShowResult(data[point.activeTooltipIndex].waveform);
      }
      //console.log(point);
    }
};



const formatDate = function (mysqlDatetime) {
  return mysqlDatetimeToStringDate(mysqlDatetime);
}

const CustomToolTip = ({active, payload, label, clickHandler, graphCont}) => {
  useEffect(() => {
    if(active){
        graphCont.current.addEventListener('click', clickHandler);
        //console.log('ACTIVE');
    }else{
        graphCont.current.removeEventListener('click', clickHandler);
        //console.log('INACTIVE');
    }
  }, [active])

  if(active && payload && payload.length){
      return(
        <div className='custom-tip'>
          <p>Duration: {payload[0].payload["sessionTime"] / 60000}m</p>
          <p>Created: {mysqlDatetimeToString(payload[0].payload["createdDatetime"])}</p>
          <p>C/M: {payload[0].payload["compressionFrequency"]}</p>
        </div>
      )
  }
  return null;
}
