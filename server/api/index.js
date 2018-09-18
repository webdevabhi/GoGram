"use strict";

var express = require("express");
var userController = requireInternal("api.user-controller");
var authController = requireInternal("api.auth-controller");

var router = new express.Router();

// User's Auth Api Routes
router.post("/register", authController.register);

// User Api Routes
router.get("/users", userController.index);

module.exports = router;