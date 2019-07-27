import React from 'react';

window.URL = window.URL || window.webkitURL;

export default class Galeria extends React.Component {
    constructor(props) {
        super();
        this.state = {
            images: props.images
        }
    }

    render() {
        return (
            <div>
                {this.state.images.map((img, key) => <img src={window.URL.createObjectURL(img)} key={key}/>)}
            </div>
        )
    }
}