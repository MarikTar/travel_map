import React from 'react';
import PropTypes from 'prop-types';
import './dashboard.css';
import FireBase from "../Auth/FireBase";
import ProfileUser from "../ProfileUser/ProfileUser";

export default function Dashboard(props) {
  return (
    <header className="dashboard">
      <div className="dashboard-title">
        Dashboard
      </div>
      <div className='profile'>
        <ProfileUser user={ props.user } />
        <button className="btn-logout" onClick={ () => FireBase.firebase.auth().signOut() }>Log out</button>
      </div>
    </header>
  )
}

Dashboard.propTypes = {
  user: PropTypes.object
};
