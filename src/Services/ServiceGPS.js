import FireBase from "../Firebase/FireBase";
import Geocoder from './ServiceGeocoder';
import EXIF from 'exif-js';


export default class ServiceGPS {
  coordinates = {}
  uid = FireBase.firebase.auth().currentUser.uid;
  ref = `user/cloud-photos/${this.uid}/location`;

	getGPS(coordinates) {
    if (!coordinates) {
      return;
    }
    return coordinates[0].numerator + coordinates[1].numerator / (60 * coordinates[1].denominator) + coordinates[2].numerator / (3600 * coordinates[2].denominator);
  }

	setGPSCoordinatesDB(file, update, error) {
		EXIF.getData(file, () => {
      const gpsTags = ['GPSLatitude', 'GPSLongitude'];

      gpsTags.forEach(val => this.coordinates[val] = this.getGPS(EXIF.getTag(file, val)));

      if (!this.coordinates.GPSLatitude || !this.coordinates.GPSLongitude) {
        error(true);
        // I will rewrite on modal
        alert('We could not get the geolocation data from your photos, you can add photos manually by selecting a country, and add photos yourself.');
        return;
      }

      new Geocoder(
        this.coordinates.GPSLatitude, 
        this.coordinates.GPSLongitude,
        file
      ).getGeocoder(
        this.ref,
        update,
        this.coordinates
      )
    })
  }
}