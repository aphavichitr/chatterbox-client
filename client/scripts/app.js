// YOUR CODE HERE:
$(document).ready(function() {
  //add new friend
  $('div').on('click', '.username', function() {
    var friendName = $(this).text();
    app.addFriend(friendName);
  });

  //submit new message
  $('.submit').click(function() {
    var room = $('select').val();
    app.handleSubmit(room);
  });

  //change selected room
  $('select').change(function() {
    var room = $('select').val();
    app.fetch(room);
  });

  //creates a new room
  $('.submitRoom').click(function() {
    var roomName = $('.newroom').val();
    app.addRoom(roomName);
  });

});

var app = {
  friends: {},
  server: 'https://api.parse.com/1/classes/messages'

};

// app.friends = {};

// app.server = 'https://api.parse.com/1/classes/messages';

app.init = function() {
  app.fetch('pick a room');
  setInterval(function(){
    var roomname = $('select').val();
    if(roomname !== 'pick a room' ){
      app.fetch(roomname);
    }
  }, 5000);
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

app.fetch = function(roomname, flag) {
  $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      var result = [];
      console.log(data);
      //get all rooms for drop down
      app.fillDropDown(data);

      if (roomname === 'pick a room') {
        //does nothing so that it only gets all rooms for drop down
      } else {
        //shows all messages if we run fetch without a parameter
        if (roomname === undefined) {
          app.addMessage(data.results);
        } else {
          var roomExist = false;
          //loop through raw data and create new array of objects with username/text for messages
          _.each(data.results, function(value) {
            if (_.escape(value.roomname) === roomname) {
              //console.log(roomExist);
              roomExist = true;
              var msg = {};
              msg['username'] = _.escape(value.username);
              msg['text'] = _.escape(value.text);

              result.push(msg);
            }
          });
          
          if (!roomExist) {
            var msg = {};
            msg['username'] = window.location.search.slice(10);
            msg['text'] = "Creating new room.";
            msg['roomname'] = roomname;

            app.send(msg);
            app.fetch(roomname);

            $('select').val(roomname);
            console.log('doesnt exist!!!');

          }

          //clears page and writes new messages on DOM
          app.addMessage(result);

          //clears dropdown and repopulates the dropdown 
          $('select').empty();
          app.fillDropDown(data);

          //keeps current selected value in drop down
          $('select').val(roomname);
        }
      }

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive messages', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

//message is passed in as an array of objects
app.addMessage = function(message) {
  app.clearMessages();

  console.log('message received!');
  _.each(message, function(value){
    var $msg = document.createElement('div');
    var $username = document.createElement('div');
    
    $($msg).addClass('message');
    $($username).addClass('username');
    if(_.escape(value.username + ': ') in app.friends) {
      console.log('bolding!!');
      $($username).css('font-weight', 'bold');
      $($username).css('font-family', 'Tahoma');
      $($username).css('color', '#3d3d5c');
    }

    $($username).append(_.escape(value.username + ': '));
    $($msg).append($username);
    $($msg).append(_.escape(value.text)).append('<br />');
    $('#chats').append($msg);
  });
};


app.addFriend = function(friendName) {
  console.log('addFriend was called!!!!!');

  app.friends[friendName] = friendName;
  console.log(app.friends);
  var roomname = $('select').val();
  app.fetch(roomname);

};

app.handleSubmit = function(room) {
  var $value = $('.textbox').val();
  var message = {
    username: window.location.search.slice(10),
    text: _.escape($value),
    roomname: room
  };

  app.send(message);
  app.fetch(room);
  console.log('submitting');
};


app.fillDropDown = function(room) {

  var rooms = {};

  _.each(room.results, function(value) {
    var roomname = _.escape(value.roomname);
    rooms[roomname] = roomname;
  });

  for (var key in rooms) {
    var options = document.createElement('option');
    $(options).val(key);
    $(options).text(key);
    $('select').append(options);
  }
};

app.addRoom = function(roomName) {

  $('select').val(roomName);
  app.fetch(roomName);

};

app.init();