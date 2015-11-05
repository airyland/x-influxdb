var json2line = require('influx-json2line');
var request = require('requestretry');
var ratelimit = require('rate-limit');
var queue = ratelimit.createQueue({
  interval: 10
});

var post = function(server, line) {
  request({
    method: 'POST',
    url: server,
    form: line,
    maxAttempts: 5, // (default) try 5 times
    retryDelay: 5000, // (default) wait for 5s before trying again
    retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
  }, function(err, response, body) {
    if (response) {
      console.log(response.statusCode + ' ' + response.attempts);
    }
  });
}

exports.sendEvent = function(server, time, uuid, category, action, label) {
  var data = {
    measurement: 'event',
    time: time,
    tags: {
      "event.category": category,
      "event.action": action
    },
    fields: {
      "user.uuid": uuid,
      "event.value": {
        type: "int",
        value: 1
      }
    }
  };
  if (label) {
    data.tags["event.label"] = label;
  }
  send(server, data, true);
};

exports.send = send;

function send(server, data, setTag) {
  var line = '';
  if (setTag) {
    var line = json2line.convert(data, [json2line.SET_DATE_AS_TAG, json2line.SET_HOUR_AS_TAG]);
  } else {
    var line = json2line.convert(data);
  }
  queue.add(function() {
    post(server, line);
  });
};
