var post = require('./index').send;
var server = 'http://127.0.0.1:8086/write?db=test';
post(server,{
  measurement:'hey',
  time:new Date(),
  tags:{
    a:'b'
  },
  fields:{
    c:'d'
  }
});
