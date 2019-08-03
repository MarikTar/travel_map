import React from 'react';
// import countriesList from './countries.json';
import countryList from '../MapLeaflet/map.geo.json';
import { Scrollbars } from 'react-custom-scrollbars';
import './countris.css';

export default class CountryList extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: '',
		}
	}
	openWindow (country) {
		this.props.setMainState(country);
	}

	filterCountries(event) {
		let filtertext = event.target.value.trim();
		this.setState({
				filter: filtertext.toLowerCase(),
		})
	}
	componentWillMount() {
		countryList.features.sort(function (a, b) {
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
				<div className="search">
					<input id='filterCountries' type="text" className="input-search" placeholder="Search" onChange={this.filterCountries.bind(this)} />
					<span className="icon-magnifier" />
				</div>
				<Scrollbars
					style={{ height: 'calc(100vh - 65px)' }}
				>
					<div className={'country_list'}>
						{countryList.features.map((countrys) => {
							if (countrys.properties.name.toLowerCase().indexOf(this.state.filter) !== -1) {
								return(
									<Country
										country={countrys.properties.name}
										key={countrys.properties.name}
										openWindow={this.openWindow.bind(this)}
									/>
								)
							} else {
								return null;
							}
						})}
					</div>
				</Scrollbars>
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
			<div className="item">
				<span className="item-country">{this.props.country}</span>
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
			<button className="button-add" onClick={this.onClick.bind(this)}>
				<span className="icon-add" title="add" />
			</button>
		)
	}
}