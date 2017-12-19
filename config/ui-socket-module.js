const $ = require('jquery');
const alertify = require('alertifyjs');
require('alertifyjs/build/css/alertify.css');
require('alertifyjs/build/css/themes/bootstrap.css');
alertify.set('notifier','position', 'top-right');
const io = require('socket.io-client');

var admin = "none"
var ininterval = 'none'
$(function () {
// connect to server
	var socket = io.connect('http://localhost:8080', {'force new connection': true});
	// listening to server
  socket.emit('ui_com', {msg:'CLIENT >>> standby'});
  socket.on('ui_com', function (data) {
		// print what receive
    // console.log(data);
		// console.log("this is type"+typeof data.msg);
		if (data.msg=='verified admin') {
			admin = "admin"
			alertify.success("Welcome Admin : "+data.data);
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
		// socket.emit('ui_com', {msg:"delete"});
	});
	$( "#add" ).on( "click", function() {
		console.log('add');
		socket.emit('ui_com', {msg:"add"});
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
