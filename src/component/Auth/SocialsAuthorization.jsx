import React, { Component } from "react"
import FireBase from '../../Firebase/FireBase';
import firebase from "firebase/app";
import './auth-scials.css';

export default class SocialsAuthorization extends Component {
  providerGoogle = new firebase.auth.GoogleAuthProvider();
  providerFacebook = new firebase.auth.FacebookAuthProvider();


  signInGoogle = () => {
    FireBase.firebase.auth().signInWithPopup(this.providerGoogle);
  };

  signInFacebook = () => {
    FireBase.firebase.auth().signInWithPopup(this.providerFacebook);
  }

  render() {
    return (
      <div className="auth-socials">
        <button
          type="button"
          className="auth-social-button"
          onClick={ this.signInGoogle }
        >
          <span className="icon-gpl" />
        </button>
        <button
          type="button"
          className="auth-social-button"
          onClick={ this.signInFacebook }
        >
          <span className="icon-fb" />
        </button>
      </div>
    )
  }
}