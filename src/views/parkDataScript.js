var map;
function initMap() {
  //Set the starting position in Chicago currently
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.8781, lng: -87.6298},
    zoom: 15
    });

  //Geocoding is used to get the location entered in the submit box onto the map.
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

      //create a marker at the location entered by the user.
      var marker = new google.maps.Marker({
      map: resultsMap,
      position: results[0].geometry.location
      });

    //Getting coordinates from inputted data in string format
    var x = results[0].geometry.location; 
    var coords = [JSON.parse(JSON.stringify(x)).lat, JSON.parse(JSON.stringify(x)).lng];             
  
    findDistance(coords);
           
    } else{
    alert('Geocode was not successful for the following reason: ' + status);
    }
  });
};

function findDistance(start){
  var directionsService = new google.maps.DistanceMatrixService();
  var strCoords = (start[0].toString()).concat(",",start[1].toString());

  //var $list = $('#list');
   $(function(){
        $.ajax({
          type: 'GET',
          url: '/auth/api',
          success: function(data){
            //console.log(data.locations);

            $.each(data, function(index, item){
              $.each(item, function(index2, subitem){
                var endCoords = (subitem.lat.toString()).concat(",",subitem.lng.toString());
                //console.log(endCoords); //coordinates of all locations in string format

                directionsService.getDistanceMatrix({
                origins: [strCoords],
                destinations: [endCoords],
                travelMode: google.maps.TravelMode.DRIVING
                }, callback);

                //$list.append('<li>Place Name: ' + subitem.location_name + '</li>' + '<li>Address: ' + subitem.address + '</li>');
              

              });
            });
          }
        });
      });
};

var arrayItems = [];

function callback(res, stats){

    if (stats === google.maps.DistanceMatrixStatus.OK){
      var distance = (res.rows[0].elements[0].distance.value)/1609.34;
      arrayItems.push(distance);

      if(arrayItems.length === 60){
        var $list = $('#list');
        $list.empty();
       
        $(function(){
          $.ajax({
            type: 'GET',
            url: '/auth/api',
            success: function(data){
              
              for(var f = 0; f < data.locations.length; f++){                
                data.locations[f]["distance"] = arrayItems[f];
              };

              data.locations.sort(function(a,b){
                return a.distance - b.distance;
              });

              for(var i = 0; i < arrayItems.length; i++){
              $list.append('<li><div><p>Place Name: ' + data.locations[i].location_name + '</p>' + '<p>Address: ' + data.locations[i].address + '</p><p>Distance: ' + data.locations[i].distance + '</p><p>State ' + data.locations[i].state + '</p></div></li>');
              };

              arrayItems = [];
              distance = [];
            }
          })
        });        
      }
    }
    else{
      console.log('Error: ' + res.originAddresses);
    }
    //console.log(res.originAddresses);
};
/*

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
              //console.log("Starting coordinates: " + origin);

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
          //console.log(destLatLong);
          var service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix({
            origins: [originLatLong],
            destinations: [destLatLong],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false
            }, callback);
          //console.log(callback);
        }

function callback(response, status)
{
   // console.log('response: ' + response);
    //console.log('status: ' + status);
    if (status == google.maps.DistanceMatrixStatus.OK)
    {
      //console.log('response ' + JSON.stringify(response)); //same
      let origins = response.originAddresses;
      let destinations = response.destinationAddresses;
   
      //console.log('origins: ' + origins);
    }
}

initMap();
geocodeAddress();

//cannot get mailing address from coordinates, only coordinates
*/