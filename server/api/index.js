"use strict";

var express = require("express");
var userController = requireInternal("api.user-controller");
var authController = requireInternal("api.auth-controller");
var passport = require("passport");

var router = new express.Router();

// User's Auth Api Routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// User Api Routes
router.get("/users", passport.authenticate('jwt', { session: false }), userController.index);

module.exports = router;