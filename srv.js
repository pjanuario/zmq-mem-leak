var _ = require('lodash');
var zmq = require('zeromq');
var sock = zmq.socket('dealer');

sock.identity = "srv#1"
sock.linger = 0

var uri = process.env["BROKER_URI"] || 'tcp://127.0.0.1:3000'
sock.connect(uri);
console.log('srv.connected to %s', uri);

sock.on('message', function (frames) {
  var frames = _.toArray(arguments).map(String);
  console.log('srv.work: %j', frames);
})
sock.on('error', function (err) {
  console.log('srv.error: ', err);
})

var IDENTITY_FRAME = 0,
    PROTOCOL_FRAME = 1,
    TYPE_FRAME     = 2,
    RID_FRAME      = 3,
    ADDRESS_FRAME  = 4,
    HEADERS_FRAME  = 5,
    STATUS_FRAME   = 6,
    PAYLOAD_FRAME  = 7;


var pingFrames = [
  "ZSS:0.0",
  "REQ",
  "c1e9a160-4a4a-11e9-a123-afbb82ae3d12",
  JSON.stringify({
    "sid": "COMPUTEINSTANCE_PROFILE_CONFIGURATION",
    "sversion": "*",
    "verb": "BATCH"
  }),
  JSON.stringify({
    "userId": "5ae857a3f3488d5386684b1f",
    "tenantId": "58ac2c19f2c169639e74dc19",
    "X-REQUEST-ID": "c763b7ba28826842b1b72f5e64f55556"
  }),
  "",
  JSON.stringify({sid: 'TEST'})
];

setInterval(function() {
  sock.send(pingFrames);
}, parseInt(process.env["HEARTBEAT"], 10) || 500);
