//webhook via IFTTT
//@trackzero

var AWS = require("aws-sdk");

// maker webhook info
var http = require('http');
var url = require('url');
let key = YOUR_IFTTT_WEBHOOK_KEY_HERE;
let iftttevent = 'webcam_status';

var light_on = JSON.stringify({value1: "red"});
var light_off = JSON.stringify({value1: "white"});

AWS.config.update({
  region: "us-west-2"
});


exports.handler=(event, context, callback) => {
    var strIoTBlob = JSON.stringify(event,undefined,2),
    objIoTBlob = JSON.parse(strIoTBlob);
    console.log("strIoTBlob: " + strIoTBlob);
    console.log("objIoTBlob: " + objIoTBlob);
//basically just need to parse whether I sent a light on or light off event...
     var lightstatus=objIoTBlob.lightstatus;
   //lightstatus=response.lightstatus;
    if (lightstatus == "off"){
      console.log("Sending off to IFTTT");
      triggerIfttt(iftttevent, key, light_off);
    } else if (lightstatus == "on"){
      console.log("Sending on to IFTTT");
      triggerIfttt(iftttevent, key, light_on);
    } else {
        console.log("You done borked something");
    }
        
    };   


function triggerIfttt(event, key, payload){
        let iftttUrl=
        `https://maker.ifttt.com/trigger/${event}/with/key/${key}`;
        let postData=payload;
        var parsedUrl = url.parse(iftttUrl);
        var post_options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port,
                path: parsedUrl.path,
                method: 'POST',
                headers: {
                        'Content-Type':'application/json',
                        'Content-Length': postData.length
                }
        };
        var post_req = http.request(post_options, function(res){
                res.setEncoding('utf8');
                res.on('data',function (chunk){
                        console.log('Response: ' + chunk);
                });
        });
        post_req.write(postData);
        post_req.end();

}

