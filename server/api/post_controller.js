"use strict";

const utilityFunc = requireInternal("utility");
const post = requireInternal("models.post_model");

exports.index = index;
exports.create = create;
exports.deletePost = deletePost;

// Gets a list of Posts
function index(req, res) {
  return post
    .find({}).sort({ _id: -1 })
    .exec().then(utilityFunc.respondWithResult(res)).catch(utilityFunc.handleError(res));
}

// Create a new post.
function create(req, res) {
  var reqData = req.body;
  reqData.user_id = req.userId;
  reqData.post_image = 'http://' + req.headers.host + '/uploads/images/' + req.file.filename;

  return post.create(reqData).then(utilityFunc.respondWithResult(res, 201)).catch(utilityFunc.handleError(res));
}

function deletePost(req, res){
  post.remove({user_id: req.userId, _id: req.body.post_id}).then(function(response) {
    if(response) return res.status(200).json({status:true, message: "Post deleted successfully"})
  })
}