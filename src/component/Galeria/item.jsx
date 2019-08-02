import React from 'react';
import Modal from 'react-awesome-modal';
import FireBase from "../../Firebase/FireBase";

import './galeria.css';
window.URL = window.URL || window.webkitURL;

export default class Item extends React.Component {
    constructor() {
        super();
        this.state = {
            visible : false
        }
    }

    deleteUser() {
        const user = FireBase.firebase.auth().currentUser;
        const countryRef = FireBase.firebase.storage().ref(`user/cloud-photos/${user.uid}/${this.props.country}`);
        const imageRef = countryRef.child(`${this.props.title}`);
        imageRef.delete().then(function() {
            // File deleted successfully
          }).catch(function(error) {
            // Uh-oh, an error occurred!
          });
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
                <button onClick={() => this.deleteUser()}>X</button>
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