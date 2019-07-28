import FireBase from "../Firebase/FireBase";
import Geocoder from './ServiceGeocoder';
import EXIF from 'exif-js';

export default class ServiceGPS {
  coordinates = {}
  uid = FireBase.firebase.auth().currentUser.uid;

	getGPS(coordinates) {
    return coordinates[0].numerator + coordinates[1].numerator / (60 * coordinates[1].denominator) + coordinates[2].numerator / (3600 * coordinates[2].denominator);
  }

	setGPSCoordinatesDB(storageRef, ref, callback) {
		storageRef .put(ref)
    .then(snapshot => {
      if (snapshot.state === 'success') {
        callback(false);

        storageRef .getDownloadURL()
        .then(url => {
          fetch(url)
          .then(res => res.blob())
          .then(data => {
            EXIF.getData(data, () => {
              const key = ref.name.split('.')[0].toString();
              const gpsTags = ['GPSLatitude', 'GPSLongitude'];

              gpsTags.forEach(val => this.coordinates[val] = this.getGPS(EXIF.getTag(data, val)));
              new Geocoder(
                this.coordinates.GPSLatitude, 
                this.coordinates.GPSLongitude
              ).get(
                `user/cloud-photos/${this.uid}/${key}`,
								callback,
								this.coordinates
              )
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