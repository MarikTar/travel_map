import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FireBase from "../../Firebase/FireBase";
import ProfileUser from "../ProfileUser/ProfileUser";
import Map from '../MapLeaflet/Map';
import Sidebar from '../CountryList/CountryList';
import ServiceGPS from '../../Services/ServiceGPS';
import ServiceDB from '../../Services/ServiceDB';
import Uploader from '../Uploader/upload';

import './dashboard.css';
window.URL = window.URL || window.webkitURL;
export default class Dashboard extends React.Component {
  static propTypes = {
    user: PropTypes.object
  }

  serviceDB = new ServiceDB();
  serviceGps = new ServiceGPS();

  constructor() {
    super();
    this.state = {
      images: [],
      imageTitles: [],
      showGaleria: true,
      loading: false,
      latitude: 0,
      longitude: 0,
      country: "",
      countrys: [],
      error: null
    }
    
    this.fileInput = React.createRef();
    this.uid = FireBase.firebase.auth().currentUser.uid;  
  }

  setMainState = (country) => {
    const countrys = this.state.countrys;
    countrys.push(country);
    this.setState({
        country: country,
        countrys: countrys,
        openWindow: true,
        images: [],
        imageTitles: [],
    })
    // console.log(country)//получает страну при нажатии add
    const user = FireBase.firebase.auth().currentUser;
    const storage = FireBase.firebase.storage();
    const imagesDir = storage.ref(`user/cloud-photos/${user.uid}/${country}`);
    let images = [];
    let titles = [];
    imagesDir.listAll().then(list => {
      let items = list.items;
      if(items.length > 0) {
        this.setState({
          showGaleria: false,
        })
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

  componentDidMount() {
    this.serviceDB.getDataFromDB(this.updateState, null);
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
    const { latitude, longitude, countrys, loading } = this.state; 
    return (

      <div className="dashboard-container">
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
        <div className="layout">
          <main className="main-content">
            <Map lat={ latitude } lon={ longitude } country={ this.state.countrys } setMainState={this.setMainState.bind(this)}/>
          </main>
          <aside className="sidebar">
            <Sidebar country={ countrys } setMainState={this.setMainState.bind(this)}/>
          </aside>
          {/* {console.log(this.state.showGaleria)} */}
          <Uploader country={this.state.country}
							showUploader={this.state.openWindow}
							images={this.state.images}
							imageTitles={this.state.imageTitles}
							showGaleria={this.state.showGaleria}/>
        </div>
      </div>
    )
  }
}
