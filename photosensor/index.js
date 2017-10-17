//clipped from my ConnectRebooter script....
//this is the actual lambda function, trigger is the IoT device
//Rule query statement: SELECT * FROM 'gpio'
//AWS IoT SQL version: 2016-03-23
//jaferris@

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var workspaces = new AWS.WorkSpaces();
var myWorkSpace="ws-86jhl15dm";   //win10 user in Oregon

exports.handler=(event, context, callback) => {
    var strIoTBlob = JSON.stringify(event,undefined,2),
    objIoTBlob = JSON.parse(strIoTBlob);
    console.log("strIoTBlob: " + strIoTBlob);
    console.log("objIoTBlob: " + objIoTBlob);
//basically just need to parse whether I sent a light on or light off event...
     var lightstatus=objIoTBlob.lightstatus;
   //lightstatus=response.lightstatus;
    if (lightstatus == "off"){
//    console.log ("CallerID: " + phoneNumber);
      console.log("WorkSpace: " + myWorkSpace);
      var stopparams = {
                   StopWorkspaceRequests: [ 
                    {
                        WorkspaceId: myWorkSpace
                    },
                    ]
                };
      workspaces.stopWorkspaces(stopparams, function(err, data) {
        if (err) console.log("error: " + err, err.stack); 
        else     console.log("Success." + data);         
      });
      callback(null, buildResponse(myWorkSpace));
    }
        
    };   


//adding brackets 'til it works
function buildResponse(myWorkSpace) {
    return {
        WorkSpaceID: myWorkSpace,
        lambdaResult:"Success"
    };
}
