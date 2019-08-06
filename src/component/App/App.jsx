import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import PrivateRoute from "../Auth/PrivateRouter";
import Dashboard from "../Dashboard/Dashboard";
import Auth from '../Auth/Auth';
import Popup from '../Popup/Popup';
import FireBase from "../../Firebase/FireBase";
import './app.css';

class App extends Component {
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
          user,
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
      <>
        <Router>
          <div 
            className={ `main-container ${ !authenticated ? 'app-auth' : 'app-dashboard' }` }
          >
            <PrivateRoute
              exact
              path='/dashboard'
              component={ Dashboard }
              authenticated={ authenticated }
              user={ user }
            />
            <Redirect exact from="/" to={ !authenticated ? '/login' : '/dashboard' } />
            { !authenticated ? <Auth/> : null }
          </div>
        </Router>
        <Popup 
          loader={ loaded } 
          authenticated={ authenticated }
          />
      </>
    );
  }
}

export default App;
