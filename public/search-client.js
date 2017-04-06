var dropdownItem = (
'<option class="listItem">' +'</option>'
	);

var PARKING_URL = '/api';

function getListItem() {
 //console.log('Retrieving location names')
  $.getJSON(PARKING_URL, function(locations) {
    //console.log('Rendering locations');
    var locationElement = locations.map(function(place) {
      var element = $(dropdownItem);
      element.attr('id', place.id);
      element.find('.listItem').text(place.location);
  		//console.log(place.location);
      $('#js-park').append('<option>' + place.location + '</option>');
      return element;

    });
   
  });
}

function showLocationData()
{
	$('#search-button').on('click',function(e) {
		//be sure to include e.preventdefault. will flash console quickly before disappearing
		e.preventDefault();
		console.log('You are clicked!');
	});
}

$(function(){
	
	getListItem();
	showLocationData();
});