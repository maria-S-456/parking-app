 var parkingUrl = 'https://api.parkwhiz.com/search/?lat=41.8857256&lng=-87.6369590&start=1490681894&end=1490692694&key=62d882d8cfe5680004fa849286b6ce20';
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
              var latitude = JSON.parse(JSON.stringify(x)).lat;
              var longitude = JSON.parse(JSON.stringify(x)).lng;
              var origin = prepareCoords(latitude, longitude);
              console.log("Starting coordinates: " + origin);

              $.getJSON(parkingUrl, function(url){
                for(var i = 0; i < url.parking_listings.length; i++){
                  let dLat = url.parking_listings[i].lat;
                  let dLong = url.parking_listings[i].lng;
                  let destination = prepareCoords(dLat, dLong);
                  //send origin and destination to GoogleMapDistance function
                  GoogleMapDistance(origin,destination);
                }
              });             
            } else{
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });
        }
function prepareCoords(lat,long)
        {
          //this function stringifies latitude and longitude of the entered location, c
        lat = lat.toString();
        long = long.toString();
        let comma = ",";
        let coords = lat.concat(comma, long);
        return coords;
        }

function GoogleMapDistance(originLatLong, destLatLong)
        {
          var service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix
          ({
            origins: [originLatLong],
            destinations: [destLatLong],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false
            }, callback);
          console.log('hello');
        }

function callback(response, status)
{
    if (status == google.maps.DistanceMatrixStatus.OK)
    {
    let origins = response.originAddresses;
    let destinations = response.destinationAddresses;
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
          }
      }
    console.log(duration);
    }
}

initMap();
geocodeAddress();