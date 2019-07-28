import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FireBase from "../../Firebase/FireBase";
import ProfileUser from "../ProfileUser/ProfileUser";
import Map from '../MapLeaflet/Map';
import ServiceGPS from '../../Services/ServiceGPS';
import ServiceDB from '../../Services/ServiceDB';
import './dashboard.css';

export default class Dashboard extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  serviceDB = new ServiceDB();
  serviceGps = new ServiceGPS();

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      latitude: 0,
      longitude: 0,
      country: []
    }
    this.fileInput = React.createRef();
    this.uid = this.props.user.uid;
  }

  componentDidMount() {
    this.serviceDB.getDataFromDB(this.updateState);
  }

  updateState = (loading, lat, lon, country) => {
    if (!lat || !lon) {
      return;
    }

    this.setState({
      loading,
      latitude: lat,
      longitude: lon,
      country: [
        ...this.state.country,
        country
      ]
    })
  }

  render() {
    const { latitude, longitude, country, loading } = this.state;

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
        <Map lat={ latitude } lon={ longitude } country={ country } />
      </div>
    )
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
    const storageRef = FireBase.firebase.storage().ref(`user/cloud-photos/${this.uid}/${source.name}`);
    this.serviceGps.setGPSCoordinatesDB(storageRef, source, this.updateState);
  }
}
