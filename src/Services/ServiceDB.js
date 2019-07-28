import FireBase from "../Firebase/FireBase";

export default class ServiceDB {
	uid = FireBase.firebase.auth().currentUser.uid;

	getDataFromDB(callback) {
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
        });
      }, error => console.log(error));
	}
}