"use strict";

const utilityFunc = requireInternal("utility");
const PostComment = requireInternal("models.post_comment_model");

exports.create = create;

// Create a new comment to post.
function create(req, res) {
  var reqData = req.body;
  reqData.user_id = req.userId;
  PostComment.findOne({ post_id: req.body.post_id, user_id: req.userId }).then(function(postCommentRes) {
    if(postCommentRes) {
      return res.status(500).json({ status: false, message: "Already Commented on the post" });
    } else {
      return PostComment.create(reqData).then(utilityFunc.respondWithResult(res, 201)).catch(utilityFunc.handleError(res));
    }
  })
}