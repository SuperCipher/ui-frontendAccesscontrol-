const $ = require('jquery');
const alertify = require('alertifyjs');
const io = require('socket.io-client');
$(function () {
// connect to server
	var socket = io.connect('http://localhost:8080', {'force new connection': true});
	// listening to server
  socket.emit('ui_com', 'copy');
  socket.on('ui_com', function (data) {
		// print what receive
    console.log(data);
      alertify.message("welcome : "+data);
  });
});
