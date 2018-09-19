"use strict";

var express = require("express");
var userController = requireInternal("api.user-controller");
var authController = requireInternal("api.auth-controller");
var multer = require('multer');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
});
var upload = multer({storage: storage});

var router = new express.Router();

// User's Auth Api Routes
router.post("/register", upload.single('profile_pic'), authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset/:token", authController.resetPassword);

// User Api Routes
router.get("/users", authController.verifyToken, userController.index);
router.get("/me", authController.verifyToken, userController.me);
router.put("/user/update", authController.verifyToken, upload.single('profile_pic'), userController.update);

module.exports = router;