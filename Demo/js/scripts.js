jQuery(document).ready(main)

function main() {
 var mymap = L.map('map', {}).setView([-0.515278, 47.501111], 2);
 
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiczZhc2FsdGEiLCJhIjoiY2lveXUwb3dqMDBlaXZ2bHdoZjQ5dHlrbiJ9.xKMDfR_36OSyxiBT_jftig', {
			maxZoom: 18,
			attribution: 'EIS LAB 2016',
			id: 'mapbox.streets'
		}).addTo(mymap);
		
		function onEachFeature(feature, layer) {
			var popupContent = "";

			if (feature.properties && feature.properties.popupContent) {
				popupContent += feature.properties.popupContent;
			}

			layer.bindPopup(popupContent);
		}

		L.geoJson(all_features, {

			style: function (feature) {
				return feature.properties && feature.properties.style;
			},

			onEachFeature: onEachFeature,

			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					radius: 8,
					fillColor: "#ff7800",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				});
			}
		}).addTo(mymap);
}