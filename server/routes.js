"use strict";

module.exports = function(app) {
  // Insert Routes Below
  app.use("/api/users", require("./api/user"));

  app.route("/*").get(function(req, res) {
    res.send({ status: false });
  });
};
