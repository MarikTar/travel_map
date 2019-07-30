import React from 'react';
//import countriesList from '../json/countries.json';
import countriesList from '../json/countries.geo.json';
import './style/country_list.css'

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
    componentWillMount() {
        countriesList.features.sort(function (a, b) {
            if (a.properties.name > b.properties.name) {
                return 1;
            }
            if (a.properties.name < b.properties.name) {
                return -1;
            }
            return 0;
        });
    }
    render() {
        return (
            <div>
                <input id='filterCountries' type="text" onChange={this.filterCountries.bind(this)} />
                <div className={'country_list'}>
                    {countriesList.features.map((countrys) => {
                        if (countrys.properties.name.toLowerCase().indexOf(this.state.filter) !== -1) {
                            return <Country
                                country={countrys.properties.name}
                                key={countrys.properties.name}
                                openWindow={this.openWindow.bind(this)}
                            />
                        } else {
                            return null;
                        }
                    })}
                </div>
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