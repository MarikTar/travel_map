import FireBase from "../Firebase/FireBase";
import ServiceFirebaseStore from './ServiceFirebaseStore';
import store from '../Storage/store';

export default class ServiceDB {
  serviceStore = new ServiceFirebaseStore();

  uid = FireBase.firebase.auth().currentUser.uid;
  user = FireBase.firebase.auth().currentUser;
  base_url = `users/${this.uid}/photos`;

  appealToDB(ref) {
    return FireBase.firebase.database()
    .ref()
    .child(ref)
    .once("value")
  }

	getDataGpsFromDB(updateGpsLocation, file, id) {
		this.appealToDB(`${this.base_url}`)
      .then(snapshot => {
        const { location } = snapshot.val() || {};
        const data = {};

        if (location) {
          Object.values(location).forEach(item => { //({ lat, lon, ...code })
            if (!item.hasOwnProperty('lat') || !item.hasOwnProperty('lon')) {
              return;
            }

            for (let key in item) {
              if (key.includes('code_')) {
                data['id'] = item[key];
              } else {
                data[key] = item[key];
              }
            }

            if (file) {
              this.serviceStore.addFileStore(id, file)
            }
          })
        }

        updateGpsLocation(
          false,
          data,
          true
        );
      }, error => console.log(error));
  }
  
  checkForId(update, id) {
    FireBase.firebase.database()
		.ref()
		.child(`${this.base_url}`)
		.once('value')
		.then(snaphot => {
			const data = snaphot.val();

			if (!data) {
        this.setIDCountry(id);
			} else {
        const code  = id.toLowerCase();

        Object.values(data).forEach(item => {
					if (!item.hasOwnProperty(item[`code_${ code }`])) {
            this.updateId(id);
					}
				});
      }
      
      this.getCountriesFromDB(update);
		});
  }
  
  setIDCountry(id) {
    FireBase.firebase.database().ref(`${this.base_url}/location/${id}`)
			.set(
        {
          [`code_${id.toLowerCase()}`]: id
        }
      );
  }

  updateId(id) {
    FireBase.firebase.database().ref(`${this.base_url}/location/${id}`)
			.update(
        {
          [`code_${id.toLowerCase()}`]: id
        }
      );
  }
  getCountriesFromDB(callback, countrysID = []) {
    this.appealToDB(`${this.base_url}/location`)
      .then(snapshot => {
        const location = snapshot.val() ? Object.values(snapshot.val()) : [];
        const a = [];

        if (!location.length) {
          callback(a, true);
          return
        }

        location.forEach(item => {
          a.push(...Object.values(item));
        });

        callback(a.filter(val => typeof val === 'string'), true);
      });
  }

  deleteFromLocationDB(
    { id }, 
    update, 
    updateCountryID, 
    countrysID
  ) {
    const codeId = `code_${id.toLowerCase()}`;
    let b = true;

    store.forEach(item => {
      if (item[codeId] && !item[codeId].length) {
        FireBase.firebase.database()
          .ref(`${this.base_url}/location`)
          .child(id)
          .remove();
        this.getCountriesFromDB(updateCountryID, countrysID);
        b = false;
      }
      update(false, false, b);
    });
  }
}