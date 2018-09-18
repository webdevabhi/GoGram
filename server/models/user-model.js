'use strict';

var mongoose = require('mongoose'),
    bcrypt = require("bcrypt");

var UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: Number, minlength: 10, maxlength: 10 },
  password: { type: String, required: true },
  salt: String,
  role: { type: String, default: 'user' },
  provider: { type: String, default: "local" },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

// Generation password salts and hashes
UserSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);