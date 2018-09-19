"use strict";

var path = require('path');

module.exports = function(app) {
  // Insert Routes Below
  app.use("/api", require("./api"));

  // Access Uploaded Images.
  app.get("/uploads/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./uploads/" + req.params[0]));
  });

  app.route("/*").get(function(req, res) {
    res.send({ status: false });
  });
};
