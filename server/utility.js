"use strict";

module.exports = {
  interopRequireDefault: function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  },

  respondWithResult: function(res, statusCode, entity) {
    statusCode = statusCode || 200;
    return function(entity) {
      if (entity) {
        res.status(statusCode).json(entity);
      }
    };
  },

  handleError: function(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
      res.status(statusCode).send(err);
    };
  }
};
