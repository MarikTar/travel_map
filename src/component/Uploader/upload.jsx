import React from 'react';
import uploadImg from './Upload.svg'
import Galeria from '../Galeria/galeria';
import FireBase from "../../Firebase/FireBase";
import ServiceDB from '../../Services/ServiceDB';

import './uploader.css';
window.URL = window.URL || window.webkitURL;

export default class Upload extends React.Component {
    
    serviceDB = new ServiceDB();
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            openWindow: false,
        }   
        this.user = FireBase.firebase.auth().currentUser;
    }

    componentWillReceiveProps(props) {
        this.setState({
            openWindow: props.showUploader
        });
        this.setState({
            images: [],
            uploaderHeight: props.uploaderHeight
        });
    } 

    addImages(fileList) {
        this.serviceDB.setCountryAtDB(this.props.country, this.props.id);
        for(let i = 0; i < fileList.length; i += 1) {
            const img = fileList[i];
            const photoBase = FireBase.firebase.storage().ref(`user/cloud-photos/${this.user.uid}/${this.props.country}/${img.name}`);
            if (!img.type.startsWith('image/')) { 
                continue;
            }
            const images = this.state.images;
            const imgURL = window.URL.createObjectURL(img);           
            if(!this.props.imageTitles.some(name => name === img.name) && !images.some(({title}) => title === img.name)) {
                images.push({
                    image: imgURL,
                    title: img.name
                });
                photoBase.put(img);  
                this.setState({
                    images: images,
                    country: this.props.country,
                    uploaderHeight: '100px'
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

    closeUploader() {
        this.setState({
            openWindow: false
        })
    }

    render() {
        let propImages = [];
        for(let i = 0; i < this.props.images.length; i += 1) {
            propImages.push({
                image: this.props.images[i],
                title: this.props.imageTitles[i]
            });
        }
        let images = [...propImages,...this.state.images];  
        console.log("some log");
        
        return (
           <div className="uploader" 
                style={{display: this.state.openWindow ? "flex" : "none",}}>
               <button onClick={() => this.closeUploader()} id="close-uploader">✖</button>{/*✖ ⚔ ⚔️*/}
                <div id="upload-container" 
                    style={{
                        height: this.state.uploaderHeight
                    }} 
                    onDragEnter={(e) => this.onDragOverEnter(e)}
                    onDragOver={(e) => this.onDragOverEnter(e)}
                    onDragLeave={(e) => this.onDragLeave(e)}
                    onDrop={(e) => this.onDragDrop(e)}>
                    {/* <img id="upload-image" src={uploadImg} alt='upload'/> */}
                    <div>
                        <input id="file-input" onChange={(e) => this.onChange(e)}
                               type="file" 
                               name="file" 
                               multiple accept="image/*"
                               ref={input => input && input.focus()}/>
                        <label htmlFor="file-input">Browse photos</label>
                        <span> or drag them here</span>
                    </div>
                </div>
                <Galeria images={images} 
                         country={this.props.country}
                         showGaleria={this.props.showGaleria}
                         clearCountry={this.props.clearCountry}/>
           </div>
        )
    }
}