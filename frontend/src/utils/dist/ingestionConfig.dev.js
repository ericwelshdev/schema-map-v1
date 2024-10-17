"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ingestionConfig = void 0;

var _csvConfig = require("./ingestionConfigs/csvConfig");

// import { databaseConfig } from './ingestionConfigs/databaseConfig';
// import { apiConfig } from './ingestionConfigs/apiConfig';
var ingestionConfig = {
  file: {
    csv: _csvConfig.csvConfig // Add other file types here

  } // database: databaseConfig,
  // api: apiConfig

};
exports.ingestionConfig = ingestionConfig;