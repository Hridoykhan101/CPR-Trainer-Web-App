import React from 'react';
import SideBar from '../../components/SideBar/SideBar.js';
import { UsersData } from "../../components/WidgetLg/UsersData";
import "../../assets/CSS/SideBar.css";
import "../../assets/CSS/Dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { BrowserRouter as useLocation } from "react-router-dom";


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Dashboard() {
  let query = useQuery();

  console.log(query.get("count"))
  return (
    <div className="dashboard">
      <div className="SideBarContainer">
        <SideBar join={true} />
      </div>
      <div className="itemsContainer">
        <div className="chartContainer compareChartContainer">
          {
            Array.from(Array(parseInt(query.get("count"))), (e, i) => {
              return (<Chart data={userData} title={UsersData[i].firstName + " " + UsersData[i].lastName}
                grid dataKey="Average Comp rate" />)
            })
          }
        </div>
        <div>
        </div>
        <div className="widgetLg flex m-20 compare-flex">
          {
            Array.from(Array(parseInt(query.get("count"))), (e, i) => {
              return (
                <Box sx={{ width: "100%" }}>
                  <h2 className="summary">Summary: {UsersData[i].firstName + " " + UsersData[i].lastName}</h2>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={6}>
                      <Item>Duration: {UsersData[i].duration}</Item>
                    </Grid>
                    <Grid item xs={6}>
                      <Item>Average Comp rate: {UsersData[i].avg_compare}</Item>
                    </Grid>
                  </Grid>
                </Box>
              )
            })
          }
        </div>
      </div>

    </div>
  );
}



export function Chart({ title, data, dataKey, grid }) {

  return (
    <div className="chart">
      <h3 className="chartTitle">{title}</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1} align>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#5550bd" />
          <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export const userData = [
  {
    name: "Jan",
    "Average Comp rate": 4000,
  },
  {
    name: "Feb",
    "Average Comp rate": 3000,
  },
  {
    name: "Mar",
    "Average Comp rate": 5000,
  },
  {
    name: "Apr",
    "Average Comp rate": 4000,
  },
  {
    name: "May",
    "Average Comp rate": 3000,
  },
  {
    name: "Jun",
    "Average Comp rate": 2000,
  },
  {
    name: "Jul",
    "Average Comp rate": 4000,
  },
  {
    name: "Agu",
    "Average Comp rate": 3000,
  },
  {
    name: "Sep",
    "Average Comp rate": 4000,
  },
  {
    name: "Oct",
    "Average Comp rate": 1000,
  },
  {
    name: "Nov",
    "Average Comp rate": 4000,
  },
  {
    name: "Dec",
    "Average Comp rate": 3000,
  },
];

export const userData2 = [
  {
    name: "Jan",
    "Average Comp rate": 200,
  },
  {
    name: "Feb",
    "Average Comp rate": 100,
  },
  {
    name: "Mar",
    "Average Comp rate": 2000,
  },
  {
    name: "Apr",
    "Average Comp rate": 7000,
  },
  {
    name: "May",
    "Average Comp rate": 1000,
  },
  {
    name: "Jun",
    "Average Comp rate": 9000,
  },
  {
    name: "Jul",
    "Average Comp rate": 3000,
  },
  {
    name: "Agu",
    "Average Comp rate": 3000,
  },
  {
    name: "Sep",
    "Average Comp rate": 4000,
  },
  {
    name: "Oct",
    "Average Comp rate": 1000,
  },
  {
    name: "Nov",
    "Average Comp rate": 5000,
  },
  {
    name: "Dec",
    "Average Comp rate": 2000,
  },
];

export default Dashboard;
