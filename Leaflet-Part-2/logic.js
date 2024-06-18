//Function to determine circle size
function circleSize(mag) {
    return mag * 30000;
}

//Function to determine circle size
function circleColor(depth) {
    var color="#FFEDA0";
    switch(true) {
        case (depth < 10):
            color="#FFEDA0";
            break;
        case (depth < 30):
            color="#FEB24C";
            break;
        case (depth < 50):
            color="#FD8D3C";
            break;
        case (depth < 70):
            color="#E31A1C";
            break;
        case (depth < 90):
            color="#BD0026";
            break;
        case (depth >= 90):
            color="#800026";
            break;
    }
    return color;
}

// Perform a GET request to the query URL
d3.json(url, function(data) {

    // Create a circle for each earthquake in the dataset
    var earthquakes = []
    data.features.forEach(x => {
        var lat=x.geometry.coordinates[1];
        var lng=x.geometry.coordinates[0];

        earthquakes.push(
            L.circle([lat,lng], {
                stroke: false,
                fillOpacity: 0.8,
                fillColor: circleColor(x.geometry.coordinates[2]),
                radius: circleSize(x.properties.mag)
            }).bindPopup(
                "<h3>" + x.properties.place +
      "</h3><hr><p>" + new Date(x.properties.time) + "</p>", {
                maxWidth : 560
            })
        )
    });

    // Create a layer out of the circles
    var earthquakeLayer = L.layerGroup(earthquakes);

    // Define layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });

    var outmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v10",
        accessToken: API_KEY
    });

    var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v8",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Dark Map": darkmap,
        "Outdoors Map": outmap,
        "Satellite Map": satmap,
        "Street Map": streetmap
    };

    // Grabbing the geoJSON data for the tectonic plates
    d3.json(url2, function(data) {
        // Creating a GeoJSON layer with the retrieved data
        var plates = L.geoJson(data);


        // Create overlay object to hold our overlay layer
        var overlayMaps = {
            Earthquakes: earthquakeLayer,
            "Tectonic Plates": plates
        };

        // Creating map object
        var myMap = L.map("map", {
            center: [39.0522, -110.2437],
            zoom: 5,
            layers: [darkmap, earthquakeLayer, plates]
        });

        // Create a layer control
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

        // Create a legend to display information about our map
        var info = L.control({
            position: "bottomright"
        });
        // When the layer control is added, insert a div with the class of "legend"
        info.onAdd = function() {
            var div = L.DomUtil.create("div", "legend");
            div.innerHTML=[
                "<h2>Depth (km)</h2>",
                "<p class='l10'>Less than 10</p>",
                "<p class='l30'>Between 10 and 30</p>",
                "<p class='l50'>Between 30 and 50</p>",
                "<p class='l70'>Between 50 and 70</p>",
                "<p class='l90'>Between 70 and 90</p>",
                "<p class='g90'>Greater than 90</p>"
            ].join("");

            return div;
        };
        // Add the info legend to the map
        info.addTo(myMap);
    })
});