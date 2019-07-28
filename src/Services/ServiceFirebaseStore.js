import FireBase from "../Firebase/FireBase";
import { async } from "q";

export default class ServiceFirebaseStore {
  uid = FireBase.firebase.auth().currentUser.uid;
  base_url = 'user/cloud-avatar-user';

	addFileStore(pictureFile, loading, setUrl) {
		if (!loading) {
      return;
		}
		
		const avatarRef = FireBase.firebase.storage().ref(`${this.base_url}/${this.uid}/avatar`);
		avatarRef.put(pictureFile).then( snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        FireBase.firebase.auth().currentUser.updateProfile({photoURL: url})
          .then(() => {
            FireBase.firebase.database().ref(`${this.base_url}/${this.uid}`)
              .set({"avatar": url});
              setUrl(url);
          }, error => console.log(error));
      })
    });
  }
  
  getStoreDefaultAvatar(setAvatar) {
    const ref = FireBase.firebase.storage().ref(`${this.base_url}/default-avatar/user.png`);
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
}