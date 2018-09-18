"use strict";

var express = require("express");
var userController = requireInternal("api.user-controller");

var router = new express.Router();

// User Api Routes
router.get("/users", userController.index);
router.post("/user/sign-up", userController.create);

module.exports = router;