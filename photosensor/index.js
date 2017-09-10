/*
For Raspberry Pi, with photosensor wired to GPIO4 (pin7) and LED (with resistor!) on GPIO17 (pin11)
5v power on pin2, ground on pin6.

*/

var Gpio = require('onoff').Gpio,
  led = new Gpio(17, 'out'),
  photosensor = new Gpio(4, 'in', 'both');

var cooldown, laststate;
cooldown = false;
laststate= false;

function printstate(mystate){
      if (mystate != laststate){
	laststate=mystate
	if (!cooldown){
        	//add code here to run outside of a 2-minute cooldown.
		console.log("HOT code! Watch your hands...");
		cooldown=true;        
                setTimeout(function(){
                    cooldown=false;
                },5000);  //wait two seconds.
	}else{
		console.log("In cooldown.");
	}		
        console.log("Lights are " + mystate);
//    console.log("cooling...") 
      }
};


 
photosensor.watch(function(err, value) {
  if (err) exit();
  led.writeSync(value);
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
