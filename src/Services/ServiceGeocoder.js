import FireBase from "../Firebase/FireBase";
import ServiceDB from './ServiceDB';

export default class ServiceGeocoder {
	serviceDB = new ServiceDB();

	constructor(lat, lon, file) {
		this.APIKEY = 'fc519a0c1086459597e8ce63f9b77143';
		this.APIURL = `https://api.opencagedata.com/geocode/v1/json?key=${this.APIKEY}&q=${encodeURIComponent(`${lat.toString()},${lon.toString()}`)}&pretty=1&no_annotations=1&language=en`;
		this.uid = FireBase.firebase.auth().currentUser.uid;
		this.file = file;
	}

	async getGeocoder(ref, callback, coordinates) {
		const response = await fetch(this.APIURL).then(response => {
			if (response.ok) {
				return response.json();
			}
		});
		
		this.setDataDB(response, ref, callback, coordinates);
	}

	setDataDB({ results }, ref, callback, coordinates) {
		if (!results.length) {
			console.log('foo')
			return;
		}
		console.log('bar')

		FireBase.firebase.database().ref(ref)
			.set({
				"lat": coordinates.GPSLatitude,
				"lon": coordinates.GPSLongitude,
				"country": results[0].components.country,
				"city": results[0].components.city
			});
		this.serviceDB.getDataFromDB(callback, this.file);
	}
}