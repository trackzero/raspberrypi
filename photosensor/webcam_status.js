/*
For Raspberry Pi Zero, with photosensor wired to GPIO4 (pin7) and LED (with resistor!) on GPIO17 (pin11)
5v power on pin2, ground on pin6.
dependency: npm install onoff --save
Use: photosensor over webcam status LED, trigger AWS Lambda. Lambda fires IFTTT webhook.
*/

var network=require('./getip.js');

var awsIot = require('aws-iot-device-sdk');

var device = awsIot.device({
   keyPath: "/home/pi/certs/private.pem.key",
  certPath: "/home/pi/certs/certificate.pem.crt",
    caPath: "/home/pi/certs/root-CA.crt",
  clientId:  "RaspberryPi",
      host:  "aogn3xn7b5jsr.iot.us-west-2.amazonaws.com"
});

device
  .on('connect', function() {
    //console.log('connect: ' + JSON.stringify(network.ip.address));
    //device.subscribe('gpio2');      //use if I want to return data through MQTT
    device.publish('gpio', JSON.stringify(network.ip.address));
    });

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });





var Gpio = require('onoff').Gpio,
  led = new Gpio(17, 'out'),
  photosensor = new Gpio(4, 'in', 'both'); //could use debounceTimeout?

var cooldown, laststate;
cooldown = false;
laststate= false;

function printstate(mystate){
      if (mystate != laststate){
	laststate=mystate
	if (!cooldown){
        	//add code here to run outside of cooldown.
		console.log("HOT code! Watch your hands...");
                device.publish('gpio',JSON.stringify({
                    "lightstatus": mystate}));
		cooldown=true;        
                setTimeout(function(){
                    cooldown=false;
                },5000);  //wait 5 seconds.
	}else{
		console.log("In cooldown.");
	}		
        console.log("Lights are " + mystate);
      }
};


 
photosensor.watch(function(err, value) {
  if (err) exit();
  led.writeSync(value ^ 1);  //not sure if that'll work.
  if (value==0){
    printstate("on");
  } else {
  //	console.log('Lights off.');
        printstate("off");
//        runtimer();
          }
});
 
console.log('Pi launched successfully!');


process.on('SIGINT', function () {
  led.unexport();
  photosensor.unexport();
  console.log('Shutting down');
});
