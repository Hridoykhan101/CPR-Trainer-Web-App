import React, { useState } from "react";
import { NavbarSession } from "./NavbarSession";
import { NavbarLogin } from "./NavbarLogin";
import "../../assets/CSS/Dropdown.css";
import { Link } from "react-router-dom";
import { Fragment } from "react-is";
import RequestHelper from "../../RequestHelper";

function Dropdown(props) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  let toMap;

  if (RequestHelper.verifyLogin()) {
    toMap = NavbarSession;
  } else {
    toMap = NavbarLogin;
  }

  return (
    <ul
      onClick={handleClick}
      className={click ? "dropdown-menu clicked" : "dropdown-menu"}
      key="-1"
    >
      {toMap.map((item, index) => {
        let orgName =
          props?.orgName && index === 1 ? (
            <li key={props?.orgName}>
              <Link
                className={"dropdown-link"}
                to={"/users"}
                onClick={() => setClick(false)}
              >
                {props?.orgName}
              </Link>
            </li>
          ) : (
            ""
          );
        return (
          <Fragment>
            {orgName}
            <li key={index}>
              <Link
                className={item.cName}
                to={item.path}
                onClick={() => setClick(false), item.action || null}
              >
                {item.title}
              </Link>
            </li>
          </Fragment>
        );
      })}
    </ul>
  );
}

export default Dropdown;
