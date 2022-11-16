import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/CSS/Navbar.css";
import Dropdown from "./Dropdown";
import PersonIcon from "@material-ui/icons/Person";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Navbar() {
  let query = useQuery();
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);;

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  /*
  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  */

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container-left">
        <img className='navbar-logo' alt='heart' src={require('../../assets/images/TakeHeartLogo.jpg').default} onClick={closeMobileMenu}/>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          </div>
          <div className="navbar-container-right">
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-links" onClick={closeMobileMenu}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/privacy"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                Privacy
              </Link>
            </li>
            <li 
              className="nav-item"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}>

              <Link
                to="#"
                className="nav-links"
                onClick={closeMobileMenu}>
              <PersonIcon />
              <i className="fas fa-caret-down" />
              </Link>  
            
              {dropdown && <Dropdown orgName={query.get("name")} />}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
