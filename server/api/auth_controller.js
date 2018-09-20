"use strict";

var utilityFunc = requireInternal("utility");
var user = requireInternal("models.user_model");
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var environment = requireInternal("config.environment");

exports.login = login;
exports.register = register;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
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

// User's Registration function
function register(req, res) {
  var reqData = req.body;
  reqData.profile_pic = 'http://' + req.headers.host + '/uploads/images/' + req.file.filename;
  return user.create(reqData).then(function(user) {
    var token = createSession(user);
    res.status(201).json({ status: true, message: "Registration successful", token: token });
  }).catch(utilityFunc.handleError(user));
}

// After User's login create a JWT and return the token.
function createSession(user) {
  var payload = {id: user.id};
  var token = jwt.sign(payload, jwtOptions.secretOrKey, {
    expiresIn: '1h' // expires in 24 hours
  });

  return token;
}

/* 
 * Sends link to reset password with reset password token
 * Expiry of token is set to 1 hour
 */
function forgotPassword(req, res) {
  var email = "";
  if(req.body.email) email = req.body.email;
  if(email.length < 1) {
    return res.status(400).json({ status: false, message: "Email is required" });
  }

  user.findOne({email: email}).then(function(user) {
    if (!user) {
      return res.status(200).json({ status: false, message: "No account with that email address exists." });
    }

    crypto.randomBytes(20, function(err, buf) {
      var passwordToken = buf.toString('hex');
      user.resetPasswordToken = passwordToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      user.save(function(err, success) {
        return res.status(200).json({ 
          status: true, 
          link: 'http://' + req.headers.host + '/api/reset/' + passwordToken,
          message: 'Open Link to reset your password'
        })
      });
    });
  }).catch(utilityFunc.handleError(user));
}

/* 
 * Reset Password by checking resetPasswordToken and token expiration time from db
 * and allow user to save encrypted password and return to log in.
 */
function resetPassword(req, res) {
  var password = "";
  if(req.body.password) password = req.body.password;
  if(password.length < 1) {
    return res.status(400).json({ status: false, message: "Password is required" });
  }

  user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
  .then(function(user) {
    if (!user) {
      return res.status(400).json({ status:false, message: "Password reset token is invalid or has expired" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.save(function(err) {
      return res.status(200).json({status: true, message: "Password reset successfully, Please login to continue" });
    });
  })
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
  res.status(200).json({ status: true, message: "Logged out successfully" });
}

/* 
 * Get the token from request header Authorization.
 * Validate using JWT and get the userid from the token
 * if err, return with 403, Unauthorized
 * if success, next().
 */
function verifyToken(req, res, next) {
  var token = req.get('Authorization');

  if (!token)
    return res.status(403).send({ status: false, auth: false, message: 'No token provided.' });

  jwt.verify(token, environment.jwtKey, function(err, decoded) {
    if (err) 
      return res.status(403).send({ status: false, auth: false, message: 'Failed to authenticate token.' });

      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      next();
  });
}