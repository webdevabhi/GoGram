"use strict";

var mongoose = require("mongoose");
var environment = requireInternal("config.environment");

// Connect to MongoDB
mongoose.connect(environment.mongo.uri);
mongoose.connection.on('error', function(err) {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
})

// Setup server
var express = require("express");
var app = express();

require('./express_middlewares')(app);
require("./routes")(app);

// Start Server
function startServer() {
  console.log("Publishing Message");
  app.listen(environment.port, () => {
    console.log("Listening on port " + environment.port);
  });
}

setImmediate(startServer);

exports = module.exports = app;
