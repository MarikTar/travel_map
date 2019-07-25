import React from 'react';
import PropTypes from 'prop-types';
import FireBase from "../Auth/FireBase";
import ProfileUser from "../ProfileUser/ProfileUser";
import Uploader from '../Uploader/upload';

import './dashboard.css';

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      "display-uploader": 'none'
    }
  }

  onClick(e) {
    this.setState({
      "display-uploader": 'flex',
      country: e.target.innerHTML
    })
    // console.log(e.target.innerHTML);
    
  }



  render() {
    return (
      <div>
        <header className="dashboard">
          <div className="dashboard-title">
            Dashboard
          </div>
          <div className='profile'>
            <ProfileUser user={ this.props.user } />
            <button className="btn-logout" onClick={ () => FireBase.firebase.auth().signOut() }>Log out</button>
          </div>
        </header>

        <main>
          <button onClick={(e) => this.onClick(e)}>Ukraine</button>
          <Uploader showUploader={this.state["display-uploader"]}
                    country={this.state.country}/>
        </main>
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.object
};
