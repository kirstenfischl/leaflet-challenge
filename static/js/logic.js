var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl, function(data) {
   createFeatures(data.features);
   console.log(data.features)
});

function radiusSize(magnitude) {
  return magnitude * 50000;
}

function circleColor(magnitude) {
  if (magnitude < 1) {
    return "#b6f34d"
  }
  else if (magnitude < 2) {
    return "#e0f346"
  }
  else if (magnitude < 3) {
    return "#f3da46"
  }
  else if (magnitude < 4) {
    return "#f3b94d"
  }
  else if (magnitude < 5) {
    return "#f0a76b"
  }
  else {
    return "#f06b6b"
  }
}

function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.title);
  }

  function pointToLayer(earthquakeData) {
    return L.circle([earthquakeData.geometry.coordinates[1], earthquakeData.geometry.coordinates[0]], {
      radius: radiusSize(earthquakeData.properties.mag),
      color: circleColor(earthquakeData.properties.mag)
    })
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
  var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoiazEwZjExIiwiYSI6ImNrYXRwcTF2NjBjNjAydHF2b2VhZW9sa3gifQ.-f29Cwp6O_SX_JJXJ4PiBw"
  });

  var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/dark-v10',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "pk.eyJ1IjoiazEwZjExIiwiYSI6ImNrYXRwcTF2NjBjNjAydHF2b2VhZW9sa3gifQ.-f29Cwp6O_SX_JJXJ4PiBw"
  });


  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };


  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);


  function getColor(d) {
    return d > 5 ? '#f06b6b' :
           d > 4  ? '#f0a76b' :
           d > 3  ? '#f3b94d' :
           d > 2  ? '#f3da46' :
           d > 1  ? '#e0f346' :
                    '#b6f34d';
  }

  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          mags = [0, 1, 2, 3, 4, 5],
          labels = [];

          
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);


}