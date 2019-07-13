import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css'

export default class Map extends React.Component{

    componentDidMount(){
        this.map =  L.map('mapid',{
            center: [ 58,16],
            zoom: 6,
            zoomControl:false
        });

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            minZoom: 4,
            maxZoom: 4,
        }).addTo(this.map)
    }
    render(){
        return(
            <div id="mapid"></div>
        )
    }
}

//https://leaflet-extras.github.io/leaflet-providers/preview/