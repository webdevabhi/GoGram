"use strict";
var appBasePath = __dirname;

global.requireInternal = global.requireInternal || function(modelModuleName) {
  modelModuleName = modelModuleName.split('.');
  if (modelModuleName.lenght > 5) {
    throw new Error("Application has limited to maximum 5 level of nested directory");
  }

  modelModuleName = modelModuleName.join("/");
  return require(appBasePath + "/" + modelModuleName);
}

var env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

// export application;
exports = module.exports = require("./app");