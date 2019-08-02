import FireBase from "../Firebase/FireBase";
import ServiceFirebaseStore from './ServiceFirebaseStore';

export default class ServiceDB {
  uid = FireBase.firebase.auth().currentUser.uid;
  serviceStore = new ServiceFirebaseStore();

	getDataFromDB(callback, file) {
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
          callback(false, lat, lon, country);

          if (file) {
            this.serviceStore.addFileStore(country, file)
          }
        });
      }, error => console.log(error));
	}
}