import React, { Component } from 'react';
import FireBase from "../Auth/FireBase";

export default class Storage extends Component {
  static addStore(pictureFile, user, loading, success) {
    if (!loading) {
      return;
    }

    const avatarStgRef = FireBase.firebase.storage().ref("user/cloud-avatar-user/" + user.uid + "/avatar.jpg");

    avatarStgRef.put(pictureFile).then( snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        user.updateProfile({photoURL: url})
          .then(() => {
            FireBase.firebase.database().ref("user/cloud-avatar-user/" + user.uid)
              .set({"photoUri": url})
          })
      })
    });

    success(true);
  }
}
