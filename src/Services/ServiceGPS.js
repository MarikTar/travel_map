import FireBase from "../Firebase/FireBase";
import Geocoder from './ServiceGeocoder';
import EXIF from 'exif-js';
import shortid from 'shortid';

export default class ServiceGPS {
  coordinates = {}
  uid = FireBase.firebase.auth().currentUser.uid;

	getGPS(coordinates) {
    return coordinates[0].numerator + coordinates[1].numerator / (60 * coordinates[1].denominator) + coordinates[2].numerator / (3600 * coordinates[2].denominator);
  }

	setGPSCoordinatesDB(file, callback) {
		EXIF.getData(file, () => {
      const key = shortid.generate();
      const gpsTags = ['GPSLatitude', 'GPSLongitude'];

      gpsTags.forEach(val => this.coordinates[val] = this.getGPS(EXIF.getTag(file, val)));
      new Geocoder(
        this.coordinates.GPSLatitude, 
        this.coordinates.GPSLongitude,
        file
      ).getGeocoder(
        `user/cloud-photos/${this.uid}/${key}`,
        callback,
        this.coordinates
      )
    })
	}
}