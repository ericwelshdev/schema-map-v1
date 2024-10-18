"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSchema = exports.autoDetectSettings = exports.detectFileType = void 0;

var _papaparse = _interopRequireDefault(require("papaparse"));

var _xlsx = require("xlsx");

var _xml2js = _interopRequireDefault(require("xml2js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Detects the file type based on the file extension
var detectFileType = function detectFileType(file) {
  var extension = file.name.split('.').pop().toLowerCase();

  switch (extension) {
    case 'csv':
      return 'csv';

    case 'json':
      return 'json';

    case 'xml':
      return 'xml';

    case 'xlsx':
    case 'xls':
      return 'excel';

    default:
      throw new Error('Unsupported file type');
  }
}; // Auto-detect settings based on file type


exports.detectFileType = detectFileType;

var autoDetectSettings = function autoDetectSettings(file, fileType) {
  return regeneratorRuntime.async(function autoDetectSettings$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = fileType;
          _context.next = _context.t0 === 'csv' ? 3 : _context.t0 === 'json' ? 4 : _context.t0 === 'xml' ? 5 : _context.t0 === 'excel' ? 6 : 7;
          break;

        case 3:
          return _context.abrupt("return", detectCSVSettings(file));

        case 4:
          return _context.abrupt("return", detectJSONSettings(file));

        case 5:
          return _context.abrupt("return", detectXMLSettings(file));

        case 6:
          return _context.abrupt("return", detectExcelSettings(file));

        case 7:
          return _context.abrupt("return", {});

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}; // Detects settings for CSV files


exports.autoDetectSettings = autoDetectSettings;

var detectCSVSettings = function detectCSVSettings(file) {
  return new Promise(function (resolve) {
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
  });
}; // Detects settings for JSON files


var detectJSONSettings = function detectJSONSettings(file) {
  var text, json, isArray;
  return regeneratorRuntime.async(function detectJSONSettings$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(file.text());

        case 2:
          text = _context2.sent;
          json = JSON.parse(text);
          isArray = Array.isArray(json);
          return _context2.abrupt("return", {
            isArray: isArray
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // Detects settings for XML files


var detectXMLSettings = function detectXMLSettings(file) {
  var text, parser, result, rootElement;
  return regeneratorRuntime.async(function detectXMLSettings$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(file.text());

        case 2:
          text = _context3.sent;
          parser = new _xml2js["default"].Parser();
          _context3.next = 6;
          return regeneratorRuntime.awrap(parser.parseStringPromise(text));

        case 6:
          result = _context3.sent;
          rootElement = Object.keys(result)[0];
          return _context3.abrupt("return", {
            rootElement: rootElement
          });

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // Detects settings for Excel files


var detectExcelSettings = function detectExcelSettings(file) {
  var data, workbook, sheetNames;
  return regeneratorRuntime.async(function detectExcelSettings$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(file.arrayBuffer());

        case 2:
          data = _context4.sent;
          workbook = (0, _xlsx.read)(data, {
            type: 'array'
          });
          sheetNames = workbook.SheetNames;
          return _context4.abrupt("return", {
            sheetNames: sheetNames
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // Generate schema based on the file and settings


var generateSchema = function generateSchema(file, settings) {
  var fileType;
  return regeneratorRuntime.async(function generateSchema$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          fileType = detectFileType(file);
          _context5.t0 = fileType;
          _context5.next = _context5.t0 === 'csv' ? 4 : _context5.t0 === 'json' ? 5 : _context5.t0 === 'xml' ? 6 : _context5.t0 === 'excel' ? 7 : 8;
          break;

        case 4:
          return _context5.abrupt("return", generateCSVSchema(file, settings));

        case 5:
          return _context5.abrupt("return", generateJSONSchema(file, settings));

        case 6:
          return _context5.abrupt("return", generateXMLSchema(file, settings));

        case 7:
          return _context5.abrupt("return", generateExcelSchema(file, settings));

        case 8:
          throw new Error('Unsupported file type');

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // Generate schema for CSV files


exports.generateSchema = generateSchema;

var generateCSVSchema = function generateCSVSchema(file, settings) {
  return regeneratorRuntime.async(function generateCSVSchema$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", new Promise(function (resolve, reject) {
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
                  warnings: warnings,
                  rawData: results.data.slice(0, 100).map(function (row) {
                    return row.join(settings.delimiter);
                  }).join('\n')
                });
              },
              error: function error(_error) {
                return reject(_error);
              }
            }));
          }));

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // Generate schema for JSON files


var generateJSONSchema = function generateJSONSchema(file, settings) {
  var text, json, sampleData, schema;
  return regeneratorRuntime.async(function generateJSONSchema$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(file.text());

        case 2:
          text = _context7.sent;
          json = JSON.parse(text);
          sampleData = settings.isArray ? json.slice(0, 10) : [json];
          schema = inferJSONSchema(sampleData[0]);
          return _context7.abrupt("return", {
            schema: schema,
            sampleData: sampleData,
            warnings: [],
            rawData: text.slice(0, 1000)
          });

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
}; // Generate schema for XML files


var generateXMLSchema = function generateXMLSchema(file, settings) {
  var text, parser, result, rootElement, sampleData, schema;
  return regeneratorRuntime.async(function generateXMLSchema$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(file.text());

        case 2:
          text = _context8.sent;
          parser = new _xml2js["default"].Parser();
          _context8.next = 6;
          return regeneratorRuntime.awrap(parser.parseStringPromise(text));

        case 6:
          result = _context8.sent;
          rootElement = settings.rootElement;
          sampleData = result[rootElement].slice(0, 10);
          schema = inferXMLSchema(sampleData[0]);
          return _context8.abrupt("return", {
            schema: schema,
            sampleData: sampleData,
            warnings: [],
            rawData: text.slice(0, 1000)
          });

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  });
}; // Generate schema for Excel files


var generateExcelSchema = function generateExcelSchema(file, settings) {
  var data, workbook, sheetName, worksheet, jsonData, schema, sampleData;
  return regeneratorRuntime.async(function generateExcelSchema$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(file.arrayBuffer());

        case 2:
          data = _context9.sent;
          workbook = XLSX.read(data, {
            type: 'array'
          });
          sheetName = settings.sheetNames[0];
          worksheet = workbook.Sheets[sheetName];
          jsonData = XLSX.utils.sheet_to_json(worksheet);
          schema = inferJSONSchema(jsonData[0]);
          sampleData = jsonData.slice(0, 10);
          return _context9.abrupt("return", {
            schema: schema,
            sampleData: sampleData,
            warnings: [],
            rawData: sampleData.map(function (row) {
              return JSON.stringify(row);
            }).join('\n').slice(0, 1000)
          });

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  });
}; // Infer data type for CSV schema generation


var inferDataType = function inferDataType(values) {
  if (values.every(function (value) {
    return !isNaN(value);
  })) {
    return 'number';
  } else if (values.every(function (value) {
    return new Date(value).toString() !== 'Invalid Date';
  })) {
    return 'date';
  } else {
    return 'string';
  }
}; // Infer schema from JSON objects


var inferJSONSchema = function inferJSONSchema(sample) {
  return Object.keys(sample).map(function (key) {
    return {
      name: key,
      type: inferDataType([sample[key]]),
      comment: ''
    };
  });
}; // Infer schema from XML objects


var inferXMLSchema = function inferXMLSchema(sample) {
  return Object.keys(sample).map(function (key) {
    return {
      name: key,
      type: _typeof(sample[key]) === 'object' ? 'object' : 'string',
      comment: ''
    };
  });
};