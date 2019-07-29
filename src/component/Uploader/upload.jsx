import React from 'react';
import uploadImg from './Upload.svg'
import Galeria from '../Galeria/galeria';
import FireBase from "../Auth/FireBase";

import './uploader.css';
window.URL = window.URL || window.webkitURL;

export default class Upload extends React.Component {
    constructor() {
        super();
        this.state = {
            images: []
        }
        this.user = FireBase.firebase.auth().currentUser;
    }

    addImages(fileList) {
        for(let i = 0; i < fileList.length; i += 1) {
            let img = fileList[i];
            const photoBase = FireBase.firebase.storage().ref(`user/cloud-photos/${this.user.uid}/${this.props.country}/${img.name}`);
            if (!img.type.startsWith('image/')) { 
                continue; 
            }
            let images = this.state.images;
            if(!images.some(file => file.name === img.name)) {
                // this.uploadImageAsPromise(img);
                // images.push(img);
                images.push(window.URL.createObjectURL(img));
                photoBase.put(img);  
                this.setState({
                    images: images
                });
            }
        }
    }

    onChange(e) {
        let fileList = e.target.files;
        this.addImages(fileList);
    }

    onDragOverEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.add('dragover');
    }

    onDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        let rect = e.target.getBoundingClientRect();
        let dx = e.clientX - rect.left;
        let dy = e.clientY - rect.top;
        if ((dx < 0) || (dx >= rect.width) || (dy < 0) || (dy >= rect.height)) {
            e.target.classList.remove('dragover');
        };
    }

    onDragDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.remove('dragover');
        let fileList = e.dataTransfer.files;
        this.addImages(fileList);
    }
    componentWillReceiveProps() {
        // console.log(this.props.images);
    }
    render() { 
        let images = [...this.props.images, ...this.state.images];  

        return (
           <div className="uploader" style={{display: this.props.showUploader}}>
                <div id="upload-container"  
                    onDragEnter={(e) => this.onDragOverEnter(e)}
                    onDragOver={(e) => this.onDragOverEnter(e)}
                    onDragLeave={(e) => this.onDragLeave(e)}
                    onDrop={(e) => this.onDragDrop(e)}>
                    <img id="upload-image" src={uploadImg} alt='upload'/>
                    <div>
                        <input id="file-input" onChange={(e) => this.onChange(e)}
                               type="file" 
                               name="file" 
                               multiple accept="image/*"/>
                        <label htmlFor="file-input">Выберите файл</label>
                        <span> или перетащите его сюда</span>
                    </div>
                </div>
                <Galeria images={images} country={this.props.country}></Galeria>
           </div>
        )
    }
}