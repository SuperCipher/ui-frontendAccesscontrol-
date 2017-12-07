const $ = require('jquery');
const alertify = require('alertifyjs');
alertify.set('notifier','position', 'top-right');
const io = require('socket.io-client');
var admin = "none"
var ininterval = 'none'
$(function () {
// connect to server
	var socket = io.connect('http://localhost:8080', {'force new connection': true});
	// listening to server
  socket.emit('ui_com', 'CLIENT >>> standby');
  socket.on('ui_com', function (data) {
		// print what receive
    console.log(data);
		console.log("this is type"+typeof data);
		if (data.msg=='verified Successfull') {
			if (0 == data.data) {
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
						admin = "none"
						console.log(admin);
				  }
				}, 1000);
			} else {
				alertify.success("welcome user : "+data.data);
			}
		} else if (data.msg == 'verified Failed'){
			alertify.error("finger print is not in Database");
		} else if (data.msg.substring(0, 4)=='Fail'){
			alertify.error(data);
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
		document.location.href = '/uiedit';
		socket.emit('ui_com', "delete");
	});
	$( "#add" ).on( "click", function() {
		console.log('add');
		socket.emit('ui_com', "add");
	});
	$( ".button-adminMode" ).on( "click", function() {
		console.log('expand');
		var classname=$('#expand').attr('class');
		if(admin === "admin"){
      // open menu
			$("#expand").addClass("clicked");
			$("#expand").removeClass("notClick");
			if(ininterval == 'none'){
				ininterval = 'inuse';
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
					if (seconds > 10) {
						$("#expand").addClass("notClick")
						$("#expand").removeClass("clicked");
						ininterval = 'none'
						clearInterval(x);
					}
				}, 1000);
			}
		}
		if(classname==='button clicked'){
			// close menu
			$("#expand").addClass("notClick")
			$("#expand").removeClass("clicked");
			clearInterval(x);
		}
	});
});
