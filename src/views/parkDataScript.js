var parkingUrl = 'https://api.parkwhiz.com/search/?lat=41.8857256&lng=-87.6369590&start=1490681894&end=1490692694&key=62d882d8cfe5680004fa849286b6ce20';

$.getJSON(parkingUrl, function(url){
	$.each(url, function(key, value){
		console.log(key + ": " + JSON.stringify(value) + "<br />");
	});
});
