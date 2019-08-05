import FireBase from "../Firebase/FireBase";
import ServiceFirebaseStore from './ServiceFirebaseStore';
import ServiceDB from './ServiceDB';
import shortid from 'shortid';

export default class ServiceGeocoder {
	serviceDB = new ServiceDB();
	serviceStore = new ServiceFirebaseStore();

	constructor(lat, lon, file) {
		this.APIKEY = 'fc519a0c1086459597e8ce63f9b77143';
		this.APIURL = `https://api.opencagedata.com/geocode/v1/json?key=${this.APIKEY}&q=${encodeURIComponent(`${lat.toString()},${lon.toString()}`)}&pretty=1&no_annotations=1&language=en`;
		this.uid = FireBase.firebase.auth().currentUser.uid;
		this.file = file;
		this.generateId = shortid.generate();
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
		const country = results[0].components.country;

		if (!country) {
			return;
		}

		FireBase.firebase.database()
			.ref()
			.child(`user/cloud-photos/${this.uid}/countrys`)
			.once("value")
      .then(snapshot => {
				const countrys = snapshot.val();
				
				if (!countrys || !Object.values(countrys).includes(country)) {
					FireBase.firebase.database().ref(`${ref}/photo-${this.generateId}`)
					.set({
						"lat": coordinates.GPSLatitude,
						"lon": coordinates.GPSLongitude,
						"country": country
					});
					this.serviceDB.getDataGpsFromDB(callback, this.file);
				} else {
					callback(false, null, null, null);
					this.serviceStore.addFileStore(country, this.file)
				}
			});
	}
}