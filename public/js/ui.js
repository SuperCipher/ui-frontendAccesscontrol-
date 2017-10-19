$(document).ready(function() {
  // var io = require();
  var socket = io();
  // var socket = new io.Socket();
  // var io = require('socket.io-client')

  // const socket = io('http://localhost:8082/fps-namespace');
  // var socket = io('http://localhost:8081/fps-namespace');
  // var socket = io();
  // var socket = io('http://localhost:8081/fps-namespace', { path: '/ui/socket.io'});
  // let socket = io.connect('http://localhost:8080/fps-namespace');
  socket.on('ui_com', function (data) {
    console.log(data);
    socket.emit('ui_com', { message: 'Hello to you too, Mr.Server!' });
  });
  // Place JavaScript code here...
  $( "#expand" ).on( "click", function() {
    alert( "expand" );
  });
  $( "#fingerprint" ).on( "click", function() {
    alert( "fingerprint" );
    // socket.emit('ui_com', "fingerprint");
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
