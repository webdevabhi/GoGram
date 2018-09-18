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
var environment = requireInternal("config.environment");

exports.login = login;
exports.register = register;
exports.validateUser = validateUser;

var jwtOptions = {
  secretOrKey: environment.jwtKey
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
      if(err) {
        res.status(500).json({ status: false, message: "Database error occurred" });
      } else {
        if(user) {
          // res.send({ status: true, user: user});
          user.comparePassword(password, function (err, isMatch) {
            if (isMatch) {
              // From now on we'll identify the user by the id and the id is the only 
              // personalized value that goes into our token
              userSession.findOne({ user: user.id, expires_on: { $gt: Date.now() } }).then(function(session) {
                if(session) {
                  res.status(200).json({ status: true, message: "Login successful", token: session.token });
                } else {
                  var token = createSession(user);
                  res.status(200).json({ status: true, message: "Login successful", token: token });
                }
              });
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

function createSession(user) {
  var payload = {id: user.id};
  var token = jwt.sign(payload, jwtOptions.secretOrKey);
  var session = new userSession();
  session.token = token;
  session.user = user.id;
  session.expires_on = Date.now() + 3600000; // 1hour;
  session.save();

  return token;
}

// User's Registration function
function register(req, res) {
  return user.create(req.body).then(function(user) {
    var token = createSession(user);
    res.status(200).json({ status: true, message: "Login successful", token: token });
  }).catch(utilityFunc.handleError(res));
}

function validateUser(req, res, next) {
  console.log(jwtOptions.jwtFromRequest);
  return next();
}