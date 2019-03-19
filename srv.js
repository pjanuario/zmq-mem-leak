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

var pingFrames = [
  "ping"
];

setInterval(function() {
  sock.send(pingFrames);
}, 500);
