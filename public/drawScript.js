/**
* @author Jana Walter
* @matrNr 459762
*/

"use strict";


/**
* @function showDrawingMap - Shows the map at the second page where the user also can draw own polygons
* @var map - The map with the view at the coordinates [51.96, 7.59]
* @var osm - The source of the map shown on the map
* @var drawnItems - The items which the user draws are shown on the map
* @var layer - The layer with the drawn elements
* @var layerCoordinatesMorePoints - The coordinates of the layer elements
* @source The example folder in github
*/

function showDrawingMap ()
{
	var map = L.map ("mapdiv").setView([51.96, 7.59], 13);
	var osm = L.tileLayer ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
	{
		maxZoom: 18,
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
		id: "osm"
	}).addTo(map);

	var drawnItems = L.featureGroup().addTo(map);
	map.addControl (new L.Control.Draw
	({
		edit: 
		{
			featureGroup: drawnItems,
			poly: 
			{
				allowIntersection: true
			},
			edit: false
		},

		draw: 
		{
			polygon: 
			{
				allowIntersection: true,
				showArea: true
			},
			circle: false,
			circlemarker: false
		}
	}));

	map.on (L.Draw.Event.CREATED, function (event) 
	{
		var layer = event.layer;
		drawnItems.addLayer (layer);
		var layerCoordinatesMorePoints = layer._latlngs;
		document.getElementById("objectText").innerHTML = toGeoJSON (layer);
	});
}


/**
* @function toGeoJSON - Changes the overgiven layer to a valid GeoJSON object
* @param layerCoordinates - The overgiven coordinates from the layer
*/

function toGeoJSON (layerCoordinates)
{
	try
	{
		// Throws an error if it isn't a polygon
		layerCoordinates._latlngs[0][0].lat;
		return toGeoJSONPolygon (layerCoordinates);
	}
	catch (TypeError)
	{
		try
		{
			// Throws an error if it isn't a lineString
			layerCoordinates._latlngs[0].lat;
			return toGeoJSONLinestring (layerCoordinates);
		}
		catch (TypeError)
		{
			// If it isn't a polygon or a lineString, it has to be a point
			return toGeoJSONPoint (layerCoordinates);
		}
	}
}


/**
* @function toGeoJSONPoint - Converts the overgiven marker to an GeoJSON point
* @param coordinatesPoint - The overgiven coordinates of the point
* @var newGeopoint - The point as GeoJSON
* @return newGeopoint - The point as GeoJSON point
*/

function toGeoJSONPoint (coordinatesPoint)
{
	var newGeopoint =
	{
		"type": "Feature",
		"properties": {},
		"geometry":
		{
			"type": "Point",
			"coordinates": [coordinatesPoint._latlng.lat, coordinatesPoint._latlng.lng]
 		}
	};
	return JSON.stringify (newGeopoint);
}


/**
* @function toGeoJSONLineString - Converts the overgiven lineString to an GeoJSON lineString
* @param coordinatesLineString - The overgiven coordinates of the lineString
* @var newGeoLineStringCoordinates - Prepares the coordinates from the lineString for being an GeoJSON lineString
* @var newGeoLineString - The lineString as a GeoJSON lineString
* @return newGeoLineString - The lineString as a GeoJSON lineString
*/

function toGeoJSONLinestring (coordinatesLineString)
{
	var newGeoLineStringCoordinates =  new Array (coordinatesLineString._latlngs.length);
	for (var i = 0; i < newGeoLineStringCoordinates.length; i++)
	{
		newGeoLineStringCoordinates [i] = [coordinatesLineString._latlngs[i].lat, coordinatesLineString._latlngs[i].lng];
	}
	var newGeoLineString =
	{
		"type": "Feature",
		"properties": {},
		"geometry":
		{
			"type": "LineString",
			"coordinates": newGeoLineStringCoordinates
		}
	};
	return JSON.stringify (newGeoLineString);
}


/**
* @function toGeoJSONPolygon - Converts the overgiven polygon to an GeoJSON polygon
* @param coordinatesPolygon - The overgiven coordinates of the polygon
* @var newGeoPolygonCoordinates - Prepares the coordinates from the polygon for being an GeoJSON polygon
* @var newGeoPolygon - The polygon as a GeoJSON polygon
* @return newGeoPolygon - The polygon as a GeoJSON polygon
*/

function toGeoJSONPolygon (coordinatesPolygon)
{
	var newGeoPolygonCoordinates = new Array (coordinatesPolygon._latlngs[0].length);
	for (var i = 0; i < newGeoPolygonCoordinates.length; i++)
	{
		newGeoPolygonCoordinates [i] = [coordinatesPolygon._latlngs[0][i].lat, coordinatesPolygon._latlngs[0][i].lng];
	}
	var newGeoPolygon =
	{
		"type": "Feature",
		"properties": {},
		"geometry":
		{
			"type": "Polygon",
			"coordinates": newGeoPolygonCoordinates
		}
	};
	return JSON.stringify (newGeoPolygon);
}


