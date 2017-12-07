// const io = require('socket.io-client');
// var socket = io.connect('http://localhost:8080', {'force new connection': true});


$(document).ready(function() {
  // socket.emit('ui_com', 'CLIENT >>> standby');

  $(".btnDel").click(function(){
    var id = $(this).closest("tr").find('td.fingerId').text();
    if (confirm('Do you want to delete user: '+id)) {

    }else {

    }
  });
  $(".btnBack").click(function(){
    document.location.href = '/ui';
  });
});
