import React from 'react';
import Modal from 'react-awesome-modal';

import './galeria.css';
window.URL = window.URL || window.webkitURL;

export default class Item extends React.Component {
    constructor() {
        super();
        this.state = {
            visible : false
        }
    }

    openModal() {
        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

    render() {
        const img = this.props.image;
        const imgURL = window.URL.createObjectURL(img);
        return ( 
            <div className="item" key={img.name}>
                <a href="javascript:void(0);" onClick={() => this.openModal()}>
                    <img src={imgURL} alt={img.name}/>
                </a>
                <Modal visible={this.state.visible} width="500" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div>
                        <div className='pop-image'><img src={imgURL} alt={img.name}/></div>
                        <a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
                    </div>
                </Modal>
            </div>
        )
    }
}