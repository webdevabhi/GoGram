/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/users              ->  index
 * POST    /api/users              ->  create
 * GET     /api/users/:id          ->  show
 * PUT     /api/users/:id          ->  upsert
 * PATCH   /api/users/:id          ->  patch
 * DELETE  /api/users/:id          ->  destroy
 */

"use strict";

const utilityFunc = requireInternal("utility");
const user = requireInternal("models.user_model");

exports.index = index;
exports.me = me;

// Gets a list of Users
function index(req, res) {
  return user
    .find({}, { full_name: 1, mobile: 1, email: 1 }).sort({ _id: -1 })
    .exec().then(utilityFunc.respondWithResult(res)).catch(utilityFunc.handleError(res));
}

function me(req, res) {
  return user
    .findById(req.userId, { full_name: 1, email: 1, mobile: 1, profile_pic: 1 })
    .exec().then(utilityFunc.respondWithResult(res)).catch(utilityFunc.handleError(res));
}