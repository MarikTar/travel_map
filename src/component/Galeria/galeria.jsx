import React from 'react';
import Item from './item';

import './galeria.css';
import Loader from './loader.gif'

window.URL = window.URL || window.webkitURL;

export default class Galeria extends React.Component {
    constructor() {
        super();
    }
    render() {
        return ( 
            !this.props.showGaleria ? <img src={Loader} alt="Loader"/> :
            <div className='galeria'>
                {this.props.images.map((image, key) => 
                    <Item image={image.image}
                          title={image.title}
                          country={this.props.country}
                          key={key}/> )}
            </div>
        )
    }
}