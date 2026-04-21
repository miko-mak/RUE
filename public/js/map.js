const map = L.map('map', {
    maxZoom: 18,
    minZoom: 5,
    zoomControl: false
    
}).setView([51.505, 15], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var markers = L.layerGroup().addTo(map);


function toDMS(coord, isLat) {
    const deg = Math.floor(Math.abs(coord));
    const min = Math.floor((Math.abs(coord) - deg) * 60);
    const sec = ((Math.abs(coord) - deg - min/60) * 3600).toFixed(1);
    const dir = isLat ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${deg}°${min}'${sec}"${dir}`;
}


function showPlaceOnMap(place) {
    const street = place.tags["addr:street"];
    var address = 'No address provided';
    var lat;
    var lon;

    if (street !== undefined) {
        const number = place.tags["addr:housenumber"]
        address = `${street} ${number}`
    }
    
    if (place.type === "way") {
        lat = place.center.lat;
        lon = place.center.lon;

    } else {
        lat = place.lat;
        lon = place.lon;
    }

    markers.clearLayers();
    map.setView([lat, lon], 18);

    const routeLink = `<a href='https://www.google.com/maps?q=${lat},${lon}' target='_blank'>`
    const dmsLat = toDMS(lat, true)
    const dmsLon = toDMS(lon, false)

    const hover = `<b>Address:</b> ${address}<br>${dmsLat} ${dmsLon}<br>${routeLink}Click to navigate`
    const marker = L.marker([lat, lon]).bindPopup(hover);

    markers.addLayer(marker);
    marker.openPopup();

}