import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { divIcon } from "leaflet";
import { Map, Marker, TileLayer, GeoJSON } from 'react-leaflet';
import MapGeo from './map.geo.json';
import ServiceGeoCordinate from '../../Services/ServiceGeoCordinats';
import './map.css';

export default class MapLeaFlet extends Component {
  static propTypes = {
    lat: PropTypes.number,
    lon: PropTypes.number,
    countrysID: PropTypes.array
  }

  serviceGeoCordinate = new ServiceGeoCordinate();
  customIconMarker = divIcon({
    html: `<div id="pin" class="map-marker"><button id="addPhoto" class="mark-btn"></button></div>`,
    className: 'iconButtonAddPhoto',
    iconAnchor: [20, 80],
    iconSize: [50, 80]
  });

  buttonAddPhoto = null;
  cid = null;

  state = {
    lat: 55,
    lng: 10,
    countrysID: [],
    markAddPhoto: []
  }

 componentDidMount() {
  const { countryID } = this.props;

   if (countryID.length) {
    this.setState(() => {
      return {
        countrysID: [
         ...countryID
       ]
      }
    });
   }
 }

  componentWillUpdate(nextProps, nextState) {
    const { countryID, cid, ...rest } = nextProps;

    if (this.cid !== cid && cid) {
      this.cid = cid;
      this.onClickAddCustomElement(cid)
    }

    // if (this.cid !== cid && cid) {
    //   this.cid = cid;
    //   this.onClickAddCustomElement(cid);
    // }

    // if (lat !== this.props.lat && lon !== this.props.lon) {
    //   this.setState(() => {
    //     return {
    //       marks: [
    //         ...marks,
    //         [ lat, lon ]
    //       ]
    //     }
    //   });
    // }

    if (nextProps.countryID !== this.props.countryID && nextProps.countryID !== nextState.countrysID) {
      this.setState(() => {
        return {
          countrysID: [
            ...countryID
          ]
        }
      });
    }
  }

  layerStyled({ id }) {
    return {
      color: '#000',
      fill: true,
      fillColor: '#323232',
      weight: 1.5,
      fillOpacity: this.markedСountries(id)
    }
  }

  markedСountries(id) {
    return this.state.countrysID.includes(id) ? 0.2 : 0.8;
  }

  onMouseOut(evt) {
    evt.target.resetStyle(evt.layer);
    // this.setState({
    //   country: null,
    // })
  }

  onMouseOver(evt) {
    const ctx = evt.layer;
    const countryHover = ctx.feature.properties.name
    // this.setState({
    //   country: countryHover,
    // })
    if (typeof ctx.setStyle === 'function') {
      ctx.setStyle({
        weight: 3,
        color: '#666',
        fillColor: '#333',
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
      <Map
        className="map"
        center={position}
        zoom={3}
        maxBounds={[[90, -180], [-70, 180]]}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          minZoom={2}
          maxZoom={5}
        />
        <GeoJSON 
          data={ MapGeo } 
          style={ this.layerStyled.bind(this) }
          onMouseOver={ this.onMouseOver }
          onMouseOut={ this.onMouseOut }
          onClick={(evt) => this.onClickAddCustomElement(evt.layer.feature.id)}
        />
        {this.state.markAddPhoto.map((position, id) => 
          <Marker 
            key={ id }
            position={ position }
            icon={this.customIconMarker}
            onClick={() => this.props.setMainState(this.state.cid)}
          />
        )}
      </Map>
    )
  }
}