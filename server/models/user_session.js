'use strict';

var mongoose = require('mongoose');

// Define our user-session schema
var UserSessionSchema   = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: Boolean },
  created_on: { type: Date },
  expires_on: { type: Date }
});

// Saving time of session creation
UserSessionSchema.pre('save', function (next) {
  var user = this;
  if (this.isNew) {
    user.status = true;
    user.created_on = new Date();
    return next();
  } else {
    return next();
  }
});

// Export the Mongoose model
module.exports = mongoose.model('UserSession', UserSessionSchema);