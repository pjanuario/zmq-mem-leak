var _ = require('lodash');
var zmq = require('zeromq');
var sock = zmq.socket('router');

var uri = process.env["BROKER_URI"] || 'tcp://127.0.0.1:3000'
sock.bindSync(uri);
console.log('broker.connected to %s', uri);

sock.on('message', function () {
  var frames = _.toArray(arguments).map(String);
  console.log('broker.work: %j', frames);
  frames[1] = 'pong';
  sock.send(frames);
})
sock.on('error', function (err) {
  console.log('broker.error: ', err);
})
