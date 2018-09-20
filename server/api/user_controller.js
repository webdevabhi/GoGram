"use strict";

const utilityFunc = requireInternal("utility");
const user = requireInternal("models.user_model");
var mongoose = require('mongoose');

exports.index = index;
exports.me = me;
exports.update = update;
exports.report = report;

// Gets a list of Users
function index(req, res) {
  return user
    .find({}, { full_name: 1, mobile: 1, email: 1 }).sort({ _id: -1 })
    .exec().then(utilityFunc.respondWithResult(res)).catch(utilityFunc.handleError(res));
}

// Gets User's Profile
function me(req, res) {
  return user
    .findById(req.userId, { full_name: 1, email: 1, mobile: 1, profile_pic: 1 })
    .exec().then(utilityFunc.respondWithResult(res)).catch(utilityFunc.handleError(res));
}

// Update user's field.
function update(req, res) {
  var reqData = req.body;
  reqData.update_at = new Date;
  if(req.file) 
    reqData.profile_pic = 'http://' + req.headers.host + '/uploads/images/' + req.file.filename;
  return user.findById(req.userId).exec()
    .then(utilityFunc.saveUpdates(reqData))
    .then(function(updatedUser){
      res.status(200).json({ status: true, message: "User updated successfully" })
    }).catch(utilityFunc.handleError(res));
}

// Get Daily report of user.
function report(req, res) {
  user.aggregate([ 
    { 
      $match: { _id: mongoose.Types.ObjectId(req.userId) } },
      { $lookup:{ from:"posts", localField:"_id", foreignField:"user_id", as:"posts" } },
      { $lookup:{ from:"postlikes", localField:"_id", foreignField:"user_id", as:"postlikes" } },
      { $lookup:{ from:"postcomments", localField:"_id", foreignField:"user_id", as:"postcomments" } 
    } 
  ])
  .then(function(response){
    var responseData = {
      full_name : response[0].full_name,
      email : response[0].email,
      mobile : response[0].mobile,
      total_post : response[0].posts.length,
      total_comments: response[0].postcomments.length,
      total_likes: response[0].postlikes.length,
    }
    res.status(200).json(responseData);
  }).catch(utilityFunc.handleError(response));
}