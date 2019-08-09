import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { divIcon, marker } from "leaflet";
import { Map, TileLayer, GeoJSON, Marker } from 'react-leaflet';
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
    html: `<div id="pin"><button id="addPhoto"></button></div>`,
    className: 'iconButtonAddPhoto',
    iconAnchor: [20, 80],
    iconSize: [50, 80]
  });

  buttonAddPhoto = null;
  cid = null;

  state = {
    lat: 55,
    lng: 10,
    marks: [],
    countrys: null,
    openWindow: false,
    zoom: 2,
    markAddPhoto: [],
    country: null,
  }

  componentWillUpdate(nextProps, nextState) {
    const { lat, lon, country, cid } = nextProps;
    const { marks } = this.state;
    
    if (this.cid !== cid && cid) {
      this.cid = cid;
      this.onClickAddCustomElement(this.cid)
    }

    if (lat !== this.props.lat && lon !== this.props.lon) {
      this.setState({
        marks: [
          ...marks,
          [lat, lon]
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
      fill: true,
      fillColor: 'gray',
      weight: 1.5,
      fillOpacity: this.markedСountries(country)
    }
  }

  markedСountries(country) {
    return this.countrys.includes(country) ? 0.2 : 0.8;
  }

  onMouseOut(evt) {
    evt.target.resetStyle(evt.layer);
  }

  onMouseOver(evt) {
    const ctx = evt.layer;
    if (typeof ctx.setStyle === 'function') {
      ctx.setStyle({
        weight: 3,
        color: '#666',
        fillColor: '#41A6F1',
        fillOpacity: 0.7,
      })
    }
  }

  onClickAddCustomElement(evt) {
    if (Array.isArray(evt)) {
      this.changeCoordinateMarker(evt[0], evt[1])
    } else {
      this.changeCoordinateMarker(evt.layer.feature.id, evt.layer.feature.properties.name)
    }
  }

  changeCoordinateMarker(id, country) {
    this.serviceGeoCordinate
      .getCordinates(id)
      .then(cordinates => {
        this.setState({
          country: country,
          lat: cordinates[0],
          lng: cordinates[1],
          markAddPhoto: [cordinates],
          zoom: 4,
        })
      })
      .catch(()=>{
        this.setState({
          country: country,
          markAddPhoto: [],
          zoom: 2,
        })
      })
  }
  test(evt){
    console.log(evt.target)
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map
        className="map"
        center={position}
        zoom={this.state.zoom}
        maxBounds={[[90, -180], [-70, 180]]}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          minZoom={2}
          maxZoom={5}
        />
        <GeoJSON
          data={MapGeo}
          style={this.layerStyled.bind(this)}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut.bind(this)}
          onClick={this.onClickAddCustomElement.bind(this)}
        />
        {this.state.markAddPhoto.map((position, id) =>
          <Marker
            position={position}
            key={id}
            icon={this.customIconMarker}
            onClick={() => this.props.setMainState(this.state.country, this.state.cid)}
          />
        )}
      </Map >
    )
  }
}