import FireBase from "../Firebase/FireBase";
import ServiceFirebaseStore from './ServiceFirebaseStore';

export default class ServiceDB {
  uid = FireBase.firebase.auth().currentUser.uid;
  serviceStore = new ServiceFirebaseStore();

  appealToDB(ref) {
    return FireBase.firebase.database()
    .ref()
    .child(ref)
    .once("value")
  }

	getDataGpsFromDB(callback, file) {
		this.appealToDB(`user/cloud-photos/${this.uid}`)
      .then(snapshot => {
        const data = snapshot.val();

        if (!data.location) {
          return;
        }

        Object.values(data.location).forEach(({ city, country, lat, lon }) => {
          callback(false, lat, lon, country);

          if (file) {
            this.serviceStore.addFileStore(country, file)
          }
        });
      }, error => console.log(error));
  }
  
  setCountryAtDB(country, id) {
    FireBase.firebase.database().ref(`user/cloud-photos/${this.uid}/countrys`)
			.update({[`country-${id.toLowerCase()}`]: country});
  }

  getCountriesFromDB(callback, array) {
    this.appealToDB(`user/cloud-photos/${this.uid}/countrys`)
      .then(snapshot => {
        const countrys = snapshot.val();
        if (!countrys) {
          return;
        }

        callback(array.concat(Object.values(countrys)));
      });
  }
}