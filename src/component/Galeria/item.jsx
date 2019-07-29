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
        return ( 
            <div className="item" key={img}>
                <a href="javascript:void(0);" onClick={() => this.openModal()}>
                    <img src={img} alt={img}/>
                </a>
                <Modal visible={this.state.visible} width="500" height="500" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div>
                        <div className='pop-image'><img src={img} alt={img}/></div>
                        <a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>
                    </div>
                </Modal>
            </div>
        )
    }
}