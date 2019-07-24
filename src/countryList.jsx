import React from 'react';
import countriesList from './json/coyntries.json';
import './css/country_list.css'

export default class CountryList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            country: null,
            openWindow: false,
            filter: '',
        }
    }
    openWindow(country) {
        this.props.setMainState(country)
    }

    filterCountries(event) {
        let filtertext = event.target.value.trim();
        this.setState({
            filter: filtertext.toLowerCase(),
        })
    }
    render() {
        return (
            <div className={'country_list'}>
                <input id='filterCountries' type="text" onChange={this.filterCountries.bind(this)} />
                {countriesList.map((countrys) => {
                    if (countrys.name.toLowerCase().indexOf(this.state.filter) !== -1) {
                        return <Country
                            country={countrys.name}
                            key={countrys.name}
                            openWindow={this.openWindow.bind(this)}
                        />
                    } else {
                        return null;
                    }
                })}
            </div>
        )
    }
}

class Country extends React.Component {
    onAdd() {
        this.props.openWindow(this.props.country)
    }
    render() {
        return (
            <div className={'list'}>
                {this.props.country}
                <AddPhoto add={this.onAdd.bind(this)} />
            </div>
        )
    }
}

class AddPhoto extends React.Component {
    onClick() {
        this.props.add();
    }
    render() {
        return (
            <img src="" alt="add" onClick={this.onClick.bind(this)} />
        )
    }
}