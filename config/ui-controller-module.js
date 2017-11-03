const $ = require('jquery');
const alertify = require('alertifyjs');
alertify.set('notifier','position', 'top-right');

// const io = require('socket.io');
$(function () {
  // Place JavaScript code here...
  console.log('hi')
  $( "#expand" ).on( "click", function() {

  });
  $( "#fingerprint" ).on( "click", function() {
    alertify.message('fingerprint');
    console.log('fi')

    // socket.emit('ui_com', "fingerprint");
  });
});
