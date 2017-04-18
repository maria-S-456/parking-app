//every page must have a different client file

var dropdownItem = (
'<option class="listItem">' +'</option>'
	);

var displayItem = (
	'<span class="park-loc">' + '</span>' + '<br>' + '<span class="park-capacity">' + '</span>' +
	'<br>' + '<span class="park-vacant">' + '</span>');

var PARKING_URL = '/api';

function getListItem() {
 //console.log('Retrieving location names')
  $.getJSON(PARKING_URL, function(locations) {
    //console.log('Rendering locations');
    var locationElement = locations.map(function(place) { //map function gets ALL data
      var element = $(dropdownItem);
      element.attr('id', place.id);
      element.find('.listItem').text(place.location);

  		
      $('#js-park').append('<option>' + place.location + '</option>');
      //console.log(place.location);
      return element;
    });
   });



}

function showLocationData()
{
	$('#search-button').on('click',function(e) {
		//be sure to include e.preventdefault. will flash console quickly before disappearing
		e.preventDefault();
		$('#location-data').empty();   //gets rid of previous data
		//console.log('You are clicked!');

		var locale = $('#js-park').val(); //gets current value selected in dropdown box

		$.getJSON(PARKING_URL + '/' + locale, function(data){
			//console.log(data); //data is an array of an object. must access the array, then the object
			var parkElement = $('displayItem');
			//console.log(JSON.stringify(data));
			
			parkElement.find('.park-loc').text(locale);
			$('#location-data').append('<p>' + data[0].location + '</p>' + '<p>' + data[0].vacant + '</p>' + '<p>' + data[0].capacity + '</p>');
			return parkElement;
		});
	});
}

$(function(){
	
	getListItem();
	showLocationData();
});