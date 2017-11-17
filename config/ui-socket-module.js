const $ = require('jquery');
const alertify = require('alertifyjs');
const io = require('socket.io-client');
// var expand = $(".button")
$(function () {
// connect to server
	var socket = io.connect('http://localhost:8080', {'force new connection': true});
	// listening to server
  socket.emit('ui_com', 'copy');
  socket.on('ui_com', function (data) {
		// print what receive
    console.log(data);
		console.log(typeof data);
		if (0 <= data && data <= 199 && typeof data !== 'string') {
			if (0 == data) {
				alertify.success("welcome Admin");
			} else {
				alertify.success("welcome user : "+data);
			}
		} else if (data == 200){
			alertify.error("finger print is not in Database");
		} else if (data.substring(0, 4)=='Fail'){
			alertify.error(data);
		}else {
			alertify.message(data);
		}

  });
	$( "#expand" ).on( "click", function() {
		console.log('expand');
		// expand.addClass(".clicked")
	});
	$( "#fingerprint" ).on( "click", function() {
		console.log('check admin');
		socket.emit('ui_com', "check admin");
	});
});
