import React, { Component } from 'react';
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import PrivateRoute from "../PrivateRouter";
import Home from "../../Home/Home";
import LogIn from "../LogIn/LogInController";
import SignUp from "../SignUp/SignUpController";
import FireBase from "../FireBase";

export default class User extends Component {
  state = {
    uid: null,
    photoURL: null,
    emailVerified: null,
    authenticated: false
  };

  componentDidMount() {
    FireBase.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          uid: user.uid,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          authenticated: true
        });
      } else {
        this.setState({
          uid: null,
          photoURL: null,
          emailVerified: null,
          authenticated: false
        });
      }
    });
  }


  render() {
    const { authenticated } = this.state;

    return(
      <Router>
        <div>
          <PrivateRoute
            exact
            path='/home'
            component={ Home }
            authenticated={ authenticated }
          />
          <Redirect from="/" to={ !authenticated ? '/login' : '/home' } />
          <Route exact path="/login" component={ LogIn } />
          <Route exact path="/signup" component={ SignUp } />
        </div>
      </Router>
    );
  }
}
