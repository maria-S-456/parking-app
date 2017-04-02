var PARKING_URL = ('/api')
var config = require('./config.js');

function addParkingData(item) {
  console.log('Adding parking data: ' + item);
  $.ajax({
    method: 'POST',
    url: PARKING_URL,
    data: JSON.stringify(item),
    
    dataType: 'json',
    contentType: 'application/json'
  });
}

function handleAddingParking() 
{
  $('#parking-data-form').submit(function(e) {
    e.preventDefault();
    addParkingData({
      location: $(e.currentTarget).find('#js-new-location').val(),
      vacant: $(e.currentTarget).find('#js-new-vacant').val(),
      capacity: $(e.currentTarget).find('#js-new-capacity').val()
    });
  });
}

$(function() {
  addParkingData();
  handleAddingParking();
});
