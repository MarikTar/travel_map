import React from 'react';
import Item from './item';
import FireBase from "../Auth/FireBase";

import './galeria.css';
import Loader from './loader.gif'

window.URL = window.URL || window.webkitURL;

export default class Galeria extends React.Component {
    constructor() {
        super();
        this.state = {
            rerender: false
        }
    }
    updateGaleria(value) {
        this.setState({
            rerender: value
        })
    }
    render() {
        return ( 
            !this.props.showGaleria ? <img src={Loader} alt="Loader"/> :
            <div className='galeria'>
                {this.props.images.map((image, key) => 
                    <Item image={image.image}
                          title={image.title}
                          country={this.props.country}
                          updateGaleria={false}
                          key={key}/> )}
            </div>
        )
    }
}