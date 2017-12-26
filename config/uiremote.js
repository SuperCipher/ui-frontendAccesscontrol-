const $ = require('jquery');
const alertify = require('alertifyjs');
require('alertifyjs/build/css/alertify.css');
require('alertifyjs/build/css/themes/bootstrap.css');
alertify.set('notifier','position', 'top-right');
const io = require('socket.io-client');
require('../public/css/ui.scss');

var admin = "none"
var ininterval = 'none'
$(function () {
// connect to server
	var socket = io.connect();
	// listening to server
  socket.emit('ui_com', {msg:'CLIENT >>> standby', data:222});
  socket.on('ui_com', function (data) {
		// print what receive
    // console.log(data);
		// console.log("this is type"+typeof data.msg);
		if (data.msg=='verified admin') {
			admin = "admin"
			alertify.success("Welcome Admin : "+data.data);
		} else if(data.msg=='verified user'){
			alertify.success("Welcome User : "+data.data);
		} else if (data.msg == 'verified Failed'){
			alertify.error("finger print is not in Database");
		} else if (data.msg.substring(0, 4)=='Fail'){
			alertify.error(data.msg);
		}else if (data.msg=='Enrolled confirm') {
			alertify.success(data.msg);
		}else {
			alertify.message(data.msg);
		}
  });

	$( "#close" ).on( "click", function() {
		console.log('close');
    $("#expand").removeClass("clicked");
    $("#expand").addClass("notClick")
	});
	$( "#delete" ).on( "click", function() {
		console.log('delete');
		document.location.href = '/uidelete';
	});
	$( "#add" ).on( "click", function() {
		console.log('add');
		socket.emit('ui_com', {msg:"add",data:222});
	});
	$( ".button-adminMode" ).on( "click", function() {
		console.log('expand');
    $("#expand").toggleClass('clicked notClick');
	});
});
