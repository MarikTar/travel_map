import FireBase from "../Firebase/FireBase";
import store from '../Storage/store';
import ServiceDB from './ServiceDB';

export default class ServiceFirebaseStore {
  uid = FireBase.firebase.auth().currentUser.uid;
  baseAvataUrl = `users/${this.uid}/avatar`;
  baseCloudPhoto = `users/${this.uid}/photos`;

  connect(ref) {
    return FireBase.firebase.storage().ref(ref);
  }

	updateProfileUserAvatar(pictureFile, callback) {		
    this.connect(`${this.baseAvataUrl}`)
		.put(pictureFile).then( snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        FireBase.firebase.auth().currentUser.updateProfile({photoURL: url})
          .then(() => {
            FireBase.firebase.database().ref(`${this.baseAvataUrl}/${this.uid}`)
              .set({"avatar": url});
              callback(url);
          }, error => console.log(error));
      })
    });
  }
  
  getStoreDefaultAvatar(setAvatar) {
    this.connect(`users/default_avatar/avatar.png`)
    .getDownloadURL()
     .then(url => {
        fetch(url).then(res => {
          if (res.ok) {
            return res.blob();
          }
        })
        .then(blob => {
          const reader = new FileReader();
          reader.readAsDataURL(blob); 
          reader.onloadend = () => setAvatar(reader.result);
        });
      })
  }

  addFileStore(id, file) {
    return this.connect(`${this.baseCloudPhoto}/${id}/${file.name}`)
    .put(file);
  }

  updateCollection(
    id, 
    url, 
    { name }, 
    update, 
    isPresent, 
    countrysID,
    fileUpload,
    getData,
    uploadedFile
    ){
    const countId = `code_${id.toLowerCase()}`;

    if ((!store.length || store.length > 0) && !isPresent) {
      store.push({
        [countId]: [{url, name}]
      });
    }

    store.forEach(item => {
      if (isPresent && item.hasOwnProperty(countId)) {
        if (!item[countId].length) {
          item[countId].push({url, name});
        }
        const coincidence = item[countId].every(value => value.name !== name);

        if (coincidence) {
          item[countId].push({url, name});
        }
      }
    });

    if (!countrysID.includes(id)) {
      new ServiceDB().checkForId(getData, id);
    }

    if (fileUpload) {
      update(true, false, true);
    }
  }

  getCollectionPhoto(
    id,
    uploadedFile, 
    update, 
    countrysID = [],
    fileUpload,
    getData,
    ){

    if (this.isEmptyStoreCountryID(id) && !uploadedFile) {
      update(true, false, this.isEmptyStoreData(id));
      return;
    }

    if (!uploadedFile) {
      update(true, false, this.isEmptyStoreData(id));
      return;
    }

    this.connect(`${this.baseCloudPhoto}/${id}`)
    .listAll()
    .then(({ items }) => {
      if (items.length) {
        items.forEach(photo => {
          const item = this.connect(photo.fullPath);
          const countId = `code_${id.toLowerCase()}`;

          item.getDownloadURL()
          .then(url => {
            let isPresent = false;

            store.forEach(item => {
              if (item.hasOwnProperty(countId)) {
                isPresent = true;
                return;
              }
            });

            this.updateCollection(
              id, 
              url, 
              photo, 
              update, 
              isPresent,
              countrysID,
              fileUpload,
              getData,
              uploadedFile
            );
          })
          .catch(err => console.log(err));
        });
      }
    });
  }

  isEmptyStoreCountryID(id) {
    if (!id) {
      return;
    }

    const countId = `code_${id.toLowerCase()}`;
    let isCountry = false;

    store.forEach(item => {
      if (item.hasOwnProperty(countId)) {
        isCountry = true;
        return;
      }
    });

    return isCountry;
  }

  isEmptyStoreData(id) {
    if (!id) {
      return;
    }

    const countId = `code_${id.toLowerCase()}`;
    let isData = false;

    store.forEach(item => {
      if (item.hasOwnProperty(countId) && item[countId].length > 0) {
        isData = true;
        return;
      }
    });

    return isData;
  }

  removeStorageFile({ id }, items) {
    items.forEach(item => {
      FireBase.firebase.storage()
      .ref(`${this.baseCloudPhoto}/${id}`)
      .child(item)
      .delete()
    })
  }
}