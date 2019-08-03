import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { divIcon, marker } from "leaflet";
import { Map, Marker, TileLayer, GeoJSON } from 'react-leaflet';
import MapGeo from './map.geo.json';
import ServiceGeoCordinate from '../../Services/ServiceGeoCordinats';
import './map.css';

export default class MapLeaFlet extends Component {
  static propTypes = {
    lat: PropTypes.number,
    lon: PropTypes.number,
    country: PropTypes.array
  }

  countrys = [];
  serviceGeoCordinate = new ServiceGeoCordinate();
  customIconMarker = divIcon({
    html: `<button id='bap'>TEST</button>`,
    className: 'iconButtonAddPhoto',
  });
  buttonAddPhoto = null;

  state = {
    lat: 55,
    lng: 10,
    marks: [],
    countrys: null,
    openWindow: false,
  }

  componentWillUpdate(nextProps, nextState) {
    const { lat, lon, country } = nextProps;
    const { marks } = this.state;

    if (lat !== this.props.lat && lon !== this.props.lon) {
      this.setState({
        marks: [
          ...marks,
          [ lat, lon ]
        ]
      });
    }

    if (country !== this.props.country) {
      this.countrys = country;
    }
  }

  layerStyled({ properties }) {
    const country = properties.name;
    return {
      color: '#000',
      weight: 1.5,
      fillOpacity: this.markedСountries(country)
    }
  }

  markedСountries(country) {
    return this.countrys.includes(country) ? 0.2 : 0.8;
  }

  onMouseOut = evt => {
    evt.target.resetStyle(evt.layer);
  }

  onMouseOver = (evt) => {
    const ctx = evt.layer;
    if (typeof ctx.setStyle === 'function') {
      ctx.setStyle({
        weight: 3,
        color: '#666',
        fillOpacity: 0.7,
      })
    }
  }

  onClickGetCountry = evt => {
    const countrys = evt.layer.feature.properties.name;
    const id = evt.layer.feature.id;
    this.props.setMainState(countrys, id);
  }

  onClickAddCustomElement = evt => {
    const countryId = evt.layer.feature.id;
    
    if (this.buttonAddPhoto) {
      this.buttonAddPhoto.remove(evt.target);
    }

    this.serviceGeoCordinate
      .getCordinates(countryId)
      .then(cordinates => {
        this.buttonAddPhoto = marker(cordinates, { icon: this.customIconMarker })
        this.buttonAddPhoto.addTo(evt.target);
        //test
        const BAP = document.getElementById('bap');
        BAP.addEventListener('click', ()=> console.log(cordinates))
      });
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    const { marks } = this.state;
    return (
      <Map 
        className="map" 
        center={position} 
        zoom={ 3 }
        maxBounds={ [[90, -180], [-70, 180]] }
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          minZoom={ 3 }
          maxZoom={ 5 }
        />
        <GeoJSON 
          data={ MapGeo } 
          style={ this.layerStyled.bind(this) }
          onMouseOver={ this.onMouseOver }
          onMouseOut={ this.onMouseOut }
          onClick={ this.onClickGetCountry } // this.onClick.bind(this) // onClick replace to onClickAddCustomElement
        />
        {/* {marks.map((position, idx) => 
          <Marker key={`marker-${idx}`} position={ position } />
        )} */}
      </Map>
    )
  }
}