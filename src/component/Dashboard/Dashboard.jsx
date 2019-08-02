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
      displayUploader: 'none',
      images: [],
      imageTitles: [],
      showGaleria: false
    }
  }

  onClick(e) {
    this.setState({
      displayUploader: 'block',
      country: e.target.innerHTML
    });
    const user = FireBase.firebase.auth().currentUser;
    const storage = FireBase.firebase.storage();
    const imagesDir = storage.ref(`user/cloud-photos/${user.uid}/${e.target.innerHTML}`);
    let images = [];
    let titles = [];
    imagesDir.listAll().then(list => {
      let items = list.items;  
      if(items.length !== 0) {
        for (let i = 0; i < items.length; i += 1) {
          const element = storage.ref(items[i].fullPath);
          element.getMetadata().then(data => {
            titles[i] = data.name;
            this.setState({
              imageTitles: titles
            })
          });
  
          element.getDownloadURL()
          .then(url => {
            images[i] = url;
            this.setState({
              images: images
            });
          })
          .then(() => {
            this.setState({
              showGaleria: true
            })
          })
        } 
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
          <Uploader showUploader={this.state.displayUploader}
                    country={this.state.country}
                    images={this.state.images}
                    imageTitles={this.state.imageTitles}
                    showGaleria={this.state.showGaleria}/>
        </main>
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.object
};
