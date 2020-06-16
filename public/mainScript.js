/**
* @author Jana Walter
* @matrNr 459762
*/

"use strict";

var myStartpoint = pointToGeoJSON (point);
var myPointcloud;
var adress;


/**
* @function main - Fills the textfields and modifies the pointcloud
*/

function main ()
{
	myPointcloud = getBusstops ();
	document.getElementById("myPointcloudText").value = JSON.stringify (myPointcloud);
}


/**
* @function insertOutput - Fills the HTML - table
* @param myPointcloud - The busstops in Muenster 
* @var swappedStartpoint - The startpoint with the coordinates in the right sequence
*/

function insertOutput (myPointcloud)
{	
	document.getElementById("myPointcloudText").innerHTML = JSON.stringify (myPointcloud);
	var swappedStartpoint = JSON.parse (document.getElementById("myChosenStartpoint").value);
	swappedStartpoint.geometry.coordinates [0] = parseFloat (swappedStartpoint.geometry.coordinates [0]);
	swappedStartpoint.geometry.coordinates [1] = parseFloat (swappedStartpoint.geometry.coordinates [1]);
	myStartpoint = pointToGeoJSON ([swappedStartpoint.geometry.coordinates[1], swappedStartpoint.geometry.coordinates[0]]);

	changePointcloud ();
	fillTableStations ();
	fillTableDepartures (300);
}


/**
* @function distance - Function to calculate the distance between the location from the user and the other points from pointcloud.js
* @param point1 - The first point for the calculation
* @param point2 - The second point for the calculation
* @var R - The radius of the earth
* @var lat1 - The latitude of the start position
* @var lat2 - The latitude of the other position
* @var distanceLats - The distance between the latitudes
* @var distanceLons - The distance between the longitudes
* @var a, b - Auxiliary variables needed for calculating the distance
* @return distance - The distance of the two points
*/
	
function distance (point1, point2)
{
	var R = 6371e3;
	var lat1 = toRadians (point1[1]);
	var lat2 = toRadians (point2[1]);
	var distanceLats = toRadians (point2[1] - point1[1]);
	var distanceLons = toRadians (point2[0] - point1[0]);

	var a = Math.sin (distanceLats / 2) * Math.sin (distanceLats / 2) + Math.cos (lat1) * Math.cos (lat2) * Math.sin (distanceLons / 2) * Math.sin (distanceLons / 2);
	var b = 2 * Math.atan2 (Math.sqrt (a), Math.sqrt (1 - a));
	var distance = R * b;
	return distance;
}


/**
* @function bearing - Function to triangulate the bearing between the location from the user and the other points from pointcloud.js
* @param point1 - The first point for the calculation
* @param point2 - The second point for the calculation
* @var lat1 - The latitude of the start position
* @var lat2 - The latitude of the other position
* @var lon1 - The longitude of the start position
* @var lon2 - The longitude of the other position
* @var c, d - Auxiliary variables needed for triangulating the bearing
* @return bearing - The triangulated direction
*/
	
function bearing (point1, point2)
{
	var lat1 = toRadians (point1[1]);
	var lat2 = toRadians (point2[1]);
	var lon1 = toRadians (point1[0]);
	var lon2 = toRadians (point2[0]);
	
	var c = Math.sin (lon2 - lon1) * Math.cos (lat2);
	var d = Math.cos (lat1) * Math.sin (lat2) - Math.sin (lat1) * Math.cos (lat2) * Math.cos (lon2 - lon1);
	var bearing = direction (Math.atan2 (c, d));
	return bearing;
}


/**
* @function toRadians - Function for changing the lons and lats from degree to radians
* @function toDegree - Function for changing the lons and lats from radians to degree
* @param degree - The given variable of lat or lon in degree
* @param radians - The given variable of lat or lon in radians
* @return degree - The given variable of lat or lon in radians
* @return radians - The given variable of lat or lon in degree
* @source https://www.w3resource.com/javascript-exercises/javascript-math-exercise-33.php
* @source https://www.w3resource.com/javascript-exercises/javascript-math-exercise-34.php
*/

