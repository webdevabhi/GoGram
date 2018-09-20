"use strict";

var utilityFunc = requireInternal("utility");
var post = requireInternal("models.post_model");
var publicIp = require('public-ip');

exports.index = index;
exports.create = create;
exports.deletePost = deletePost;

/* 
 * Gets a list of Posts 
 * Inital get 25 data.
 * get limit in query after scrolling client side page.
 */
function index(req, res) {
  var limit = 25;
  if(req.query.limit) limit = parseInt(req.query.limit);
  publicIp.v4().then(ip => {
    return post
    .find({post_network_ip: ip}, { post_desc: 1, user_id: 1, post_image: 1 }).sort({ _id: -1 }).limit(limit)
    .exec().then(utilityFunc.respondWithResult(res)).catch(utilityFunc.handleError(res));
  }, err => {
    return res.status(500).json({ status: false, message: "Unable to detect ip." })
  });
}

// Create a new post.
function create(req, res) {
  publicIp.v4().then(ip => {
    var reqData = req.body;
    reqData.user_id = req.userId;
    reqData.post_image = 'http://' + req.headers.host + '/uploads/images/' + req.file.filename;
    reqData.post_network_ip = ip;

    return post.create(reqData).then(utilityFunc.respondWithResult(res, 201)).catch(utilityFunc.handleError(res));
  }, err => {
    return res.status(500).json({ status: false, message: "Unable to detect ip." })
  });
}

function deletePost(req, res){
  post.remove({user_id: req.userId, _id: req.body.post_id}).then(function(response) {
    if(response) return res.status(200).json({ status:true, message: "Post deleted successfully" })
  }).catch(utilityFunc.handleError(response));
}