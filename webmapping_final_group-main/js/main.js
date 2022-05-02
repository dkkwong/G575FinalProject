var map;
//function to instantiate the Leaflet map
function createMap(){
    
    //tileset from leaflet-extras.github.io/leaflet-providers/preview/
    //base layers
    var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'jpg'
    })
    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    })
    
    //overlay layer
    var Stamen_TonerLabels = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
    })
   
    //create the map
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        layers: [Stamen_Watercolor,Stamen_TonerLabels] //watercolor is default base layer with labels as overlay
    });
    var baseMaps = {
        "Watercolor": Stamen_Watercolor,
        "Satellite": Esri_WorldImagery
    };
    
    var overlayMaps = {
        "Labels": Stamen_TonerLabels
    };

    //add layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(map);



    //call data function
    getData()
    
};

function getData(){
    //load the data
    fetch("data/SculptureData.geojson") //path where data is stored
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var data = json.features //create variable to contain data
            console.log(data)

            L.geoJson(data, { 
                onEachFeature: onEachFeature  //use to bind associated information to each marker as a pop-up
            }).addTo(map);

            var attributes = processData(json); //create a list of column field names
            console.log(attributes)
        })
        
};

function processData(data){
    //empty array to hold attributes
    var attributes = []; //create empty array to store data
    //take properties of first feature to get list of column names
    var properties = data.features[0].properties; 

   for (var attribute in properties){
           attributes.push(attribute); //create a list of column field names
    };
    return attributes;
};

function onEachFeature(feature, layer) {
    // create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

document.addEventListener('DOMContentLoaded',createMap)