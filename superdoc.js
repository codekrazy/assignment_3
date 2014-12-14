var fs = require('fs');
var sys = require("sys");
var request = require("supertest");
var googleAPIKey = "AIzaSyA-fNpWW48dbB5TNpJTVCmwbb7mJMfK8-U";
var weatherAPIKey = "38d93d640566317ea4e4fb2de2c98827";

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
	var inputAddress = d.toString().substring(0, d.length-1);
	var convertedAddress = encodeURIComponent(inputAddress);
	console.log(inputAddress);
	
	var GoogleURL = "http://maps.googleapis.com/maps/api/geocode/json?address=" + convertedAddress + "&" + "key=" + googleAPIKey;
	console.log(GoogleURL);
	
	googleAPIKey = request("https://maps.googleapis.com/maps/api/geocode/json")
		.get("?address=" + convertedAddress + "&" + "key=" + googleAPIKey)
		.end(function (err, response) {
			console.log(response.body);
			var lat = response.body.results[0].geometry.location.lat;
			var lng = response.body.results[0].geometry.location.lng;
			console.log(lat, lng);


			var weatherURL = "https://api.forecast.io/forecast/" + weatherAPIKey + "/" + lat + "," + lng;
			console.log(weatherURL);

			weatherAPIKey = request(weatherURL);

			weatherAPIKey.get('/').expect(200, function(err, response) {
				if(err) {
              		console.log("Did not receive status 200 -- error is: " + err);
       			}
        		else {
            		var epochtime = (response.body.currently.time);
					var datetime = new Date();
					var summary = (response.body.currently.summary);	
					var logfile = "weather.txt";
					var mystring = "Datetime: " + datetime + "\n" + "Address: " + inputAddress + "\n" + "GPS Location: " + lat + "," + lng + "\n" + "Current conditions: " + summary + "\n";	
            		console.log("Successfully retrieved weather data from API");
        		}

				fs.appendFile(logfile, mystring, function (err) {
			 		 if (err) throw err;			  
			 	});
			});
		});
});
		




