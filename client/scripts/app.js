// YOUR CODE HERE:
$(document).ready(function() {
  $('div').on('click', '.username', function() {
    console.log('inside username');
    app.addFriend();
  });

  $('.submit').click(function() {
    app.handleSubmit();
  });
});

var app = {

};

app.server = 'https://api.parse.com/1/classes/messages';

app.init = function() {
  app.fetch();
  console.log('inside init');
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    //data: JSON.stringify(message),
    contentType: 'application/json',
    // success: function (data) {
    //   console.log('chatterbox: Received messages');
    //   console.log(data);
    // },

    success: app.display,


    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive messages', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.addMessage = function(message) {
  //app.send(message);

  console.log('message received!');
  _.each(message.results, function(value){
    var element = document.createElement('div');
    $(element).addClass('username');
    $(element).append(value.username).append('<br />');
    $(element).append(value.text);
    $('#main').append(element);
  });
};

app.addRoom = function(room) {
  var element = document.createElement('div');
  $(element).append(room);
  $('#roomSelect').append(element);
};

app.addFriend = function() {
  console.log('addFriend was called!!!!!');
};

app.displayUsernames = function(data) {
  console.log(data);

  _.each(data, function(results) {
    _.each(results, function(message) {
      var element = document.createElement('div');
      $(element).addClass('username');
      $('#main').append(element);
      $('.username').append(message.username).append('\n');
    });
  });
};

app.handleSubmit = function() {
  var $value = $('.textbox').val();
  var message = {
    username: window.location.search.slice(10),
    text: $value,
    roomname: 'lobby'
  };

  app.send(message);
  app.init();
  console.log('submitting');
};

app.display = function(data) {
  app.addMessage(data);
  app.displayRoom(data);
};


app.displayRoom = function(room) {
  var rooms = {};

  _.each(room.results, function(value) {
    rooms[value.roomname] = value.roomname;
  });

  for (var key in rooms) {
    var options = document.createElement('option');
    $(options).val(key);
    $(options).text(key);
    $('select').append(options);
  }
};

_.escape();





app.init();