var map;
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });
    //tileset from leaflet-extras.github.io/leaflet-providers/preview/
    var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'jpg'
    }).addTo(map);
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