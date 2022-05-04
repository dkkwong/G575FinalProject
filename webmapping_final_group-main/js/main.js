var map;
//function to instantiate the Leaflet map
function createMap(){
    
    //tileset from leaflet-extras.github.io/leaflet-providers/preview/
    //base layers
    var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 20,
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
    //vars to hold bounds
    var southWest = [43.016578, -89.492069],
        northEast = [43.167417, -89.296058],
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
//    var boundaries = L.geoJSON().addTo(map);
//    boundaries.addData("data/our_boundaries.geojson");

    var baseMaps = {
        "Watercolor": Stamen_Watercolor,
        "Satellite": Esri_WorldImagery
    };
    var overlayMaps = {
        "Labels": Stamen_TonerLabels
    };

    //add layer control to the map
    L.control.layers(baseMaps, overlayMaps,{ position: 'topright' }).addTo(map);

    //scale bar
    L.control.scale({ position: 'bottomright' }).addTo(map);
        
    //zoom buttons
    //L.control.zoom({ position: 'bottomright' }).addTo(map);
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

    fetch("data/SculptureData.geojson") //path where data is stored
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
            createDropdown(data);
            createReset();
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
                //console.log(links)
                if(!links){
                    continue
                }else{
                formattedLinks += "<a href=" + "'" + links + "' target='_blank'>Click here to learn more!" + "</a>";
                //console.log(formattedLinks)
                popupContent += "<p><b>" + property + ": </b> " + formattedLinks + "</p>";                
            }}else{
                popupContent += "<p><b>" + property + ": </b> " + feature.properties[property] + "</p>";
            }
        }
        //Add image links
        popupContent += '<img class="sculpturePhoto" src="img/sculpturepics/'+feature.properties.Photo+'" width="300px height="350px">'
        layer.bindPopup(popupContent);
       
        
    };
};

function createSequenceControls(){
    var sequence = document.querySelector('#sequence')
    //create slider
    sequence.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">')

    //add skip buttons
    sequence.insertAdjacentHTML('afterbegin', '<button class="step" id="reverse" title="Reverse">-</button>'); 
    sequence.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward">+</button>');
    //add text
    sequence.insertAdjacentHTML('beforeend','<div id="year">Select Year</div>')

    document.querySelector(".range-slider").max = 2022;
    document.querySelector(".range-slider").min = 1892;
    document.querySelector(".range-slider").value = 2022;
    document.querySelector(".range-slider").step = 10;

    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            var index = parseInt(document.querySelector('.range-slider').value);

            //increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index+=10; //increase year by 10
            } else if (step.id == 'reverse'){
                index-= 10; //decrease year by 10
            };
            //update slider
        document.querySelector('.range-slider').value = index
        })
    })
    // input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){
        // get the new index value
        var index = this.value;
        
    });
};



function createSearchBar(data){
    search=document.querySelector('#search')
    //add button
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
    var value = document.querySelector('#Search').value;
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
    //event listener to hide search menu
    document.querySelector('#menu').addEventListener('click',function(event){
        var menu = document.querySelector('#menu')
        document.querySelectorAll(".name").forEach(function(item){
            item.style.display = "none";
        })
        /*while (menu.hasChildNodes()){
            menu.removeChild(menu.firstChild)   
        }*/

    })

    if (!value){
        document.querySelectorAll(".name").forEach(function(item){
            item.style.display = "none";
        })
    }
}

function createDropdown(data){
 
    var materialList=[];
    var neighborhoodList=[];
    var artistList=[];
    for (var i=0; i<data.length; i++){
        //create  list of materials
         var material = data[i].properties.Material
         if (!materialList.includes(material))
            materialList.push(material)
        //create list of neighborhoods
         var neighborhood = data[i].properties.Neighborhood
         if (!neighborhoodList.includes(neighborhood))
            neighborhoodList.push(neighborhood)
        //create list of artists
         var artist = data[i].properties.Artist
         if (!artistList.includes(artist))
            artistList.push(artist)
    }
    //add dropdown menu
    material=document.querySelector('#dropdown')
    material.insertAdjacentHTML('beforeend','<select name="material" id="material"><option value="" selected="selected">Choose Material</option></select>')
    
    for (i in materialList){
    document.querySelector('#material').insertAdjacentHTML('beforeend','<option class="material-option">' + materialList[i] + '</option>')
    }
         
    neighborhood=document.querySelector('#dropdown')
    neighborhood.insertAdjacentHTML('beforeend','<select name="neighborhood" id="neighborhood"><option value="" selected="selected">Choose Neighborhood</option></select>')

    for (i in neighborhoodList){
        document.querySelector('#neighborhood').insertAdjacentHTML('beforeend','<option class="neighborhood-option">' + neighborhoodList[i] + '</option>')
   }

    artist=document.querySelector('#dropdown')
    artist.insertAdjacentHTML('beforeend','<select name="artist" id="artist"><option value="" selected="selected">Choose Artist</option></select>')

    for (i in artistList){
        document.querySelector('#artist').insertAdjacentHTML('beforeend','<option class="artist-option">' + artistList[i]+ '</option>')  
   }
};

function createReset(){
    feedback=document.querySelector('#reset')
    //add button
    feedback.insertAdjacentHTML('beforeend','<input type="reset" value="Reset" onClick="reset()"></input>')
}
//function called when reset button is clicked
function reset(){
    document.querySelector("#dropdown").reset();
}

function createFeedback(){
    feedback=document.querySelector('#feedback-container')
    //add button
    feedback.insertAdjacentHTML('beforeend','<button id="feedbackButton" onclick="showFeedback()">Feedback</button>')

    feedbackForm=document.querySelector('#feedbackForm')
    //add form fields
    //still need an image field
    feedbackForm.insertAdjacentHTML('beforeend','<input type="text" placeholder="Name" name="name"></input>')
    feedbackForm.insertAdjacentHTML('beforeend','<input type="text" placeholder="Enter Email" name="email"></input>')
    feedbackForm.insertAdjacentHTML('beforeend','<input type="text" placeholder="Name of Sculpture" name="sculptureName"></input>')
    feedbackForm.insertAdjacentHTML('beforeend','<input type="text" placeholder="Location" name="location"></input>')
    feedbackForm.insertAdjacentHTML('beforeend','<input type="text" placeholder="Year Built" name="year"></input>')
    feedbackForm.insertAdjacentHTML('beforeend','<input type="text" placeholder="Artist" name="artist"></input>')
    feedbackForm.insertAdjacentHTML('beforeend','<input type="text" placeholder="Material Type" name="material"></input>')
    feedbackForm.insertAdjacentHTML('beforeend','<input type="text" placeholder="Additional Info" name="other"></input>')
    //add reset button
    feedbackForm.insertAdjacentHTML('beforeend','<button type="reset" class="reset">Reset</button>')
    //add submit button
    feedbackForm.insertAdjacentHTML('beforeend','<button type="submit" class="submit">Submit</button>')
    
}
function showFeedback(){
    //function called when feedback button clicked, shows the feedback form
    document.querySelector("#feedbackForm").style.display = "block"
    //change feedback button to hide 
    document.querySelector('#feedbackButton').innerText="Hide"
    //when clicked, hide the form
    document.querySelector('#feedbackButton').addEventListener('click',function(event){
        document.querySelector("#feedbackForm").style.display = "none"
        document.querySelector('#feedbackButton').innerText="Feedback"
    })
}


document.addEventListener('DOMContentLoaded',createMap)