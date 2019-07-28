import FireBase from '../Auth/FireBase';
import Geocoder from './ControllerGeocoderAPI';
import EXIF from 'exif-js';

export default class ControllerGPS {
	static coordinates = {}

	constructor(storageRef, source, callback) {
		this.uid = FireBase.firebase.auth().currentUser.uid;
		this.store = storageRef;
		this.ref = source;
		this.cb = callback;
		this.init();
	}

	init() {
		this.setGPSCoordinatesDB();
	}

	getGPS(coordinates) {
    return coordinates[0].numerator + coordinates[1].numerator / (60 * coordinates[1].denominator) + coordinates[2].numerator / (3600 * coordinates[2].denominator);
  }

	setGPSCoordinatesDB() {
		this.store .put(this.ref)
    .then(snapshot => {
      if (snapshot.state === 'success') {
        this.cb(false);

        this.store .getDownloadURL()
        .then(url => {
          fetch(url)
          .then(res => res.blob())
          .then(data => {
            EXIF.getData(data, () => {
              const key = this.ref.name.split('.')[0].toString();
              const gpsTags = ['GPSLatitude', 'GPSLongitude'];

              gpsTags.forEach(val => ControllerGPS.coordinates[val] = this.getGPS(EXIF.getTag(data, val)));
               new Geocoder(
                ControllerGPS.coordinates.GPSLatitude, 
                ControllerGPS.coordinates.GPSLongitude,
                `user/cloud-photos/${this.uid}/${key}`,
								this.cb,
								ControllerGPS.coordinates
              );
            })
          });
        })
        .catch(error => {
          switch (error.code) {
            case 'storage/object_not_found':
							throw new Error('File doesn t exist');
            case 'storage/unauthorized':
							throw new Error('User doesn t have permission to access the object');
            case 'storage/canceled':
							throw new Error('User canceled the upload');
            case 'storage/unknown':
							throw new Error('Unknown error occurred, inspect the server response');
          }
        });
      }
    }, error => console.log(error));
	}
}