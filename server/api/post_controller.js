"use strict";

const utilityFunc = requireInternal("utility");
const post = requireInternal("models.post_model");

exports.index = index;
exports.create = create;

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