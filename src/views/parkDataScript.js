var parkingUrl = 'https://api.parkwhiz.com/search/?lat=41.8857256&lng=-87.6369590&start=1490681894&end=1490692694&key=62d882d8cfe5680004fa849286b6ce20';
var locationName;
$.getJSON(parkingUrl, function(url){

	
	for(var i = 0; i < 20; i++){
		console.log(url.parking_listings[i].location_name);
	}
});
