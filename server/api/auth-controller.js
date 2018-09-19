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
var jwt = require('jsonwebtoken');
var environment = requireInternal("config.environment");

exports.login = login;
exports.register = register;
exports.logout = logout;
exports.verifyToken = verifyToken;

var jwtOptions = {
  secretOrKey: environment.jwtKey
};

// User's Login
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
              var token = createSession(user);
              res.status(200).json({ status: true, message: "Login successful", token: token });
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

// After User's login create a JWT and return the token.
function createSession(user) {
  var payload = {id: user.id};
  var token = jwt.sign(payload, jwtOptions.secretOrKey, {
    expiresIn: '1h' // expires in 24 hours
  });

  return token;
}

// User's Registration function
function register(req, res) {
  return user.create(req.body).then(function(user) {
    var token = createSession(user);
    res.status(200).json({ status: true, message: "Login successful", token: token });
  }).catch(utilityFunc.handleError(res));
}


/* 
 * The logout endpoint is not needed. 
 * The act of logging out can solely be done through the client side.
 * A token is usually kept in a cookie or the browser’s localstorage.
 * Logging out is as simple as destroying the token on the client. 
 * This /logout endpoint is created to logically depict what happens when you log out. 
 * The token gets set to null
 */
function logout(req, res) {
  console.log(req.get('Authorization'));
  res.status(200).json({ status: true, message: "Logged out successfuly" });
}

function verifyToken(req, res, next) {
  var token = req.get('Authorization');

  if (!token)
    return res.status(403).send({ status: false, auth: false, message: 'No token provided.' });

  jwt.verify(token, environment.jwtKey, function(err, decoded) {
    if (err) {
      console.log(err);
      return res.status(500).send({ status: false, auth: false, message: 'Failed to authenticate token.' });
    }
      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      next();
  });
}