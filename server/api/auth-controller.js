/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users              ->  index
 * POST    /api/users              ->  create
 * GET     /api/users/:id          ->  show
 * PUT     /api/users/:id          ->  upsert
 * PATCH   /api/users/:id          ->  patch
 * DELETE  /api/users/:id          ->  destroy
 */

"use strict";

var utilityFunc = requireInternal("utility");
var user = requireInternal("models.user_model");
var userSession = requireInternal("models.user_session");

var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

exports.login = login;
exports.register = register;

var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'eejrd'
};

function login(req, res) {
  var email = "";
  var password = "";
  if (req.body && req.body.email) email = req.body.email;
  if (req.body && req.body.password) password = req.body.password;
  if (email.length < 1) {
    res.status(401).json({ status: false, message: "Email is required" });
  } else if (password.length < 1) {
    res.status(401).json({ status: false, message: "Password is required" });
  } else {
    user.findOne({ email: email }).exec(function(err, user) {
      console.log(user);
      if(err) {
        res.status(500).json({ status: false, message: "Database error occurred" });
      } else {
        if(user) {
          // res.send({ status: true, user: user});
          user.comparePassword(password, function (err, isMatch) {
            if (isMatch) {
              // From now on we'll identify the user by the id and the id is the only 
              // personalized value that goes into our token
              var payload = {id: user.id};
              var token = jwt.sign(payload, jwtOptions.secretOrKey);
              var session = new userSession();
              session.token = token;
              session.user = user.id;
              session.save();

              res.status(200).json({ status: true, message: "login successful", token: token });
            } else {
              res.status(401).json({ status: false, message: "Password did not match" });
            }
          });
        } else {
          res.status(401).json({ status: false, message: "No such user found" });
        }
      }
    })
  }
}

// User's Registration function
function register(req, res) {
  return user.create(req.body).then(function(user) {
    req.body = {
      'email': user.email,
      'password':req.body.password,
    };
    // Login with the registered Credentials.
    login(req, res);
  }).catch(utilityFunc.handleError(res));
}