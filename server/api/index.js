"use strict";

var express = require("express");
var userController = requireInternal("api.user-controller");
var authController = requireInternal("api.auth-controller");

var router = new express.Router();

// User's Auth Api Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset/:token", authController.resetPassword);

// User Api Routes
router.get("/users", authController.verifyToken, userController.index);

module.exports = router;