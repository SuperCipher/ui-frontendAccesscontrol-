const $ = require('jquery');
const alertify = require('alertifyjs');
require('alertifyjs/build/css/alertify.css');
require('alertifyjs/build/css/themes/bootstrap.css');
alertify.set('notifier','position', 'top-right');
// const io = require('socket.io-client');

$(function() {

  // var socket = io.connect('http://localhost:8080', {'force new connection': true});
  // socket.emit('ui_com', {msg:'CLIENT >>> standby'});
  // socket.on('ui_com', function (data) {
  //   // print what receive
  //   console.log(data.msg);
  //   console.log("this is type"+typeof data);
  //   if (data.msg=='Delete confirm') {
  //     alertify.success("Delete confirm : "+data.data)
  //     document.location.href = '/uiedit';
  //   }
  // });

  $(".btnDel").click(function(){
    var id = $(this).closest("tr").find('td.fingerId').text();
    alert("dd");

  });
  $(".btnRe").click(function(){
    document.location.href = '/list-edit';
  });
});