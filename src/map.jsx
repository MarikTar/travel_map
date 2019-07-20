import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './css/map.css';
import countriesJSON from './countries.geo.json'

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
console.log(countriesJSON);

export default class Map extends React.Component{

    componentDidMount(){
        this.map =  L.map('mapid',{
            center: [ 55,10],
            zoom: 6,
            zoomControl:true,
        });

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            minZoom: 2,
            maxZoom: 4,
        }).addTo(this.map)

        L.geoJSON(countriesJSON).addTo(this.map)
    }
    render(){
        return(
            <div id="mapid"></div>
        )
    }
}



//https://leaflet-extras.github.io/leaflet-providers/preview/