function toRadians (degree)
{
	return degree * (Math.PI / 180);
}

function toDegree (radians)
{
	return radians * (180 / Math.PI);
}
	
	
/**
* @function direction - Function for changing the bearing into a direction
* @param bearing - The overgiven bearing for calculating the directions
* @var possibleDirections - The array with the possible directions
* @var isDirection - The triangulated direction
* @var interval - The interval of the directions
* @return directions [direction] - The triangulated direction
*/

function direction (bearing) 
{
	var possibleDirections = new Array ('N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW');
	var isDirection;
	var interval = (1/8) * Math.PI;

	if (bearing > ((-1) * interval) && bearing <= interval)
	{
		isDirection = 0;
	}
	else if (bearing > interval && bearing <= (2 * interval))
	{
		isDirection = 1;
	}
	else if (bearing > (2 * interval) && bearing <= (3 * interval))
	{
		isDirection = 2;
	}
	else if (bearing > (3 * interval) && bearing <= (4 * interval))
	{
		isDirection = 3;
	}
	else if (bearing > (4 * interval) && bearing <= (5 * interval))
	{
		isDirection = 4;
	}
	else if (bearing > (5 * interval) && bearing <= (6 * interval))
	{
		isDirection = 5;
	}
	else if (bearing > (6 * interval) && bearing <= (7 * interval))
	{
		isDirection = 6;
	}
	else if (bearing > (7 * interval) && bearing <= (8 * interval))
	{
		isDirection = 7;
	}
	else if (bearing > (8 * interval) && bearing <= ((-8) * interval))
	{
		isDirection = 8;
	}
	else if (bearing > ((-8) * interval) && bearing <= ((-7) * interval))
	{
		isDirection = 9;
	}
	else if (bearing > ((-7) * interval) && bearing <= ((-6) * interval))
	{
		isDirection = 10;
	}
	else if (bearing > ((-6) * interval) && bearing <= ((-5) * interval))
	{
		isDirection = 11;
	}
	else if (bearing > ((-5) * interval) && bearing <= ((-4) * interval))
	{
		isDirection = 12;
	}
	else if (bearing > ((-4) * interval) && bearing <= ((-3) * interval))
	{
		isDirection = 13;
	}
	else if (bearing > ((-3) * interval) && bearing <= ((-2) * interval))
	{
		isDirection = 14;
	}
	else if (bearing > ((-2) * interval) && bearing <= ((-1) * interval))
	{
		isDirection = 15;
	}
	else
	{
		return "This is not possible"
	}
	return possibleDirections [isDirection];
}


/**
* @function pointToGeoJSON - Changes a given point to a valid GeoJSON point
* @param geoPoint - The coordinates for the point
* @var newGeoPoint - The new point in valid GeoJSON
* @return newGeoPoint - The new point in valid GeoJSON
*/

function pointToGeoJSON (geoPoint)
{
	var newGeoPoint = 
	{
		"type": "Feature",
		"properties": {},
		"geometry":
		{
			"type": "Point",
			"coordinates": geoPoint
 		}
	};
	return newGeoPoint;
}


/**
* @function multipointToGeoJSON - Changes a multipoint input to a valid GeoJSON multipoint
* @param geoPoint - The coordinates of the point
* @param nr - The number of the point
* @var newGeoMultipoint - The new multipoint in valid GeoJSON
* @return newGeoMultipoint - The new multipoint in valid GeoJSON
*/

function multipointToGeoJSON (geoPoint, nr)
{
	var newGeoMultipoint = 
	{
		"type": "Feature",
		"properties":
		{
			"nr": nr
		},
		"geometry":
		{
			"type": "MultiPoint",
			"coordinates": geoPoint
 		}
	};
	return newGeoMultipoint;
}


/**
* @function changePointcloud - Function to add a new point or delete one point from the pointcloud
* @var tempText - The object of the pointcloud, needed for sorting
**/

