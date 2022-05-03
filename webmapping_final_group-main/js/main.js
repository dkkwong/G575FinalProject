var map;
//function to instantiate the Leaflet map
function createMap(){
    
    //tileset from leaflet-extras.github.io/leaflet-providers/preview/
    //base layers
    var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 18,
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
    //global vars to hold bounds
    var southWest = [43.016578, -89.533500],
        northEast = [43.137417, -89.296058],
        bounds = L.latLngBounds(southWest,northEast)
    //create the map
    map = L.map('map', {
        center: [43.075, -89.41],
        zoom: 13,
        minZoom: 13, //constrain zoom so users can't zoom out beyond default
        maxZoom: 17, //constrain zoom so users can only zoom in 2 levels beyond default
        maxBounds: bounds,
        layers: [Stamen_Watercolor,Stamen_TonerLabels], //watercolor is default base layer with labels as overlay
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

    //scale bar
    L.control.scale().addTo(map);
        

    //call data function
    getData()
    
};

function getData(){
    //load the data
    fetch("data/our_boundaries.geojson") //path where data is stored
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            L.geoJson(json).addTo(map);
        })

    fetch("data/sculpture_data_updated.geojson") //path where data is stored
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var data = json.features //create variable to contain data
            console.log(data);

            L.geoJson(data, { 
                onEachFeature: onEachFeature  //use to bind associated information to each marker as a pop-up
            }).addTo(map);

            var attributes = processData(json); //create a list of column field names
            console.log(attributes);

            createSequenceControls();
            createSearchBar(data);
            createDropdown();
            createFeedback();
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
    var links = "";
    var formattedLinks = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            if(property=="Link"){
                links += feature.properties[property];
                formattedLinks += "<a href=" + "'" + links + "' target='_blank'>Click here to learn more!" + "</a>";
                //console.log(formattedLinkz)
                popupContent += "<p><strong>" + property + ":</strong> " + formattedLinks + "</p>";                
            }else{
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }}
        layer.bindPopup(popupContent);
    };
};

function createSequenceControls(){
    var sequence = document.querySelector('#sequence')
    //create slider
    sequence.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">')

    //add skip buttons
    sequence.insertAdjacentHTML('afterbegin', '<button class="step" id="reverse" title="Reverse">R</button>'); 
    sequence.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward">F</button>');
};



function createSearchBar(data){
    search=document.querySelector('#search')
    search.insertAdjacentHTML('beforeend','<input type="text" id="Search" onkeyup="runSearch()" placeholder="Search"></input>')

    search.insertAdjacentHTML('beforeend','<ul id=menu></ul>') //create unordered list
    
    for (var i=0; i<data.length; i++){
        var name = data[i].properties.Name
        //add sculpture names to list
        document.querySelector('ul').insertAdjacentHTML('beforeend','<li class="name">' + name + '</li>')

    }
};
//function is called when you type into the search bar
function runSearch() {
    // Declare variables
    var input = document.getElementById("Search");
    var filter = input.value.toUpperCase();
    var ul = document.getElementById("menu");
    var li = ul.getElementsByClassName("name");
    console.log(li)
    // Loop through all list items, and hide those who don't match the search query
    for (var i = 0; i < li.length; i++) { 
        if (li[i].innerHTML.toUpperCase().includes(filter)) {
            li[i].style.display = "block";
        } else {
            li[i].style.display = "none";
        }
    }
    document.querySelector('#menu').addEventListener('click',li.style.display = "none")
}

function createDropdown(){
    material=document.querySelector('#dropdown')
    material.insertAdjacentHTML('beforeend','<select name="material" id="material"><option value="" selected="selected">Choose Material</option></select>')

    neighborhood=document.querySelector('#dropdown')
    neighborhood.insertAdjacentHTML('beforeend','<select name="Neighborhood" id="Neighborhood"><option value="" selected="selected">Choose Neighborhood</option></select>')

    artist=document.querySelector('#dropdown')
    artist.insertAdjacentHTML('beforeend','<select name="artist" id="artist"><option value="" selected="selected">Choose Artist</option></select>')

};

function createFeedback(){
    feedback=document.querySelector('#feedback')
    feedback.insertAdjacentHTML('beforeend','<button class="btn feedback">Feedback</button>')
}
document.addEventListener('DOMContentLoaded',createMap)