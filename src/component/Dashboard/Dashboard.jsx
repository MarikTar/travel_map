import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EXIF from 'exif-js';
import './dashboard.css';
import FireBase from "../Auth/FireBase";
import ProfileUser from "../ProfileUser/ProfileUser";
import test from '../../source/test.JPG';

export default class Dashboard extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }
    this.fileInput = React.createRef();
  }

  render() {
    const { loading } = this.state;

    return (
      <div>
        <header className="dashboard">
        <div className="dashboard-title">
          Dashboard
        </div>
        <div className='profile'>
          <button 
            type="button" 
            className="upload-photos"
            onClick={ this.handlerClick }
          >
            <span className="upload-icon" />
            <span className="upload-photos-label">Upload Files</span>
            { loading ? <span className="upload-loading" /> : null }
          <input 
            type="file" 
            multiple
            className="input-file"
            onChange={ this.handlerChange }
            ref={ this.fileInput }
          />
          </button>
          <ProfileUser user={ this.props.user } />
          <button 
            className="btn-logout" 
            onClick={ () => FireBase.firebase.auth().signOut() }
          >
            Log out
          </button>
        </div>
      </header>
      </div>
    )
  }

  getGPS(coordinates) {
    return coordinates[0].numerator + coordinates[1].numerator / (60 * coordinates[1].denominator) + coordinates[2].numerator / (3600 * coordinates[2].denominator);
  }

  componentDidMount() {
    const storageRef = FireBase.firebase.storage().ref('user/cloud-photos/foo/IMG_0002.JPG');
    storageRef.getDownloadURL()
      .then(url => {
        fetch(url, {cors: 'no-cors'})
        .then(res => res.blob())
        .then(data => {
          EXIF.getData(data, () => {
            const latitude = this.getGPS(EXIF.getTag(data, 'GPSLatitude'));
            const longitude = this.getGPS(EXIF.getTag(data, 'GPSLongitude'));
            console.log(latitude);
            console.log(longitude);
          })
        });
      })
  }

  handlerClick = () => {
    this.fileInput.current.click();
  }

  handlerChange = evt => {
    const files = Array.from(evt.target.files);
    files.forEach(file => this.uploadPhotos(file));

    this.setState({loading: true});
  }

  uploadPhotos(source) {
    const { user } = this.props;
    const storageRef = FireBase.firebase.storage().ref('user/cloud-photos/foo/' + source.name);
    storageRef.put(source)
      .then(snapshot => {
        if (snapshot.state === 'success') {
          this.setState({loading: false});
        }
      }, error => console.log(error));
  }
}
