import FireBase from "../Firebase/FireBase";

export default class ServiceFirebaseStore {
  uid = FireBase.firebase.auth().currentUser.uid;
  baseAvataUrl = 'user/cloud-avatar-user';
  baseCloudPhoto = 'user/cloud-photos';

	updateProfileUserAvatar(pictureFile, loading, setUrl) {
		if (!loading) {
      return;
		}
		
		const avatarRef = FireBase.firebase.storage().ref(`${this.baseAvataUrl}/${this.uid}/avatar`);
		avatarRef.put(pictureFile).then( snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        FireBase.firebase.auth().currentUser.updateProfile({photoURL: url})
          .then(() => {
            FireBase.firebase.database().ref(`${this.baseAvataUrl}/${this.uid}`)
              .set({"avatar": url});
              setUrl(url);
          }, error => console.log(error));
      })
    });
  }
  
  getStoreDefaultAvatar(setAvatar) {
    const ref = FireBase.firebase.storage().ref(`${this.baseAvataUrl}/default-avatar/user.png`);
    ref.getDownloadURL()
     .then(url => {
        fetch(url).then(res => {
          if (res.ok) {
            return res.blob();
          }
        })
        .then(data => setAvatar(window.URL.createObjectURL(data)));
      })
  }

  addFileStore(country, file) {
    FireBase.firebase.storage().ref(`${this.baseCloudPhoto}/${this.uid}/${country}/${file.name}`)
      .put(file);
  }
}