/**
* @function getLocation - Function to get the direct location of the user and take it for the functions distance and bearing
*/

function getLocation ()
{
	if (navigator.geolocation) 
	{
		navigator.geolocation.getCurrentPosition (showPosition);
	} 
	else 
	{ 
		document.getElementById("locationSearchFailed").innerHTML = "Your browser doesn't support Geolocation";
	}
}


/**
* @function showPosition - Saves the given position as myStartpoint and shows it on the webpage
* @param position - The overgiven position
*/

function showPosition (position)
{
	myStartpoint = pointToGeoJSON ([position.coords.latitude, position.coords.longitude]);
	document.getElementById("myPosition").value = JSON.stringify (myStartpoint);
}


/**
* @function getCoordinates - Gets the coordinates for the given adress from the API
* @param key - The key for the API from the user
* @param userAdress - The adress which should be searched for chosen by the user
* @var resource - The URL for the request at the LocationIQ - Website
* @var z - The request for the XHR - Object
* @return The response as an object
*/

function getCoordinates (key, userAdress)
{
	var resource = "https://eu1.locationiq.com/v1/search.php?key=" + key + "&q=" + userAdress + "&format=json";
	var z = new XMLHttpRequest();
	z.open ("GET", resource, false);
	z.send ();
	return JSON.parse (z.response);
}


/**
* @function getCoordinatesForAdress - Shows the response of the LocationIQ at the HTML - Site
* @var key - The overgiven token of the user needed for the API
* @var userAdress - The overgiven adress for which the coordinates are searched
* @var response - Calls the API - function with the overgiven key and the searched adress
*/

function getCoordinatesForAdress ()
{
	var key = document.getElementById("keyForTheGeocodingAPI").value;
	var userAdress = document.getElementById("textForTheGeocodingAPI").value;
	var response = getCoordinates (key, userAdress);
	document.getElementById("showResponse").innerHTML = JSON.stringify (response[0]);
	adress = pointToGeoJSON (JSON.parse ("[" + response[0].lat + "," + response[0].lon + "]"));
	document.getElementById("showCoordinates").innerHTML = JSON.stringify (adress);
}


/**
* @function useCoordinatesAsThePoint - Takes the adress the user searched for as the startpoint
*/

function useCoordinatesAsThePoint ()
{
	myStartpoint = adress;
	document.getElementById("myPosition").value = JSON.stringify (myStartpoint);
}


/**
* @function sendFiles - Sends Files from the textarea to the Server to store them
* @var input - The input in the textfield
*/
 
function sendFiles ()
{
    var input = document.getElementById("pointsToDB").value;
    try
	{
        input = JSON.parse (input);
        postRequest (input);
		showFiles("showDBForChanging");
		alert ("Point inserted");
    }
    catch (e)
	{
        console.log (e);
        alert ("Please insert a valid JSON");
    }
}


/**
* @function postRequest - Sends data to the server to get stored in the database 
* @param dat - Data to be stored
*/
 
function postRequest (dat) 
{
    return new Promise (function (res, rej) 
	{
        $.ajax
		({
            url: "/item",
            data: dat,
            type: "post",
            success: function (result) {res(result);},
            error: function (err) {console.log(err);}
        });
    });
}


/**
* @function showFiles - Shows the Files stored in Database
* @var query - The filter for the request, like this: query = ?name=geo
* @var result - The files stored in the database
*/
 
async function showFiles (fieldId) 
{
    var query = "";
    var result = await getRequest (query);
    document.getElementById(fieldId).innerHTML = JSON.stringify (result);
}


/**
* @function getRequest - Request data stored in MongoDB and resolves them as promise
* @param query - Filter stored data
* @return The requested data
*/

function getRequest (query) 
{
    return new Promise (function (res, rej) 
	{
        $.ajax
		({
            url: "/item " + query,
            success: function (result) {res (result);},
            error: function (err) {console.log (err);}
        });
    });
}


/**
* @function delteFiles - Deletes one point from the DB
*/

function deleteFiles()
{
    var id = document.getElementById("pointsToDB").value;
    var temp = {_id : id};
    return new Promise (function (res, rej)
    {
        $.ajax
        ({
            url: "/item",
            method: "DELETE",
            data: temp,
            success: function (result) {res(result); showFiles("showDBForChanging");},
            error: function (err) {console.log(err);}
        });
    });
}