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

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageTitles: [],
      showGaleria: true,
      loading: false,
      country: "",
      lat: 0,
      lon: 0,
      countrys: [],
      test: '',
      error: null
    }
    this.fileInput = React.createRef();
    this.uid = props.user.uid;
  }

  
  componentDidMount() {
    this.serviceDB.getDataGpsFromDB(this.updateGpsData, null);
    this.serviceDB.getCountriesFromDB(this.updateCountrys, this.state.countrys);
  }

  setMainState = (country, id) => {
    const countrys = this.state.countrys;
    countrys.push(country);
    this.setState({
        country: country,
        countrys: countrys,
        openWindow: true,
        images: [],
        imageTitles: [],
        uploaderHeight: '100%',
        id
    });
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
          uploaderHeight: '100px'
        });
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
            });
          });
        } 
      }
    })
    .catch(err => console.log(err));
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

  render() {
    const { lat, lon, countrys, loading } = this.state;
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
            <Map lat={ lat } lon={ lon } country={ countrys } setMainState={this.setMainState.bind(this)}/>
          </main>
          <aside className="sidebar">
            <Sidebar country={ countrys } setMainState={this.setMainState.bind(this)}/>
          </aside>
          <Uploader country={this.state.country}
                    showUploader={this.state.openWindow}
                    images={this.state.images}
                    imageTitles={this.state.imageTitles}
                    showGaleria={this.state.showGaleria}
                    uploaderHeight={this.state.uploaderHeight}
                    id={this.state.id}/>
        </div>
      </div>
    )
  }
}
