import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/map.css';
import countriesJSON from './json/countries.geo.json';
// import styleJson from './styleJSON';
// import countriesList from './json/coyntries.json';

/*
Добавление иконки
let myIcon = L.icon({
    iconUrl: 'my-icon.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});
*/

export default class Map extends React.Component {
    styleJson(feature) {
        return {
            color: '#000',
            weight: 2,
            fillOpacity: this.Opacity(feature.properties.name) || 0.8
        }
    }

    Opacity(fullCountry) {  
        for (let key in this.props.activCountry) {
            if(this.props.activCountry[key][fullCountry]){
                return 0.2
            }
        }
    }

    componentDidMount() {
        this.map = L.map('mapid', {
            center: [55, 10],
            zoom: 6,
            zoomControl: true,
        });

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            minZoom: 2,
            maxZoom: 5,
        }).addTo(this.map)

        L.geoJSON(countriesJSON, {
            style: this.styleJson.bind(this),
        }).addTo(this.map)
    }
    render() {
        return (
            <div id="mapid"></div>
        )
    }
}



//https://leaflet-extras.github.io/leaflet-providers/preview/