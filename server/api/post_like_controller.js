"use strict";

const utilityFunc = requireInternal("utility");
const PostLike = requireInternal("models.post_like_model");

exports.create = create;

// Create a new comment to post.
function create(req, res) {
  var reqData = req.body;
  reqData.user_id = req.userId;
  PostLike.findOne({ post_id: req.body.post_id, user_id: req.userId }).then(function(postLikeRes) {
    if(!postLikeRes) {
      return PostLike.create(reqData).then(function(likedResponse){
        return res.status(200).json({ status: true, message: "Post Like successfully" });
      }).catch(utilityFunc.handleError(res));
    } else {
      return res.status(200).json({ status: true, message: "Post Like successfully" });
    }
  }).catch(utilityFunc.handleError(postLikeRes));
}