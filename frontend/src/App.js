import React from "react";
import Navbar from "./components/NavBar/Navbar";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Dummies from "./pages/Dummies/Dummies";
import Groups from "./pages/Groups/Groups";
import Results from "./pages/Results/Results";
import Profile from "./pages/Profile/Profile";
import Tutorial from "./pages/CPRTutorial/Tutorial";
import UserGuide from "./pages/UserGuide/UserGuide";
import Admin from "./pages/Admin/Admin";
import signupOne from './pages/SignUp/SignupOne';
import LoginOne from './pages/Login/LoginOne';
import About from "./pages/About/About";
import Privacy from "./pages/Privacy/Privacy";
import Settings from "./pages/Settings/Settings";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Organisation from "./pages/Organisation/Organisation";
import OrgUsers from "./pages/Users/OrgUsers";
import Compare from "./pages/Compare/Compare";
import CprChart from './components/Chart/WaveformChart';
import Users from "./pages/Users/Users";

function App(props) {

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path='/chart' component={CprChart} />
          <Route path="/SignUp" component={signupOne} />
          <Route path="/login" component={LoginOne} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/dummies" component={Dummies} />
          <Route path="/groups" exact component={Groups} />
          <Route path="/groups/users" exact component={Users} />
          <Route path="/results" component={Results} />
          <Route path="/profile" component={Profile} />
          <Route path="/tutorial" component={Tutorial} />
          <Route path="/userguide" component={UserGuide} />
          <Route path="/admin" component={Admin} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/compare" component={Compare} />
          <Route exact path="/organisation" component={Organisation} />
          <Route exact path="/organisation/users" component={OrgUsers} />
          {/*<Route
            exact
            path="/organisation/join"
            render={() => <Organisation join={true} {...props} />}
          />*/}
          <Route path="/settings" component={Settings} />
	        <Route path='/Home' component={Home} />

        </Switch>
      </Router>
    </>
  );
}

export default App;
