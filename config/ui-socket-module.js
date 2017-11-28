const $ = require('jquery');
const alertify = require('alertifyjs');
const io = require('socket.io-client');
var admin = "non"
$(function () {
// connect to server
	var socket = io.connect('http://localhost:8080', {'force new connection': true});
	// listening to server
  socket.emit('ui_com', 'CLIENT >>> recieve');
  socket.on('ui_com', function (data) {
		// print what receive
    console.log(data);
		console.log(typeof data);
		if (0 <= data && data <= 199 && typeof data !== 'string') {
			if (0 == data) {
				admin = "admin"
				alertify.success("welcome Admin");
				var countDownDate = new Date().getTime();
				var x = setInterval(function() {
				  // Get todays date and time
				  var now = new Date().getTime();
				  // Find the distance between now an the count down date
				  var distance = now - countDownDate ;
				  // Time calculations for days, hours, minutes and seconds
				  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
					console.log(seconds);
				  // If the count down is finished, write some text
				  if (seconds > 4) {
				    clearInterval(x);
						admin = "non"
						console.log(admin);
				  }
				}, 1000);
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

	$( "#close" ).on( "click", function() {
		console.log('close');
    $("#expand").removeClass("clicked");
    $("#expand").addClass("notClick")
	});

	$( "#delete" ).on( "click", function() {
		console.log('delete');
		socket.emit('ui_com', "delete");
	});

	$( "#add" ).on( "click", function() {
		console.log('add');
		socket.emit('ui_com', "add");
	});

	$( ".button-adminMode" ).on( "click", function() {
		console.log('expand');
		if(admin === "admin"){
			$("#expand").toggleClass('clicked notClick');
		}
	});
});
