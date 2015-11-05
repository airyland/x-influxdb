var post = require('./index').sendEvent;
var server = 'http://somedomain:8086/write?db=test';

post(server, new Date(), 'someuuid', 'hello', 'world');
