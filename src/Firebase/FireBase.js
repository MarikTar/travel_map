import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";

export default class FireBase {
  static firebase = firebase.initializeApp({
    apiKey: "AIzaSyAeWjiyVZdXS_ZIuJIX4likai5G26c4-Ss",
    authDomain: "travelmap-ad11c.firebaseapp.com",
    databaseURL: "https://travelmap-ad11c.firebaseio.com",
    projectId: "travelmap-ad11c",
    storageBucket: "travelmap-ad11c.appspot.com",
    messagingSenderId: "668836694216",
    appId: "1:668836694216:web:a35a52bff6a53cf2"
  });
}
