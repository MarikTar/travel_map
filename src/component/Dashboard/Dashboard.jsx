import React from 'react';
import PropTypes from 'prop-types';
import FireBase from "../Auth/FireBase";
import ProfileUser from "../ProfileUser/ProfileUser";
import Uploader from '../Uploader/upload';

import './dashboard.css';
window.URL = window.URL || window.webkitURL;
export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      "display-uploader": 'none',
      images: []
    }
  }

  onClick(e) {
    this.setState({
      "display-uploader": 'flex',
      country: e.target.innerHTML
    });
    const user = FireBase.firebase.auth().currentUser;
    const storage = FireBase.firebase.storage();
    const imagesDir = storage.ref(`user/cloud-photos/${user.uid}/${e.target.innerHTML}`);
    let images = [];
    imagesDir.listAll().then(list => {
      let items = list.items;
      for (let i = 0; i < items.length; i += 1) {
        const element = storage.ref(items[i].fullPath);
        element.getMetadata().then(data => console.log(data))
        element.getDownloadURL().then(url => { 
          images[i] = url;  
          this.setState({
            images: images
          });
          // console.log(url);
          
          // fetch(url)
          //   .then(res => res.blob())
          //   .then(data => {
          //     images[i] = data
          //     this.setState({
          //         images: images
          //       });
          //   })
        });
      }
      
    })
    .catch(err => console.log(err));
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
                    country={this.state.country}
                    images={this.state.images}/>
        </main>
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.object
};
