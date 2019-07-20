import React from 'react';
import countryArr from './country.jsx';
import './css/country_list.css'

export default class CountryList extends React.Component {
    constructor(props){
        super(props)

        this.state={
            country: null,
            openWindow: false,
        }
    }
    openWindow(country){
        this.setState({
            country: country,
            openWindow: true,
        })
    }
    render() {
        return (
            <div className={'country_list'}>
                {countryArr.map((countrys) =>
                    <Country
                        country={countrys.en}
                        key={countrys.en}
                        openWindow={this.openWindow.bind(this)}
                    />
                )}
            </div>
        )
    }
}

class Country extends React.Component {
    onAdd(){
        this.props.openWindow(this.props.country)
    }
    render() {
        return (
            <div className={'list'}>
                {this.props.country}
                <AddPhoto add={this.onAdd.bind(this)}/>
            </div>
        )
    }
}

class AddPhoto extends React.Component {
    onClick(){
        this.props.add();
    }
    render() {
        return (
            <img src="" alt="add" onClick={this.onClick.bind(this)}/>
        )
    }
}