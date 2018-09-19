"use strict";

var express = require("express");
var userController = requireInternal("api.user_controller");
var authController = requireInternal("api.auth_controller");
var postController = requireInternal("api.post_controller");
var postCommentController = requireInternal("api.post_comment_controller");
var postLikeController = requireInternal("api.post_like_controller");
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
router.get("/me/report", authController.verifyToken, userController.report)

// Post Api Routes
router.get("/posts", authController.verifyToken, postController.index);
router.post("/post/delete", authController.verifyToken, postController.deletePost);
router.post("/post/create", authController.verifyToken, upload.single('post_image'), postController.create);

// Post Comment API Routes
router.post("/post/comment", authController.verifyToken, postCommentController.create);

// Post Comment API Routes
router.post("/post/like", authController.verifyToken, postLikeController.create);

module.exports = router;