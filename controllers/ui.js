'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();
var ipStream

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      // console.log(ifname + ':' + alias, iface.address);
      // ipStream=
    } else {
      // this interface has only one ipv4 adress
      // console.log(ifname, iface.address);
      if(ifname=="en0"){
        ipStream = iface.address;
        ipStream = "http://"+ipStream+ ":8091"
        // console.log(ipStream);
      }
    }
    ++alias;
  });
});


// ipStream = "http://"+ipStream+ ":8091"
/**
 * GET /
 * UI page.
 */
exports.index = (req, res) => {
  res.render('ui', {
    title: 'ui',
    streamip : ipStream

  });
  console.log(ipStream);
//   console.log(ifname + ':' + alias, iface.address);
// console.log(ifname, iface.address);
};
