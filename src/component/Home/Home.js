import React, { Component } from 'react';
import FireBase from '../Auth/FireBase';

export default class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <button onClick={ () => FireBase.firebase.auth().signOut() }>Sign out</button>
      </div>
    )
  }
}
