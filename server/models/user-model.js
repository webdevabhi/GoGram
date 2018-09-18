'use strict';

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  full_name: { type: String },
  email: { type: String, unique: true },
  mobile: { type: Number, min: 10, max: 10 },
  password: String,
  salt: String,
  role: { type: String, default: 'user' },
  provider: { type: String, default: "local" },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);