function changePointcloud ()
{
	try
	{
		var tempText = JSON.parse (document.getElementById("myPointcloudText").value);
		myPointcloud = {"type": "FeatureCollection", "features": sortArrayByDistance (tempText.features)};
	}
	catch (objError)
	{
		alert("Please fill in a valid GeoJSON!");
	}
}


/**
* @function getBusstops - Makes the request for the busstops from the Conterra - Website
* @var resource - The URL for the request
* @var x - The Request for the XHR - Object
* @var temp - An array with the busstops as GeoJSONObject sorted by the distance to the point point_modified
* @return An GeoJSONObject sorted by the distance
*/

function getBusstops ()
{
	var resource = "https://rest.busradar.conterra.de/prod/haltestellen";
	var x = new XMLHttpRequest();
	x.open("GET", resource, false);
	x.send();
	var temp = sortArrayByDistance (JSON.parse(x.response).features);
	return {"type": "FeatureCollection", "features": temp};
}


/**
* @function getDepartures - Gets the departures and the line texts for the overgiven busstops for the next overgiven time
* @param nr - The number of the busstop for identification
* @param time - The interval for the asked departures
* @var resource - The URL for the request at the Conterra - Website
* @var y - The request for the XHR - Object
* @return The response as an object
*/

function getDepartures (nr, time)
{
	var resource = "https://rest.busradar.conterra.de/prod/haltestellen/" + nr + "/abfahrten?sekunden=" + time;
	var y = new XMLHttpRequest();
	y.open("GET", resource, false);
	y.send();
	return JSON.parse(y.response);
}


/**
* @function sortArrayByDistance - Sorts the given Array of GeoJSONObjects by distance with InsertionSort
* @param array - The  array to be sorted
* @var i, temp - Auxiliary variables for helping with the InsertionSort
* @return array - The overgiven array sorted by the distance
*/

function sortArrayByDistance (array)
{
	var i;
	var temp;
	for (var j = 1; j < array.length; j++)
	{
		temp = array [j];
		i = j - 1;
		while (i >= 0 && distance (array[i].geometry.coordinates, myStartpoint.geometry.coordinates) > distance (temp.geometry.coordinates, myStartpoint.geometry.coordinates))
		{
			array [i + 1] = array [i];
			i--;
		}
		array [i + 1] = temp;
	}
	return array;
}


/**
* @function sortArrayByTime - Sorts the given Array of GeoJSONObjects by time with InsertionSort
* @param array - The  array to be sorted
* @var i, temp - Auxiliary variables for helping with the InsertionSort
* @return array - The overgiven array sorted by the time
*/

function sortArrayByTime (array)
{
	var i;
	var temp;
	if (array.length > 1)
	{
		for (var j = 1; j < array.length; j++)
		{
			temp = array [j];
			i--;
			i = j - 1;
			while (i >= 0 && array[i].tatsaechliche_abfahrtszeit > temp.tatsaechliche_abfahrtszeit)
			{
				array [i + 1] = array [i];
			}
			array [i + 1] = temp;
		}
	}
	return array;
}


/**
* @function fillTableStations - Fills the table dynamically with the calculated values
* @var out - The output in the table
*/

function fillTableStations ()
{
	var out = "";
	for (var i = 0; i < myPointcloud.features.length; i++)
	{
		out += "<tr>\n" + 
			"\t\t\t <td id = \"idPositionLon" + i + "\">" + myPointcloud.features[i].geometry.coordinates[1] + "</td>\n" + 
			"\t\t\t <td id = \"idPositionLat" + i + "\">" + myPointcloud.features[i].geometry.coordinates[0] + "</td>\n" + 
			"\t\t\t <td id = \"idPositionLon" + i + "\">" + myPointcloud.features[i].properties.lbez + "</td>\n" + 
			"\t\t\t <td id = \"idDistance" + i + "\">" + distance (myStartpoint.geometry.coordinates, myPointcloud.features[i].geometry.coordinates) + "</td>\n" + 
			"\t\t\t <td id = \"idDirection" + i + "\">" + bearing (myStartpoint.geometry.coordinates, myPointcloud.features[i].geometry.coordinates) + "</td>\n" + 
			"\t\t</tr>"; 
	}
	document.getElementById("idStationsTablebody").innerHTML = out;
}


