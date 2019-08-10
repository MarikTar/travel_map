import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { divIcon, marker } from "leaflet";
import { Map, TileLayer, GeoJSON, Marker, } from 'react-leaflet';
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
    countrys: [],
    openWindow: false,
    zoom: 2,
    markAddPhoto: [], //show arrow markers(only 1 marker in)
    country: null,
  }

  componentWillUpdate(nextProps, nextState) {
    const { lat, lon, country, cid } = nextProps;// ? lat, lon, country
    //  ? const { marks } = this.state;

    if (this.cid !== cid && cid) {
      this.cid = cid;
      this.onClickAddCustomElement(cid)
    }

    //  ?
    // if (lat !== this.props.lat && lon !== this.props.lon) {
    //   this.setState({
    //     marks: [
    //       ...marks,
    //       [lat, lon]
    //     ]
    //   });
    // }
    if (country !== this.props.country) {
      this.countrys = country;
    }
  }

  layerStyled({ id }) {
    return {
      color: '#000',
      fill: true,
      fillColor: this.markedСountries(id),
      weight: 1.5,
      fillOpacity: 0.8
    }
  }

  markedСountries(id) {
    return this.countrys.includes(id) ? '#41A6F1' : 'grey';
  }

  onMouseOut(evt) {
    evt.target.resetStyle(evt.layer);
    this.setState({
      country: null,
    })
  }

  onMouseOver(evt) {
    const ctx = evt.layer;
    const countryHover = ctx.feature.properties.name
    this.setState({
      country: countryHover,
    })
    if (typeof ctx.setStyle === 'function') {
      ctx.setStyle({
        weight: 3,
        color: '#666',
        fillColor: '#fff',
        //fillColor: '#41A6F1', //'url("#imgpattern")'  '#41A6F1'
        fillOpacity: 0.6,
      })
    }
  }

  onClickAddCustomElement(id) {
    this.serviceGeoCordinate
      .getCordinates(id)
      .then(cordinates => {
        this.setState({
          cid: id,
          lat: cordinates[0],
          lng: cordinates[1],
          markAddPhoto: [cordinates],
          zoom: 4,
        })
      })
      .catch(() => {
        this.setState({
          cid: id,
          markAddPhoto: [],
          zoom: 2,
        })
      })
  }

  // createBackgroundFlag(id) {
  //   return (
  //     <svg className="backgroundSVG" key={id} style={{
  //       position: "absolute",
  //       top: '0',
  //       height: '100%',
  //       width: '100%',
  //     }}>
  //       <defs>
  //         <pattern id={`imgpattern_${id}`}  width="1" height="1">
  //           <image width='100%' /*preserveAspectRatio="xMidYMin meet"*/
  //             xlinkHref={`https://restcountries.eu/data/${id.toLowerCase()}.svg`} />
  //         </pattern>
  //       </defs>
  //     </svg>
  //   )
  // }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <React.Fragment>
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
            onMouseOver={this.onMouseOver.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
            onClick={(evt) => this.onClickAddCustomElement(evt.layer.feature.id)}
          >

          </GeoJSON>
          {this.state.markAddPhoto.map((position, id) =>
            <Marker
              position={position}
              key={id}
              icon={this.customIconMarker}
              onClick={() => this.props.setMainState(this.state.cid)}
            />
          )}
        </Map >
        <div className="showCountry">{this.state.country}</div>
        {/* {this.countrys.map((flag) => this.createBackgroundFlag(flag))} */}
        {/* <svg className="backgroundSVG">
          <defs>
            <pattern id="imgpattern" x="0" y="0" width="1" height="1">
              <image width="100" height="250"
                xlinkHref="https://restcountries.eu/data/qat.svg" />
            </pattern>
          </defs>
        </svg> */}
      </React.Fragment>
    )
  }
}