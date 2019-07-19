import React from 'react';
import PropTypes from 'prop-types';
import './dashboard.css';
import FireBase from "../Auth/FireBase";
import ProfileUser from "../Auth/User/ProfileUser";

export default function Dashboard(props) {
  return (
    <header className="header">
      <h1>Dashboard</h1>
      <ProfileUser user={ props.user } />
      <button onClick={ () => FireBase.firebase.auth().signOut() }>Sign out</button>
    </header>
  )
}

Dashboard.propTypes = {
  user: PropTypes.object
};
