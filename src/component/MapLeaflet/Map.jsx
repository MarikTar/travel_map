import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, TileLayer, GeoJSON } from 'react-leaflet';
import MapGeo from './map.geo.json';
import ControllerFlagAPI from '../Controllers/ControllerFlagAPI';
import './map.css';

export default class MapLeaFlet extends Component {
  static propTypes = {
    lat: PropTypes.number,
    lon: PropTypes.number,
    country: PropTypes.array
  }

  static countrys = [];
  static countryStyle = 0.8;

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

    if (nextProps.lat !== this.props.lat && nextProps.lon !== this.props.lon) {
      console.log('foo');
      this.setState({
        marks: [
          ...marks,
          [ lat, lon ]
        ]
      });
    }
  }

  styled(feature) {
    MapLeaFlet.countrys.push(feature);
    return {
      color: '#000',
      weight: 1.5,
      fillOpacity: 0.8
    }
  }

  onMouseOut = evt => {
    evt.target.resetStyle(evt.layer);
  }

  onMouseOver (evt) {
    const ctx = evt.layer;
    ctx.setStyle({
      weight: 3,
      color: '#666',
      fillOpacity: 0.7,
    })
  }

  onClickLayer = evt => {
    const countrys = evt.layer.feature.properties.name;

    // new ControllerFlagAPI code...

    this.setState({
      openWindow: true,
      countrys
    });
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    const { marks } = this.state;
    return (
      <Map 
        className="map" 
        center={position} 
        zoom={ 2 }
        maxBounds={ [[90, -180], [-70, 180]] }
        >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          minZoom={ 2 }
          maxZoom={ 18 }
        />
        <GeoJSON 
          data={ MapGeo } 
          style={ this.styled.bind(this) }
          onMouseOver={ this.onMouseOver }
          onMouseOut={ this.onMouseOut }
          onClick={ this.onClickLayer }
        />
        {marks.map((position, idx) => 
          <Marker key={`marker-${idx}`} position={ position } />
        )}
      </Map>
    )
  }
}