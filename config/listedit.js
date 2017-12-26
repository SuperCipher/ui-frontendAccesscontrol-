const $ = require('jquery');
const alertify = require('alertifyjs');
require('alertifyjs/build/css/alertify.css');
require('alertifyjs/build/css/themes/bootstrap.css');
alertify.set('notifier','position', 'top-right');

$(function() {

  $(".btnDel").click(function(){
    var id = $(this).closest("tr").find('td.fingerId').text();
    var csrf1 = $('#csrf').val();
    // alert(id + " , " + csrf1)
    var jqxhr = $.post("list-edit",
    {
      fingerId: id,
      _csrf:csrf1
    }, function(data) {
      // console.log(data);
      document.location.href = '/account/profile-edit';
    });
  });
  $(".btnBack").click(function(){
    document.location.href = '/account';
  });
  $(".btnRe").click(function(){
    document.location.href = '/list-edit';
  });
});
