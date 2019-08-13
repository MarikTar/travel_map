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
		this.base_url = `users/${this.uid}/photos`;
	}

	async getGeocoder(ref, update, coordinates) {
		const response = await fetch(this.APIURL).then(response => {
			if (response.ok) {
				return response.json();
			}
		});
		this.checkForCodeCountry(
			response, 
			ref, 
			update,
			coordinates
		);
	}

	checkForCodeCountry( // set
		{ results }, 
		ref, 
		update, 
		coordinates
		) {
		const country_code = results[0].components['ISO_3166-1_alpha-3'];
		
		FireBase.firebase.database()
		.ref()
		.child(`${this.base_url}`)
		.once('value')
		.then(snaphot => {
			const data = snaphot.val();
			let a = {};

			if (!data) {
				this.setDataDB(ref, country_code, coordinates);
			} else {
				const code = country_code.toLowerCase();

				Object.values(data).forEach(item => {
					if (!item.hasOwnProperty(item[`code_${ code }`])) {
						this.updateDataDB(ref, country_code, coordinates);
					}

					for (let key in item) {
						if (key.includes('code_')) {
							a['id'] = item[key];
						} else {
							a[key] = item[key];
						}
					}
				});
			}
			
			this.serviceDB.getDataGpsFromDB(update, this.file, country_code);
			update(false, a, true);
		})
		
		this.serviceStore.addFileStore(country_code, this.file);
	}

	setDataDB(
		ref, 
		country_code,
		coordinates
		) {
		FireBase.firebase.database().ref(`${ref}/${country_code}`)
			.set({
				"lat": coordinates.GPSLatitude,
				"lon": coordinates.GPSLongitude,
				[`code_${ country_code.toLowerCase() }`]: country_code
			});
	}

	updateDataDB(ref, country_code, coordinates) {
		FireBase.firebase.database().ref(`${ref}/${country_code}`)
			.update(
				{
					[`code_${ country_code.toLowerCase() }`]: country_code,
					"lat": coordinates.GPSLatitude,
					"lon": coordinates.GPSLongitude,
				});
	}
}