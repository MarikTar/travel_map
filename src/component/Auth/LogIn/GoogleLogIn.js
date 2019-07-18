import React, { Component } from "react"
import FireBase from '../FireBase';

export default class GoogleLogIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    };
    this.provider = new FireBase.firebase.auth.GoogleAuthProvider();
  }

  signIn = () => {
    FireBase.firebase.auth().signInWithPopup(this.provider).then(result => {
      console.log(result);
      // ...
    }).catch(error => {
      console.log(error);
      // ...
    });
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
