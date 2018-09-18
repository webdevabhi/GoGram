var express = require('express');
var app = express();

var environment = require("./config/environment");

app.get('/', function(req, res) {
  res.send({status: 'ok'});
})

app.listen(environment.port, () => {
  console.log("Listening on port " + environment.port);
});