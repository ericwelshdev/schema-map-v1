"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSchema = exports.autoDetectSettings = exports.detectFileType = void 0;

var _papaparse = _interopRequireDefault(require("papaparse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var detectFileType = function detectFileType(file) {
  var extension = file.name.split('.').pop().toLowerCase();

  switch (extension) {
    case 'csv':
      return 'csv';

    case 'json':
      return 'json';

    case 'xml':
      return 'xml';

    default:
      throw new Error('Unsupported file type');
  }
};

exports.detectFileType = detectFileType;

var autoDetectSettings = function autoDetectSettings(file, fileType) {
  return regeneratorRuntime.async(function autoDetectSettings$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(fileType === 'csv')) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", new Promise(function (resolve) {
            _papaparse["default"].parse(file, {
              preview: 5,
              complete: function complete(results) {
                var delimiter = results.meta.delimiter;
                var hasHeader = results.data[0].every(function (cell) {
                  return isNaN(cell);
                });
                resolve({
                  delimiter: delimiter,
                  hasHeader: hasHeader
                });
              }
            });
          }));

        case 2:
          return _context.abrupt("return", {});

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.autoDetectSettings = autoDetectSettings;

var generateSchema = function generateSchema(file, settings) {
  return regeneratorRuntime.async(function generateSchema$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            _papaparse["default"].parse(file, _objectSpread({}, settings, {
              complete: function complete(results) {
                var schema = results.meta.fields.map(function (field, index) {
                  return {
                    name: field,
                    type: inferDataType(results.data.slice(1, 6).map(function (row) {
                      return row[index];
                    })),
                    comment: ''
                  };
                });
                var sampleData = results.data.slice(1, 11);
                var warnings = [];

                if (results.errors.length > 0) {
                  warnings.push('Some rows could not be parsed correctly');
                }

                if (results.data.length > 1000000) {
                  warnings.push('Large file detected. Only a sample of the data was processed.');
                }

                resolve({
                  schema: schema,
                  sampleData: sampleData,
                  warnings: warnings
                });
              },
              error: function error(_error) {
                return reject(_error);
              }
            }));
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.generateSchema = generateSchema;

var inferDataType = function inferDataType(values) {
  if (values.every(function (v) {
    return !isNaN(v);
  })) return 'number';
  if (values.every(function (v) {
    return !isNaN(Date.parse(v));
  })) return 'date';
  return 'string';
};