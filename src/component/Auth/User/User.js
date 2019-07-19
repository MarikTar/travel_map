import React, { Component } from 'react';
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import PrivateRoute from "../PrivateRouter";
import Dashboard from "../../Dashboard/Dashboard";
import LogIn from "../LogIn/LogInController";
import SignUp from "../SignUp/SignUpController";
import FireBase from "../FireBase";

export default class User extends Component {
  state = {
    uid: null,
    photoURL: null,
    emailVerified: null,
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
          loaded: false
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
        <div>
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
