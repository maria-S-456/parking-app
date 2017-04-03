var parkingDataTemplate = (
  '<option class="park-data">'+
  '<p><span class="js-location">' + '</span></p>'+
  '<p><span class="js-vacant">' + '</span></p>'+
  '<p><span class="js-capacity">' + '</span></p>'
  +'</option>');

var PARKING_URL = '/api';

//make a getAndDisplayData method in searchData.html
function getAndDisplayData(){
  console.log('Retrieving Parking Data');
  $.getJSON(PARKING_URL, function(items){
    console.log('Rendering Parking Data');
    var itemElements = items.map(function(item){
      var element = $(parkingDataTemplate);
      element.attr('id', item.id);
      var parkLocation = element.find('.js-location');
      var parkVacant = element.find('.js-vacant');
      var parkCapacity = element.find('.js-capacity');
      parkLocation.text(item.location);
      parkVacant.text(item.vacant);
      parkCapacity.text(item.capacity);
      return element
    });
    $('.js-park').html(itemElements);
  });
}

function addParkingData(item) {
  console.log('Adding parking data: ' + item);
  $.ajax({
    method: 'POST',
    url: PARKING_URL,
    data: JSON.stringify(item),
    success: function(data){
      getAndDisplayData();
    },    
    dataType: 'json',
    contentType: 'application/json'
  });
}

function handleAddingParking() 
{
  $('#parking-help-form').submit(function(e) {
    e.preventDefault();
    addParkingData({
      location: $(e.currentTarget).find('#js-new-location').val(),
      vacant: $(e.currentTarget).find('#js-new-vacant').val(),
      capacity: $(e.currentTarget).find('#js-new-capacity').val()
    });
  });
}

$(function() {
  getAndDisplayData();
  addParkingData();
  handleAddingParking();
  
});
