import {useEffect} from "react";
import CloseIcon from "@mui/icons-material/Close";

import {
  LineChart,
  ResponsiveContainer,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea
} from "recharts";

const WaveformChart = ({waveform, graphRef, showSelf}) => {
  return (
    <div className='graph-cont'>
      {showSelf && <CloseIcon onClick={() => showSelf(false)}/>}
      <ResponsiveContainer width="100%" aspect={5 / 1} align>
        <LineChart data={waveform}>
          <ReferenceArea y2={5} fill="lime"/>
          <ReferenceArea y2={50} y1={60} fill="lime"/>
          <XAxis stroke="#3a3782" dataKey="x" />
          <YAxis domain={[0, 70]}/>
          <Line type="linear" dataKey="y" stroke="#3a3782" dot={false} />
          
          <Tooltip animationDuration={100} content={ <CustomToolTip graphCont={graphRef} /> } />
          <CartesianGrid stroke="#e0dfdf" strokeDasharray="1 1" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomToolTip = ({active, payload, label, clickHandler, graphCont}) => {
  useEffect(() => {
    if(active){
        //graphCont.current.addEventListener('click', clickHandler);
        //console.log('ACTIVE');
    }else{
        //graphCont.current.removeEventListener('click', clickHandler);
        //console.log('INACTIVE');
    }
  }, [active])

  if(active){
    return(
      <div className='custom-tip'>
        <p>Depth: {payload[0].payload["y"].toFixed(2)}mm</p>
        <p>Time: {payload[0].payload["x"]}s</p>
       {/*<p className='custom-tip-blue'>Active Users: {payload[0].payload["Active User"]}</p>*/}
      </div>
    )
  }
  return null;
}

export default WaveformChart;
