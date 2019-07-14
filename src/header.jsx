import React from 'react';
import './css/header.css'

export default class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <div id='logo_text'>Travel map</div>
                <div id='logo_title'>name_of_region</div>
                <div className={'right_nav'}>
                    <input type="file" id="add_all_photo" accept="image/jpeg,image/png" multiple></input>
                    <button>Log out</button>
                </div>
            </div>
        )
    }
}