export default class ServiceGeoCordinats {
	getCordinates = async (id) => {
		const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${id}/?fields=latlng`).then(response => {
			if (response.ok) {
				return response.json();
			}
		});

		return response.latlng;
	}
}