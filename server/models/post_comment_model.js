'use strict';

var mongoose = require('mongoose');

var PostCommentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Export the Mongoose model
module.exports = mongoose.model('PostComment', PostCommentSchema);