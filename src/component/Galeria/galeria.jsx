import React from 'react';
import Item from './item';

import './galeria.css';

window.URL = window.URL || window.webkitURL;

export default class Galeria extends React.Component {
    render() {
        return ( 
            <div className='galeria'>
                {this.props.images.map((image) => {
                    return <Item image={image} />
                })}
            </div>
        )
    }
}