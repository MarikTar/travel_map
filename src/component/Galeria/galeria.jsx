import React from 'react';
import Item from './item';
import FireBase from "../Auth/FireBase";

import './galeria.css';

window.URL = window.URL || window.webkitURL;

export default class Galeria extends React.Component {
    render() {
        // console.log(this.props.images);
        
        return ( 
            <div className='galeria'>
                {this.props.images.map((image, key) =>  <Item image={image} key={key} /> )}
            </div>
        )
    }
}