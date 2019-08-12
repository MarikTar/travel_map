import React from 'react';
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
      latitude: 0,
      longitude: 0,
      country: [],
      countrys: [],
      error: null,
      cid: '',
    }
    this.fileInput = React.createRef();
    this.uid = this.props.user.uid;
    this.cid = '';
  }


  componentDidMount() {
    this.serviceDB.getDataGpsFromDB(this.updateGpsData, null);
    this.serviceDB.getCountriesFromDB(this.updateCountrys, this.state.countrys);
  }

  clearCountry(country) {
    // console.log(country);
  }

  setMainState = async (country) => {
    this.setState({
      country: country,
      openWindow: true,
      images: [],
      imageTitles: [],
      uploaderHeight: '100%',
    });
    const user = FireBase.firebase.auth().currentUser;
    const storage = FireBase.firebase.storage();
    const imagesDir = storage.ref(`user/cloud-photos/${user.uid}/${country}`);
    let images = [];
    let titles = [];
    const listAll = await imagesDir.listAll().then();
    if (listAll.items.length > 0) {
      const countrys = this.state.countrys;
      countrys.push(country);
      this.setState({
        countrys: countrys,
        showGaleria: false,
        uploaderHeight: '100px'
      });
      for (let i = 0; i < listAll.items.length; i += 1) {
        const element = storage.ref(listAll.items[i].fullPath);
        await element.getDownloadURL().then(url => {
          images[i] = url;
          titles[i] = listAll.items[i].name;
        });
      }
    }
    this.setState({
      imageTitles: titles,
      images: images,
      showGaleria: true
    });
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

  onClickChangeOpenWidow() {
    this.setState({
      openWindow: !this.state.openWindow
    });
  }

  addMarkerOnMap(id,country){
    if(this.cid!==id){
      this.cid = id;
      this.setState({
        cid: [this.cid,country]
      })
    }
  }

  handlerClick = () => {
    this.fileInput.current.click();
  }

  handlerChange = evt => {
    const files = Array.from(evt.target.files);
    files.forEach(file => this.uploadPhotos(file));
    this.setState({ loading: true });
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
          Travel map
        </div>
          <div className='profile'>
            <button
              type="button"
              className="upload-photos"
              onClick={this.handlerClick}
            >
              <span className="upload-icon" />
              <span className="upload-photos-label">Upload Files</span>
              {loading ? <span className="upload-loading" /> : null}
              <input
                type="file"
                multiple
                className="input-file"
                onChange={this.handlerChange}
                ref={this.fileInput}
              />
            </button>
            <ProfileUser user={this.props.user} />
            <button
              className="btn-logout"
              onClick={() => FireBase.firebase.auth().signOut()}
            >
              Log out
          </button>
          </div>
        </header>
        <div className="layout">
          <main className="main-content">
            <Map lat={ lat } lon={ lon } country={ countrys } setMainState={this.setMainState.bind(this)} cid={this.state.cid}/>
          </main>
          <aside className="sidebar">
            <Sidebar country={ countrys } setMainState={this.setMainState.bind(this)} setAddMarker={(id,country)=>this.addMarkerOnMap(id,country)}/>
          </aside>
          <Uploader country={this.state.country}
                    showUploader={this.state.openWindow}
                    images={this.state.images}
                    imageTitles={this.state.imageTitles}
                    showGaleria={this.state.showGaleria}
                    openWindow={this.state.openWindow}
                    uploaderHeight={this.state.uploaderHeight}
                    clearCountry={this.clearCountry.bind(this)}
                    onClickChangeOpenWidow={this.onClickChangeOpenWidow.bind(this)}/>
        </div>
      </div>
    )
  }
}
