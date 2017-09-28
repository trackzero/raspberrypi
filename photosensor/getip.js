'use strict';

var o={};
var key='address';
o[key]=[];

var os = require('os');
var ifaces = os.networkInterfaces();

exports.ip=getIps();

function getIps(){
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
        var data = {
          interface: ifname,
          address:  iface.address
          };
        o[key].push(data);
      
   
      ++alias;
    });
  });
console.log(JSON.stringify(o));
return o;
}
