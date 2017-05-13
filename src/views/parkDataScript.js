/*
var parkingUrl = 'https://api.parkwhiz.com/search/?lat=41.8857256&lng=-87.6369590&start=1490681894&end=1490692694&key=62d882d8cfe5680004fa849286b6ce20';
$.getJSON(parkingUrl, function(url){

	for(var i = 0; i < 20; i++){
		console.log(url.parking_listings[i].location_name);
	}

});
*/


   	function initMap() {
     
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
              console.log('longitude: ' + longitude + '. latitude: ' + latitude);


              var parkingUrl = 'https://api.parkwhiz.com/search/?lat=41.8857256&lng=-87.6369590&start=1490681894&end=1490692694&key=62d882d8cfe5680004fa849286b6ce20';
              $.getJSON(parkingUrl, function(url){
                for(var i = 0; i < 20; i++){
                console.log(url.parking_listings[i].location_name);}
              });
            } else{
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });
        }

function runMapData(){
	initMap();
	geocodeAddress();
}

module.exports = runMapData();