$(document).ready(function() {

  // var socket = io();
  // var socket = io('/fps-namespace');
  // var socket = io('http://localhost:8081/fps-namespace');
  // let socket = io.connect('http://localhost:8080/fps-namespace');
    // socket.on('ui_com', function (data) {
    //   // console.log(data);
    //   // console.log('data');
    //   // console.log(data.hello);
    //   socket.emit('ui_com', { message: 'Hello to you too, Mr.Server!' });
    // });

  // connect to server
  	var socket = io.connect();
  	// listening to server
    socket.on('ui_com', function (data) {
  		// print what receive
      console.log(data);
  		if (data == "IdentifySucess") {
  			alert(data)
  		}

      socket.emit('ui_com', "coppy");
    });

  // Place JavaScript code here...
  $( "#expand" ).on( "click", function() {
    alert( "expand" );
  });
  $( "#fingerprint" ).on( "click", function() {
    alert( "fingerprint" );
    socket.emit('ui_com', "fingerprint");
  });

  // socket.emit('ui_com', "fingerprint");
  //
  // socket.on('ui_com', function(msg){
  //   alert( msg );
  // });

  // var io = require('socket.io-client');
  // // var socket = io('/fps-namespace');
  // var socket = io.connect('http://localhost:8081/fps-namespace', {reconnect: true});
  //
  // // Add a connect listener
  // socket.on('connect', function (socket) {
  //   console.log('Connected!');
  // });
  // socket.emit('ui_com', 'me');
  // socket.on('ui_com',function (data) {
  //   console.log(data);
  // });

});