/**
* @function fillTableDepartures - The function to fill the table with the departures, the linenumbers and the linetext
* @param time - The interval for the requested departures
* @var departuresNearestStation - An array with the departures, sorted by the next departuretime
* @var timeInMinutes - Changes the overgiven time from seconds to minutes
* @var out - The output in the table
*/

function fillTableDepartures (time)
{
	var departuresNearestStation = sortArrayByTime (getDepartures (myPointcloud.features[0].properties.nr, time));
	if (departuresNearestStation.length == 0)
	{
		var timeInMinutes = time / 60;
		alert ("There is no bus for the next " + timeInMinutes + " minutes!");
	}
	
	var out = "";
	for (var i = 0; i < departuresNearestStation.length; i++)
	{
		out += "<tr>\n" +
			"\t\t\t<td id = \"departure" + i + "\">" + getTime (departuresNearestStation[i].tatsaechliche_abfahrtszeit) + "</td>\n" +
			"\t\t\t<td id = \"line" + i + "\">" + departuresNearestStation[i].linienid + "</td>\n" +
			"\t\t\t<td id = \"lineText" + i + "\">" + departuresNearestStation[i].richtungstext + "</td>\n" +
			"\t\t</tr>";
	}
	document.getElementById("idDeparturesTablebody").innerHTML = out;
}


/**
* @function getTime - Gets the time in unixseconds and gives it out as a readable time used for the departures of the busses
* @param unix - The overgiven time
* @var unix_timestamp - The overgiven time in unix - seconds
* @var date - Creates a new JavaScript Date object based on the timestamp multiplied by 1000 so that the argument is in milliseconds, not seconds
* @var hours - Hours part from the timestamp
* @var minutes - Minutes part from the timestamp
* @var seconds - Seconds part from the timestamp
* @var year - Years part from the timestamp
* @var month - Months part from the timestamp
* @var day - Days part from the timestamp
* @var formattedTime - Displays the time in "05.10.2020, 10:30:23" - format
* @return formattedTime - Returns the formatted time for the departure
* @source: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
*/

function getTime (unix)
{
	var unix_timestamp = unix;
	var date = new Date (unix_timestamp * 1000);

	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();

	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();

	var formattedTime = day + '.' + (month + 1) + '.' + year + ', ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	return formattedTime;
}


/**
* @function showOnMap - Shows the busstops on the map
* @var map - Inserts the map with Leaflet
* @var circle - Shows the busstops on the map
* @var swapped - The startpoint with swapped coordinates for the geoJSON of Leaflet
* @var positionMarker - Shows the startposition on the map
*/

function showOnMap ()
{
	var map = L.map('mapSection').setView ([51.96, 7.63], 12);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		maxZoom: 18,
		attribution: 'Leaflet, OpenStreetMapContributors',
	}).addTo(map);

	for (var i = 0; i < myPointcloud.features.length; i++)
	{
		var circle = L.circle ([myPointcloud.features[i].geometry.coordinates[1], myPointcloud.features[i].geometry.coordinates[0]],
		{
			color:'cyan',
			fillColor: 'white',
			fillOpacity: 0.9,
			radius: 10
		});
		circle.bindPopup ("Busstop: " + myPointcloud.features[i].properties.lbez + ", Direction: " + myPointcloud.features[i].properties.richtung);
		circle.addTo(map);
	}

	var swapped = pointToGeoJSON (JSON.parse ("[" + myStartpoint.geometry.coordinates[0] + "," + myStartpoint.geometry.coordinates[1] + "]"));
	var positionMarker = L.geoJSON (swapped).addTo(map);
	positionMarker.bindPopup ("You are here!");
}