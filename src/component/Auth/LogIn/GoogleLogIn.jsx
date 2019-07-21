import React, { Component } from "react"
import FireBase from '../FireBase';
import firebase from "firebase/app";


export default class GoogleLogIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    };

    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  signIn = () => {
    FireBase.firebase.auth().signInWithPopup(this.provider);
  };

  render() {
    return (
      <div className="auth-socials">
        <button
          type="button"
          className="auth-social-button"
          onClick={ this.signIn }
        >
          <span className="icon-gpl" />
          Continue with Google
        </button>
      </div>
    )
  }
}
