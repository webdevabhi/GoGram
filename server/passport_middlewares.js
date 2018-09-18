'use strict';

var environment = requireInternal("config.environment");
var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var userModel = requireInternal("models.user_model");

module.exports = (app) => {
  var jwtOptions = {}
  jwtOptions.secretOrKey = environment.jwtKey;
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

  var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {

    var user = userModel.findOne({ id: jwt_payload.id });
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });

  passport.use(strategy);

  app.use(passport.initialize());

}