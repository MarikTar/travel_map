import FireBase from '../Auth/FireBase';

export default class ControllerFirebaseStore {

	static addFileStore(pictureFile, loading, setUrl, uid) {
		if (!loading) {
      return;
		}
		
		const avatarRef = FireBase.firebase.storage().ref(`user/cloud-avatar-user/${this.uid}/avatar`);
		avatarRef.put(pictureFile).then( snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        FireBase.firebase.auth().currentUser.updateProfile({photoURL: url})
          .then(() => {
            FireBase.firebase.database().ref("user/cloud-avatar-user/" + uid)
              .set({"avatar": url});
              setUrl(url);
          }, error => console.log(error));
      })
    });
	}

	static getStoreDefaultAvatar(setUrl) {
    const avatarRef = FireBase.firebase.storage().ref('user/cloud-avatar-user/default-avatar/user.png');
    avatarRef.getDownloadURL().then(url => setUrl(url));
  }
}