import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/map.css';
import countriesJSON from './json/countries.geo.json';
//import countriesList from './json/coyntries.json';
// import styleJson from './styleJSON';

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
function apiController(countries) {
    return fetch(`https://restcountries.eu/rest/v2/alpha/${countries}/?fields=latlng`)
        .then(response => response.json())
}

export default class Map extends React.Component {
    geojson = L.geoJSON(countriesJSON, {
        style: this.styleJson.bind(this),
        onEachFeature: this.onEachFeature.bind(this)
    });
    tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        minZoom: 2,
        maxZoom: 5,
    });
    //пока в процессе!!
    icon = L.divIcon({
        html: `<button id='bap'>TEST</button>`,
        className: 'iconButtonAddPhoto',
    })

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

    //пока в процессе!!
    onClick(e) {
        let countryId = e.target.feature.id;
        if (this.buttonAddPhoto) {
            this.buttonAddPhoto.remove(this.map)
        }

        apiController(countryId)
            .then(data => {
                const coord = data.latlng;
                this.buttonAddPhoto = L.marker(coord, { icon: this.icon })
                this.buttonAddPhoto.addTo(this.map);
                //test
                const BAP = document.getElementById('bap');
                BAP.addEventListener('click', ()=> console.log(coord))
            })
    }

    onEachFeature(feature, layer) {
        const country = feature.properties.name;
        layer.on({
            'mouseover': this.highlightFeature,
            'mouseout': this.resetHighlight.bind(this),
            'click': () => this.props.setMainState(country) //this.onClick.bind(this)
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
    }
    render() {
        return (
            <div id="mapid"></div>
        )
    }
}



//https://leaflet-extras.github.io/leaflet-providers/preview/