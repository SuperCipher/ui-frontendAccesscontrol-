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
		console.log(typeof data);
		if (0 <= data && data <= 199 && typeof data !== 'string') {
			alertify.success("welcome : "+data);
		} else if (data == 200){
			alertify.error("finger print is not in Database");
		} else if (data.substring(0, 4)=='Fail'){
			alertify.error(data);
		}else {
			alertify.message(data);
		}

		// if (0 <= data && data <= 199 && typeof data !== 'string') {
		// 	alertify.success("welcome : "+data);
		// } else {
		// 	alertify.error("finger print is not in Database");
		// }
  });
	$( "#expand" ).on( "click", function() {

	});
	$( "#fingerprint" ).on( "click", function() {
		console.log('check admin')
		socket.emit('ui_com', "check admin");
	});
});
