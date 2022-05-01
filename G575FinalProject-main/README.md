# G575FinalProject
 Mapping sculptures around Madison.

### Team Members
1. Ben Isaacs
2. Sammy Fogel
3. David Kwong

### Persona/User section:

#### Target User Profile:
Susan is a 55 year old lifelong Madisonian who works as an art teacher at Whitehorse Middle School and lives in the SASY neighborhood on Madison’s East Side. As a frequent shopper at the Willy Street Co-op and donor to Wisconsin Public Radio and WORT, Susan is passionate about all things local to Madison, especially local artists. She has always been struck by the eccentricity and Madisonness of the numerous sculptures in her neighborhood, and is interested in **delineating** where other **clusters** of publicly displayed sculptures might be in other parts of the city. Her **objective** is to use the interactive to help with a project for her students, where they are tasked with choosing a public sculpture in Madison that they enjoy, writing a paragraph about why they enjoy it, **identifying** at least one fact about the sculpture itself (e.g. its artist, material, year built, etc.), and then **presenting** their findings to the class. She would like to give her students a chance to **explore** the many sculptures Madison has to offer and allow them to either **filter** by neighborhood or area (e.g. East Side) to get a **general** sense of what sculptures are where and most easily visit their chosen sculptures to forge a connection with their city, or **search** for a specific sculpture if they already know one. As Susan will readily tell you, she’s “not too good with technology.” Because she will need to use the interactive to check her students’ work and to **explore** sculptures for her own enjoyment, any interface that isn’t **transparently usable** or goes against the **conventions** of the only interactive maps she regularly uses, Apple Maps and Waze, will confuse and frustrate her and likely her middle school students as well.

#### User Case Scenario:
Hoping to get an **overview** of where public sculptures are located, Susan opens the interactive and is presented with a map of most of the city of Madison, by default zoomed in so the Beltline is not quite visible. Noticing at first glance that a **cluster** of points is located on and around the Capitol Square, she clicks the “+” button to **zoom** in and clicks and drags to pan to that area. As someone who knows a thing or two about sculptures, she is wondering how many of the near-Capitol sculptures are made of granite, and locates the drop-down menu to the left of the map, **filtering** by building material. Seeing that the number of points on the map has shrunk, she clicks on one at random, **retrieving** the information for *Faith* by Karl Bitter, built in 1912 out of granite. Impressed by this sculpture’s age, she gets to wondering how many of Madison’s sculptures were built this early. She first selects the “Start over” button on the left panel, resetting the map to its initial view, then decides to play with the year slider, **sequencing** the data so only sculptures built before 1930 are displayed. Excited by its **usability** and **utility**, she decides to go ahead and assign the project to her students.

|Representation|Description|
|--------------|-----------|
|Basemap       |A mapbox tileset constrained to show only Madison
|Satellite     |Option to display satellite imagery as the base layer instead
|Sculptures    |The location of sculptures will be shown as markers on the map. Location information will come from our own data collection or the City of Madison
|Photos        |Photos of each sculpture will be shown through the pop-up window. Photos collected by hand.
|Neighborhods  |Madison neighborhood polygons are available from the City of Madison Open Data. Will be used to allow for filtering by neighborhood.
|Information   |Further information about the sculptures such as name, artist, year made, and materials made from will be shown as text in the pop-up window. Information will come from the City of Madison.

|Interaction             |Description|
|--------------          |-----------|
|Zoom                    |Zoom:Location. Adjust map scale using zoom widgets or double click direct manipulation. Constrained to Madison
|Pan                     |Pan:Location. Move around the map using click and drag direct manipulation. Constrained to Madison
|Search Bar              |Search:Objects. Form fill-in allows users to find specific sculptures by name or artist.
|Filter by Neighborhood  |Filter:Location. Drop down menu to filter for sculptures only in the selected neighborhood
|Filter by Date          |Filter:Time. Slider timeline with intervals every decade. Users can filter for sculptures within the given time range
|Filter by Material      |Filter:Objects. Drop down menu to filter sculptures by the material they are made of.
|Pop-up Window           |Retrieve:Objects. When a sculpture marker is clicked shows an information window containing more details about the sculpture and a photo of the sculpture
|Feedback                |Retrieve:Objects. When clicked brings up a form fill-in window with two tabs. One tab for reporting bugs or problems, and one tab for reporting a sculpture not included in our map.
|Toggle Layer            |Reexpress:basemap. When clicked swaps the base map between a street map and satellite layer
|Favorite Sculpture      |Resymbolize:Objects. When clicked it marks the sculpture as ‘favorite’ on the map, changing the marker
