import React, { Component } from 'react';
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import PrivateRoute from "../Auth/PrivateRouter";
import Dashboard from "../Dashboard/Dashboard";
import LogIn from "../Auth/LogIn/LogInController";
import SignUp from "../Auth/SignUp/SignUpController";
import FireBase from "../../Firebase/FireBase";
import logo from '../../source/logo.png';

export default class User extends Component {
  state = {
    user: null,
    photoURL: null,
    authenticated: false,
    loaded: false
  };

  componentDidMount() {
    FireBase.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user: user,
          authenticated: true,
          loaded: true
        });
      } else {
        this.setState({
          user: null,
          authenticated: false,
          loaded: true
        });
      }
    });
  }


  render() {
    const { authenticated, user, loaded } = this.state;

    if (!loaded) {
      return <div>Loading...</div>
    }

    return(
      <Router>
        <div 
          className="main-container" 
          style={{
            background: !authenticated ? '#4f8afe' : false
          }}
        >
          { !authenticated ? <div className="logo">
            <img src={ logo } className="logo-pic" alt="travel-map"/>
            <span className="logo-title">Travel Map</span>
            </div> : null }
          <PrivateRoute
            exact
            path='/dashboard'
            component={ Dashboard }
            authenticated={ authenticated }
            user={ user }
          />
          <Redirect exact from="/" to={ !authenticated ? '/login' : '/dashboard' } />
          <Route exact path="/login" component={ LogIn } />
          <Route exact path="/signup" component={ SignUp } />
        </div>
      </Router>
    );
  }
}