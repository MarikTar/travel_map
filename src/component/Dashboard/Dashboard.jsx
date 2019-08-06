import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FireBase from "../../Firebase/FireBase";
import ProfileUser from "../ProfileUser/ProfileUser";
import Map from '../MapLeaflet/Map';
import Sidebar from '../CountryList/CountryList';
import DropDown from '../DropDown/DropDown';
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
      lat: 0,
      lon: 0,
      countrys: [],
      error: null
    }
    this.fileInput = React.createRef();
    this.uid = this.props.user.uid;
  }

  componentDidMount() {
    this.serviceDB.getDataGpsFromDB(this.updateGpsData, null);
    this.serviceDB.getCountriesFromDB(this.updateCountrys, this.state.countrys);
  }

  setMainState(country, id) {
    this.serviceDB.setCountryAtDB(country, id);
    
    this.setState({
      openWindow: true
    });

    console.log(country)//получает страну при нажатии add
}

  updateGpsData = (loading, lat, lon, country) => {
    const { countrys } = this.state;

    this.setState({
      loading,
      lat,
      lon,
      countrys: [
        ...countrys,
        country
      ]
    });
  }

  updateCountrys = countrys => {
    this.setState({
      countrys
    }); 
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
    this.serviceGps.setGPSCoordinatesDB(file, this.updateGpsData, this.getError);
  }

  getError = error => {
    if (error) {
      this.setState({
        error,
        loading: false
      });
    }
  }

  handlerSlideOutMenu = () => {
    console.log('foo');
  }

  render() {
    const { lat, lon, countrys, loading } = this.state;

    return (
      <div className="dashboard-container">
        <header className="dashboard">
        <button className="btn-burger">
          <span className="humburger" />
        </button>
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
          <DropDown
            onUpload={ this.handlerClick }
          />
        </div>
      </header>
        <div className="layout">
          <main className="main-content">
            <Map lat={ lat } lon={ lon } country={ countrys } setMainState={this.setMainState.bind(this)}/>
          </main>
          <aside className="sidebar">
            <Sidebar country={ countrys } setMainState={this.setMainState.bind(this)}/>
          </aside>
        </div>
      </div>
    )
  }
}
