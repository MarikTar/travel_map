import React from 'react';
import uploadImg from './Upload.svg'

window.URL = window.URL || window.webkitURL;

export default class Upload extends React.Component {
    constructor() {
        super();
        this.state = {
            images: []
        }
    }

    onChange(e) {
        let fileList = e.target.files
        for(let i = 0; i < fileList.length; i += 1) {
            let img = fileList[i];
            let images = this.state.images;
            images.push(window.URL.createObjectURL(img));
            this.setState({
                images: images
            });
        }
        // console.log(images);
        // this.setState({
        //     images: images
        // });
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
        for(let i = 0; i < fileList.length; i += 1) {
            let img = fileList[i];
            let images = this.state.images;
            images.push(window.URL.createObjectURL(img));
            this.setState({
                images: images
            });
        }
    }

    // handleFiles(files) {
    //         fileList.innerHTML = "";
    //         const list = document.createElement("ul");
    //         fileList.appendChild(list);
    //         for (let i = 0; i < files.length; i++) {
    //         const li = document.createElement("li");
    //         list.appendChild(li);
        
    //       const img = document.createElement("img");
    //       img.src = window.URL.createObjectURL(files[i]);
    //       img.height = 60;
    //       img.onload = function() {
    //         window.URL.revokeObjectURL(this.src);
    //       }
    //       li.appendChild(img);
    //       const info = document.createElement("span");
    //       info.innerHTML = files[i].name + ": " + files[i].size + " bytes";
    //       li.appendChild(info);
    //     }
    //   }

    render() {
        return (
            <div id="upload-container"  
                onDragEnter={(e) => this.onDragOverEnter(e)}
                onDragOver={(e) => this.onDragOverEnter(e)}
                onDragLeave={(e) => this.onDragLeave(e)}
                onDrop={(e) => this.onDragDrop(e)}>
                <img id="upload-image" src={uploadImg} alt='upload'/>
                <div>
                    <input id="file-input" onChange={(e) => this.onChange(e)}  type="file" name="file" multiple/>
                    <label htmlFor="file-input">Выберите файл</label>
                    <span> или перетащите его сюда</span>
                </div>
                {this.state.images.map((elem) => 
                    <img src={elem} key={elem}/>)
                    // console.log(this.state.images)
                }
            </div>
        )
    }
}