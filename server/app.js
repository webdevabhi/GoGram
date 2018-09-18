"use strict";
var environment = requireInternal("config.environment");

// Setup server
var express = require("express");
var app = express();

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
