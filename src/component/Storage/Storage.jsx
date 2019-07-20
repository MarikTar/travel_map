import React, { Component } from 'react';
import FireBase from "../Auth/FireBase";

export default class Storage extends Component {
  static addStore(pictureFile, user, loading, setUrl) {
    if (!loading) {
      return;
    }

    const avatarStgRef = FireBase.firebase.storage().ref("user/cloud-avatar-user/" + user.uid + "/avatar");

    avatarStgRef.put(pictureFile).then( snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        user.updateProfile({photoURL: url})
          .then(() => {
            FireBase.firebase.database().ref("user/cloud-avatar-user/" + user.uid)
              .set({"photoUri": url});
              setUrl(url);
          }, error => console.log(error));
      })
    });
  }

  static getStoreDefaultAvatar(setUrl) {
    const avatarStgRef = FireBase.firebase.storage().ref('user/cloud-avatar-user/default-avatar/user.png');
    avatarStgRef.getDownloadURL().then(url => setUrl(url));
  }
}
