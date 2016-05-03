// YOUR CODE HERE:
$(document).ready(function() {
  $('div').on('click', '.username', function() {
    console.log('inside username');
    app.addFriend();
  });

  $('#send .submit').submit(function() {
    console.log('invoked handle submit');
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

    success: app.addMessage,


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
  var element = document.createElement('div');
  $(element).addClass('username');
  console.log(message.username);
  $(element).append(message.username);
  $('#main').append(element);

  var texts = document.createElement('div');
  $(texts).append(message.text);
  $('#chats').append(texts);
};

app.addRoom = function(room) {
  var element = document.createElement('span');
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
  console.log('handlesubmit invoked again');
};


_.escape();





app.init();