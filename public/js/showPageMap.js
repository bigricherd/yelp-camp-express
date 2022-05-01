mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: 'show-map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
    )
    .addTo(map);