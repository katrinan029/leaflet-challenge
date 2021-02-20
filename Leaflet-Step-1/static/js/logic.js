const myMap = L.map('map', {
  center: [36.7783, -119.4179], // coordinates of California
  zoom: 4,
});

L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/light-v10',
    accessToken: API_KEY,
  },
).addTo(myMap);

let url =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';

d3.json(url, function (response) {
  console.log(response.features);

  // function to determine color of depth
  function chooseColor(earthquake_depth) {
    let color;

    if (earthquake_depth < 10) {
      color = 'rgb(235, 235, 52)';
    } else if (earthquake_depth < 30) {
      color = 'rgb(104, 235, 52)';
    } else if (earthquake_depth < 50) {
      color = 'rgb(52, 186, 235)';
    } else if (earthquake_depth < 70) {
      color = 'rgb(70, 52, 235)';
    } else if (earthquake_depth < 90) {
      color = 'rgb(106, 30, 150)';
    } else {
      color = 'rgb(138, 12, 35)';
    }
    return color;
  }

  L.geoJSON(response.features, {
    pointToLayer: function (feature, latitudeLongitude) {
      return L.circleMarker(latitudeLongitude, {
        color: 'black',
        weight: 1.5,
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.9,
        radius: feature.properties.mag * 3.0,
      }).bindPopup(
        feature.properties.place +
          '<hr>' +
          feature.properties.mag +
          '<hr>' +
          new Date(feature.properties.time),
      );
    },
  }).addTo(myMap);

  // function for legend
  function getLegendColor(depth) {
    let color;

    if (depth < 10) {
      color = 'rgb(235, 235, 52)';
    } else if (depth < 30) {
      color = 'rgb(104, 235, 52)';
    } else if (depth < 50) {
      color = 'rgb(52, 186, 235)';
    } else if (depth < 70) {
      color = 'rgb(70, 52, 235)';
    } else if (depth < 90) {
      color = 'rgb(106, 30, 150)';
    } else {
      color = 'rgb(138, 12, 35)';
    }
    return color;
  }

  let legendPosition = L.control({ position: 'bottomright' });

  legendPosition.onAdd = function (map) {
    let addDiv = L.DomUtil.create('div', 'info legend'),
      grades = [-10, 10, 30, 50, 70, 90],
      labels = [];

    for (let i = 0; i < grades.length; i++) {
      addDiv.innerHTML +=
        '<i style="background:' +
        getLegendColor(grades[i] + 1) +
        '"></i> ' +
        grades[i] +
        (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return addDiv;
  };

  legendPosition.addTo(myMap);
});
