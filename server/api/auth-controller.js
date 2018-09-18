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
const user = requireInternal("models.user-model");

exports.register = register;

// User's Registration function
function register(req, res) {
  return user.create(req.body).then(
    utilityFunc.respondWithResult(res, 201)
  ).catch(utilityFunc.handleError(res));
}