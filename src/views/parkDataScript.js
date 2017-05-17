

   	function initMap() {
     	//after moving google map code to external js file, now getting error "Uncaught ReferenceError: google is not defined". This doesn't stop the map from working though
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: 41.8781, lng: -87.6298}
        });

         var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function() {          
          geocodeAddress(geocoder, map);
        });
      }
    function geocodeAddress(geocoder, resultsMap)
        {
          var address = document.getElementById('address').value;
          geocoder.geocode({'address':address}, function(results, status){
            if(status === 'OK'){
              resultsMap.setCenter(results[0].geometry.location);

              var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
              });
              var x = results[0].geometry.location;
              var latitude = "";
              var longitude = "";
              var latitude = (JSON.parse(JSON.stringify(x)).lat).toString();
              var longitude = (JSON.parse(JSON.stringify(x)).lng).toString();
              //console.log('longitude: ' + longitude + '. latitude: ' + latitude);
              stringifyCoords(latitude, longitude);

              var parkingUrl = 'https://api.parkwhiz.com/search/?lat=41.8857256&lng=-87.6369590&start=1490681894&end=1490692694&key=62d882d8cfe5680004fa849286b6ce20';
              
          /*    $.getJSON(parkingUrl, function(url){
               for(var i = 0; i < 20; i++){
                //console.log(url.parking_listings[i].location_name);
            	//console.log(url.parking_listings[i].lat);
            	}            	
              }); */
            } else{
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });
        }
      function stringifyCoords(Olat,Olong){
        //lat and long refer to origin coordinates
        console.log('using getDistance(). latitude: ' + Olat + '. longitude: ' + Olong);
        //concatenate coordinates into a string
        let comma = ",";
        let origin = Olat.concat(comma, Olong);
        
        //console.log(origin);
      }

      function callback(response, status)
{
    if (status == google.maps.DistanceMatrixStatus.OK)
    {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
      for (var i = 0; i < origins.length; i++)
      {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++)
          {
              var element = results[j];
              var from = origins[i];
              var to = destinations[j];
              var distance = element.distance.text;
              var duration = element.duration.text;
              var ResultStr = distance + "&nbsp; (<i>" + duration + "</i>)";
          }
      }
    document.getElementById("Results1").innerHTML = ResultStr;
    console.log(from);
    }
}

	initMap();
	geocodeAddress();


	//get distance from entered coordinates to every location, then sort by proximity
	//loop
	
	//use 'latitude' and 'longitude' from lines 27 and 28 and use google map directions api to get length of time to each parking house.
	//make list of parking locations and their distance from entered location