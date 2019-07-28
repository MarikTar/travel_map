export default class ControllerFlagAPI {
	constructor(country) {
		this.APIURL = `https://restcountries.eu/rest/v2/alpha/${country}/?fields=latlng`;
		this.init();
	}

	init() {
		this.get()
	}

	async get() {
		const response = await fetch(this.APIURL).then(response => {
			if (response.ok) {
				return response.json();
			}
		});
	}
}