import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FireBase from "../../Firebase/FireBase";
import ProfileUser from "../ProfileUser/ProfileUser";
import Map from '../MapLeaflet/Map';
import Sidebar from '../CountryList/CountryList';
import Uploader from '../Uploader/upload';
import ServiceGPS from '../../Services/ServiceGPS';
import ServiceDB from '../../Services/ServiceDB';
import './dashboard.css';
import logo from '../../source/logo.svg';

export default class Dashboard extends Component {
  static propTypes = {
    user: PropTypes.object 
  }

  serviceDB = new ServiceDB();
  serviceGps = new ServiceGPS();

  constructor(props) {
    super(props);

    this.state = {
      upload: false,
      uploadData: false,
      lat: 0,
      lon: 0,
      countrysID: [],
      error: null,
      openWindow: false
    }
    this.countryID = {};
    this.uploadedFile = false;
    this.fileInput = React.createRef();
    this.uid = this.props.user.uid;
    this.cid = '';
  }

  componentDidMount() {
    this.serviceDB.getDataGpsFromDB(
      this.updateGpsData, 
      null
    );
    this.serviceDB.getCountriesFromDB(this.updateCountrys);
  }

  addMarkerOnMap(id){
    if(this.cid!==id){
      this.cid = id;
      this.setState({
        cid: id
      })
    }
  }

  setMainState = (id) => {
    this.countryID = {id};

    this.setState({
      openWindow: true
    });
  }

  updateGpsData = (
    upload,
    { 
      lat = 0, 
      lon = 0, 
      id 
    },
    uploadData
  ) => {
    this.setState(({ countrysID }) => {
      return {
        upload,
        lat,
        lon,
        countrysID: [
          ...countrysID,
          id
        ],
        uploadData
      }
    });
  }

  updateCountrys = (id, uploadData) => {
    this.setState({
      countrysID: [
        ...id
      ],
      uploadData
    }); 
  }

  addMarkerOnMap(id){
    if(this.cid!==id){
      this.cid = id;
      this.setState({
        cid: id
      })
    }
  }

  handlerClick = () => {
    this.fileInput.current.click();
  }

  handlerChange = evt => {
    const files = Array.from(evt.target.files);
    files.forEach(file => this.uploadPhotos(file));
    this.setState({upload: true});
  }

  uploadPhotos(file) {
    this.serviceGps.setGPSCoordinatesDB(file, this.updateGpsData, this.getError);
    this.uploadedFile = true;
  }

  getError = error => {
    if (error) {
      this.setState({
        error,
        upload: false
      });
    }
  }

  closeUploader = () => {
    this.setState({
      openWindow: false
    });

    this.uploadedFile = false;
  }

  render() {
    const { lat, lon, countrysID, upload, openWindow } = this.state;

    if (!this.state.uploadData) {
      return(
        <div className="loader-box">
          <div className="loader">
              <div className="element-animation">
                <img src="http://i57.tinypic.com/30dighv.png" width="480" height="100" alt="Loader"/>
              </div>
          </div>
          <ul className="labels">
            <li className="label">Loading...</li>
            <li className="label">Wandering...</li>
            <li className="label">Thrillseeking...</li>
            <li className="label">Adventuring...</li>
          </ul>
        </div>
      )
    }

    return (
      <div className="dashboard-container">
        <header className="dashboard">
        <button className="btn-burger">
          <span className="humburger" />
        </button>
        <div className="dashboard-title">
          <img id='minelogo' src={logo} alt="logo"/><b>Travel map</b>
        </div>
        <div className='profile'>
          <button 
            type="button" 
            className="upload-photos"
            onClick={ this.handlerClick }
          >
            <span className="upload-icon" />
            <span className="upload-photos-label">Upload Files</span>
            { upload ? <span className="upload-loading" /> : null }
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
            <Map lat={ lat } lon={ lon } countryID={ countrysID } setMainState={ this.setMainState } cid={this.state.cid} />
          </main>
          <aside className="sidebar">
            <Sidebar countrysID={ this.countryID } setMainState={ this.setMainState } visited={ countrysID } setAddMarker={this.addMarkerOnMap.bind(this)} />
          </aside>
          <Uploader
            countryID={ this.countryID }
            showUploader={ openWindow }
            user={ this.props.user }
            onClose={ this.closeUploader }
            onUpdateCountrys={ this.updateCountrys }
            countrysID={ countrysID }
            uploadedFile={ this.uploadedFile }
          />
        </div>
      </div>
    )
  }
}

