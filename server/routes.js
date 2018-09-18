"use strict";

module.exports = function(app) {
  // Insert Routes Below
  app.use("/api", require("./api"));

  app.route("/*").get(function(req, res) {
    res.send({ status: false });
  });
};
