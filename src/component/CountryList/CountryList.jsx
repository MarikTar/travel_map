import React from 'react';
// import countriesList from './countries.json';
import countryList from '../MapLeaflet/map.geo.json';
import { Scrollbars } from 'react-custom-scrollbars';
import Uploader from '../Uploader/upload';
import FireBase from "../../Firebase/FireBase";

import './countris.css';

export default class CountryList extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			country: null,
			openWindow: false,
			filter: '',
			images: [],
			imageTitles: [],
			showGaleria: true
		}
	}

	openWindow(country) {
		this.setState({
			country,
			openWindow: true,
		});
		const user = FireBase.firebase.auth().currentUser;
		const storage = FireBase.firebase.storage();
		const imagesDir = storage.ref(`user/cloud-photos/${user.uid}/${country}`);
		let images = [];
		let titles = [];
		imagesDir.listAll().then(list => {
		let items = list.items; 
		if(items.length > 0) {
			this.setState({
				showGaleria: false
			})
			for (let i = 0; i < items.length; i += 1) {
				const element = storage.ref(items[i].fullPath);
				element.getMetadata().then(data => {
					titles[i] = data.name;
					this.setState({
					imageTitles: titles
					})
				});
		
				element.getDownloadURL()
				.then(url => {
					images[i] = url;
					this.setState({
					images: images
					});
				})
				.then(() => {
					this.setState({
					showGaleria: true
					})
				})
			} 
		}
		})
		.catch(err => console.log(err));
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
										showUploader={this.state.openWindow}
										images={this.state.images}
										imageTitles={this.state.imageTitles}
										showGaleria={this.state.showGaleria}
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
				<Uploader showUploader={this.props.showUploader}
							country={this.props.country}
							images={this.props.images}
							imageTitles={this.props.imageTitles}
							showGaleria={this.props.showGaleria}
							key={this.props.country}/>
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