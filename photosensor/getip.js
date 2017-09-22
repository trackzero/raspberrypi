'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();
var output = "";

function getIps(){
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
        output=(output + ifname + ':' + alias +  " " + iface.address + "\n");
      } else {
      // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
        output=(output + ifname + " " + iface.address + "\n");
      }
      ++alias;
    });
  });
return output;
}

exports.ip=getIps();

//console.log(output);
