import React from 'react';

export default class Header extends React.Component{
    render(){
        return(
            <div className="header">
                <div id='logo_text'>Travel map</div>
                <div id='logo_text'>name_of_region</div>
                
                <input type="file" id="add_all_photo" accept="image/jpeg,image/png" multiple></input>
            </div>
        )
    }
}