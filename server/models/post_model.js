'use strict';

var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  post_image: {type: String, required: true},
  post_desc:  String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }
})

// Export the Mongoose model
module.exports = mongoose.model('Post', PostSchema);