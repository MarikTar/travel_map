import FireBase from '../Auth/FireBase';

export default class ControllerFromDB {
	constructor(callback) {
		this.uid = FireBase.firebase.auth().currentUser.uid;
		this.cb = callback;
		this.init();
	}

	init() {
		this.getDataFromDB();
	}

	getDataFromDB() {
		FireBase.firebase.database()
      .ref()
      .child(`user/cloud-photos/${this.uid}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();

        if (!data) {
          return;
        }

        Object.values(data).forEach(({ city, country, lat, lon }) => {
          this.cb(false, lat, lon, country);
        });
      }, error => console.log(error));
	}
}