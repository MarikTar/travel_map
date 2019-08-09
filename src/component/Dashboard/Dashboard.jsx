import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FireBase from "../../Firebase/FireBase";
import ProfileUser from "../ProfileUser/ProfileUser";
import Map from '../MapLeaflet/Map';
import Sidebar from '../CountryList/CountryList';
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
      country: [],
      error: null
    }
    this.fileInput = React.createRef();
    this.uid = this.props.user.uid;
  }

  componentDidMount() {
    this.serviceDB.getDataFromDB(this.updateState, null);
  }

  setMainState = (country) => {
    this.setState({
        countrys: country,
        openWindow: true,
    })
    console.log(country)//получает страну при нажатии add
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

  handlerClick = () => {
    this.fileInput.current.click();
  }

  handlerChange = evt => {
    const files = Array.from(evt.target.files);
    files.forEach(file => this.uploadPhotos(file));
    this.setState({loading: true});
  }

  uploadPhotos(file) {
    this.serviceGps.setGPSCoordinatesDB(file, this.updateState, this.getError);
  }

  getError = error => {
    if (error) {
      this.setState({
        error,
        loading: false
      });
    }
  }

  render() {
    const { latitude, longitude, country, loading } = this.state;

    return (
      <div className="dashboard-container">
        <header className="dashboard">
        <div className="dashboard-title">
          Travel map
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
        <div className="layout">
          <main className="main-content">
            <Map lat={ latitude } lon={ longitude } country={ country } setMainState={this.setMainState.bind(this)} test={'asd'}/>
          </main>
          <aside className="sidebar">
            <Sidebar country={ country } setMainState={this.setMainState.bind(this)} setAddMarker={(id)=>console.log('setAddMarker',id)}/>
          </aside>
        </div>
      </div>
    )
  }
}
