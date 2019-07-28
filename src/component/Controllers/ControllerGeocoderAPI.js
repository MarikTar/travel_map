import FireBase from '../Auth/FireBase';
import FromDB from './ControllerFromDB';

export default class ControllerGeocoder {
	constructor(lat, lon, ref, callback, cord) {
		this.APIKEY = 'fc519a0c1086459597e8ce63f9b77143';
		this.APIURL = `https://api.opencagedata.com/geocode/v1/json?key=${this.APIKEY}&q=${encodeURIComponent(lat.toString() + ',' +lon.toString())}&pretty=1&no_annotations=1&language=en`;
		this.uid = FireBase.firebase.auth().currentUser.uid;
		this.ref = ref;
		this.cb = callback;
		this.cord = cord;
		this.init();
	}

	init() {
		this.get();
	}

	async get() {
		const response = await fetch(this.APIURL).then(response => {
			if (response.ok) {
				return response.json();
			}
		});
		
		const { results } = response;
		FireBase.firebase.database().ref(this.ref)
			.set({
				"lat": this.cord.GPSLatitude,
				"lon": this.cord.GPSLongitude,
				"country": results[0].components.country,
				"city": results[0].components.city
			});
			new FromDB(this.cb);
	}
}