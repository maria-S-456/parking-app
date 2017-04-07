//all html pages must have a different client js page

var PARKING_URL = '/api';

function submitAddParking() 
{
  $('#id-input-button').on('click',function(e) {
    console.log('submit clicked');
    e.preventDefault();
    postData({
    	location: $('#js-new-location').val(),
    	vacant: $('#js-new-vacant').val(),
    	capacity: $('#js-new-capacity').val()
    });
    //console.log($('#js-new-location').val());

  });
}

function postData(data){
console.log('inputted data ' + JSON.stringify(data));

$.ajax({
    method: 'POST',
    url: PARKING_URL,
    data: JSON.stringify(data),
    success: function(d) {
      console.log('Posted Successfully!');
    },
    dataType: 'json',
    contentType: 'application/json'
  });

};

$(function(){
	//need to fix: don't run postData() until submitAddParking() runs first.
	submitAddParking();
	postData();
});