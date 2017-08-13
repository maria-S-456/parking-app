var map;

function load(){
  var recievedValue = sessionStorage.getItem('textbox');
  
  if(recievedValue != null){
    document.getElementById('address').value = recievedValue;
    document.getElementById('submit').click();
    sessionStorage.removeItem('textbox');
  }
}

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.8781, lng: -87.6298},
    zoom: 15
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

   $(function(){
        $.ajax({
          type: 'GET',
          url: '/auth/api',
          success: function(data){

            $.each(data, function(index, item){
              $.each(item, function(index2, subitem){
                var endCoords = (subitem.lat.toString()).concat(",",subitem.lng.toString());

                directionsService.getDistanceMatrix({
                  origins: [strCoords],
                  destinations: [endCoords],
                  travelMode: google.maps.TravelMode.DRIVING
                }, callback);
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
              $list.append('<li><div><p style="font-family:Georgia">' + data.locations[i].location_name + '</p>' + '<span style="font-size: 16px; font-family: Georgia">' + data.locations[i].address + ', ' + data.locations[i].city + ' ' + data.locations[i].state + '</span><p style="font-size: 16px; font-family:Georgia">Distance from destination: ' + Math.round(data.locations[i].distance) + ' miles</p></div></li>');
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
};