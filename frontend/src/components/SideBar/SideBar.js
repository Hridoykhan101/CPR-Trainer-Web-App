import * as React from "react";
import { SideBarData, SideBarOrganisationData } from "./SideBarData";
import "../../assets/CSS/SideBar.css";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

function SideBar(props) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(prev => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <div className="SideBar">
      <ul className="SideBarList">
        
        {SideBarData.map((val, key) => {
          return (
            <li
              key={key}
              className="row"
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
              <div id="icon">{val.icon}</div> <div id="title">{val.title}</div>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

/* Dropdown code for the organisation
val.title === "Organisation" ? (
            <ClickAwayListener
              mouseEvent="onMouseDown"
              touchEvent="onTouchStart"
              onClickAway={handleClickAway}
              key={key}
            >
              <div>
                <li key={key} className="row" onClick={handleClick}>
                  <div id="icon">{val.icon}</div>{" "}
                  <div id="title" className="flex">{val.title}
                    <div id="icon">{open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</div>
                  </div>
                </li>
                {open
                  ? SideBarOrganisationData.map((val, key) => (
                    <li
                      key={key}
                      className="row dropdown pl-3"
                      onClick={() => {
                        window.location.pathname = val.link;
                      }}
                    >
                      <div id="icon">{val.icon}</div>{" "}
                      <div id="title">{val.title}</div>
                    </li>
                  ))
                  : null}
              </div>
            </ClickAwayListener>
                    ) :*/

export default SideBar;
