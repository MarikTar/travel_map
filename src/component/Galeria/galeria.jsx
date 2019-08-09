import React from 'react';
import Item from './item';

import './galeria.css';
import Loader from '../../source/loader.gif'

window.URL = window.URL || window.webkitURL;

export default class Galeria extends React.Component {
    constructor() {
        super();
        this.state = {
            images: []
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            images: props.images
        })
    }

    componentDidUpdate(props) {
        if(this.state.images.length === 0) {
            this.props.clearCountry(props.country)
        }
    }

    deleteImage(index) {
        const images = this.state.images;
        images.splice(index, 1);
        this.setState({
            images
        });
    }

    render() {
        return ( 
            !this.props.showGaleria ? <img src={Loader} alt="Loader" className="loader"/> :
            <div className='galeria'>
                {this.state.images.map((image, index) => 
                    <Item image={image.image}
                          title={image.title}
                          country={this.props.country}
                          key={image.title}
                          index={index}
                          deleteImage={this.deleteImage.bind(this)}/>
                )}
            </div>
        )
    }
}