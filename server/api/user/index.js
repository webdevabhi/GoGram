"use strict";

var express = require("express");
var userController = require("./user.controller");

var router = new express.Router();

router.get("/", userController.index);
router.post("/", userController.create);

module.exports = router;