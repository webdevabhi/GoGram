"use strict";

var express = require("express");

var router = new express.Router();

router.get("/", function(req, res) {
  res.send({status: 'ok', router: 'User/index'});
});

module.exports = router;