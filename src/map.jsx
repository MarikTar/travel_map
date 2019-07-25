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
    geojson = L.geoJSON(countriesJSON, {
        style: this.styleJson.bind(this),
        onEachFeature: this.onEachFeature.bind(this)
    });
    tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 2,
        maxZoom: 5,
    });
    /*
    icon = L.divIcon({
        html: `<button>TEXT</button>`,
        className: 'icon123123',
    })
    testAddIco = L.marker([50.505, 30.57], {icon: this.icon})
    */
    styleJson(feature) {
        return {
            color: '#000',
            weight: 1.5,
            fillOpacity: this.Opacity(feature.properties.name) || 0.8,
            className: feature.properties.name
        }
    }

    Opacity(fullCountry) {
        for (let key in this.props.activCountry) {
            if (this.props.activCountry[key][fullCountry]) {
                return 0.2
            }
        }
    }
    tileLayer() {
        return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            {
                minZoom: 2,
                maxZoom: 5,
            }
        )
    }

    highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#666',
            fillOpacity: 0.7,
        })
    }
    resetHighlight(e) {
        this.geojson.resetStyle(e.target)
    }

    onEachFeature(feature, layer) {
        const country = feature.properties.name;
        layer.on({
            'mouseover': this.highlightFeature,
            'mouseout': this.resetHighlight.bind(this),
            'click': () => this.props.setMainState(country)
        });
    }

    componentDidMount() {
        this.map = L.map('mapid', {
            center: [55, 10],
            zoom: 2,
            zoomControl: true,
            maxBounds: [[90, -180], [-70, 180]],
        });
        this.tileLayer.addTo(this.map)
        this.geojson.addTo(this.map);
        //this.testAddIco.addTo(this.map)
    }
    render() {
        return (
            <div id="mapid"></div>
        )
    }
}



//https://leaflet-extras.github.io/leaflet-providers/preview/