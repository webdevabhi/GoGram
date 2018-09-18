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

exports.index = index;
exports.create = create;

// Gets a list of Users
function index(req, res) {
  res.send({status: 'ok', route:'Users/Api/controller'});
}

// Save a user's entry
function create(req, res) {
  console.log(req.body);
  res.send({status: 'ok', data: req.body});
}