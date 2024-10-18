"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExcelIngestionSummary = exports.readExcel = exports.detectExcelSettings = exports.getExcelDefaults = exports.excelConfig = void 0;

var XLSX = _interopRequireWildcard(require("xlsx"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var sheetOptions = [{
  label: 'First Sheet',
  value: 'firstSheet'
}, {
  label: 'All Sheets',
  value: 'allSheets'
}, {
  label: 'Custom',
  value: 'custom'
}];
var excelConfig = {
  sheetSelection: {
    order: 1,
    "default": 'firstSheet',
    uiField: 'sheetSelection',
    uiDisplayName: 'Sheet Selection',
    uiType: 'select',
    options: sheetOptions,
    callArgField: 'sheetSelection',
    autoDetect: function autoDetect(file) {
      var workbook;
      return regeneratorRuntime.async(function autoDetect$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = XLSX;
              _context.next = 3;
              return regeneratorRuntime.awrap(file.arrayBuffer());

            case 3:
              _context.t1 = _context.sent;
              _context.t2 = {
                type: 'array'
              };
              workbook = _context.t0.read.call(_context.t0, _context.t1, _context.t2);
              return _context.abrupt("return", workbook.SheetNames.length > 1 ? 'firstSheet' : workbook.SheetNames[0]);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  },
  skipFirstNRows: {
    order: 2,
    "default": 0,
    uiField: 'skipFirstNRows',
    uiDisplayName: 'Skip First N Rows',
    uiType: 'number',
    callArgField: 'skipFirstNRows',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", 0);

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  },
  previewNRows: {
    order: 3,
    "default": 100,
    uiField: 'previewNRows',
    uiDisplayName: 'Preview N Rows',
    uiType: 'number',
    callArgField: 'preview',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", 100);

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  },
  header: {
    order: 4,
    "default": true,
    uiField: 'includeHeader',
    uiDisplayName: 'Include Header',
    uiType: 'boolean',
    callArgField: 'header',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", true);

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  },
  encoding: {
    order: 5,
    "default": 'UTF-8',
    uiField: 'encoding',
    uiDisplayName: 'Encoding',
    uiType: 'select',
    options: [{
      label: 'UTF-8',
      value: 'UTF-8'
    }, {
      label: 'ISO-8859-1',
      value: 'ISO-8859-1'
    }, {
      label: 'ASCII',
      value: 'ASCII'
    }],
    callArgField: 'encoding',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", 'UTF-8');

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  },
  dynamicTyping: {
    order: 6,
    "default": false,
    uiField: 'dynamicTyping',
    uiDisplayName: 'Dynamic Typing',
    uiType: 'boolean',
    callArgField: 'dynamicTyping',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              return _context6.abrupt("return", false);

            case 1:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  },
  dateParsing: {
    order: 7,
    "default": true,
    uiField: 'dateParsing',
    uiDisplayName: 'Auto Parse Dates',
    uiType: 'boolean',
    callArgField: 'dateParsing',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              return _context7.abrupt("return", true);

            case 1:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
  } // Add more Excel-specific configurations as needed

};
exports.excelConfig = excelConfig;

var getExcelDefaults = function getExcelDefaults() {
  return Object.entries(excelConfig).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    acc[value.uiField] = value["default"];
    return acc;
  }, {});
};

exports.getExcelDefaults = getExcelDefaults;

var detectExcelSettings = function detectExcelSettings(file) {
  var detectedSettings, _i2, _Object$entries, _Object$entries$_i, key, config;

  return regeneratorRuntime.async(function detectExcelSettings$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          detectedSettings = {};
          _i2 = 0, _Object$entries = Object.entries(excelConfig);

        case 2:
          if (!(_i2 < _Object$entries.length)) {
            _context8.next = 11;
            break;
          }

          _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2), key = _Object$entries$_i[0], config = _Object$entries$_i[1];

          if (!config.autoDetect) {
            _context8.next = 8;
            break;
          }

          _context8.next = 7;
          return regeneratorRuntime.awrap(config.autoDetect(file));

        case 7:
          detectedSettings[config.uiField] = _context8.sent;

        case 8:
          _i2++;
          _context8.next = 2;
          break;

        case 11:
          return _context8.abrupt("return", detectedSettings);

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  });
};

exports.detectExcelSettings = detectExcelSettings;

var standardizeExcelArguments = function standardizeExcelArguments(ingestionSettings, detectedSettings) {
  var standardizedArgs = {};
  var valueSourceDataGroups = {};

  for (var _i3 = 0, _Object$entries2 = Object.entries(excelConfig); _i3 < _Object$entries2.length; _i3++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2),
        key = _Object$entries2$_i[0],
        config = _Object$entries2$_i[1];

    var uiValue = ingestionSettings[config.uiField];
    var detectedValue = detectedSettings[config.uiField];
    var finalValue = void 0;
    var sourceDataGroup = void 0;

    if (uiValue !== undefined) {
      finalValue = uiValue;
      sourceDataGroup = 'user';
    } else if (detectedValue !== undefined) {
      finalValue = detectedValue;
      sourceDataGroup = 'auto-detect';
    } else {
      finalValue = config["default"];
      sourceDataGroup = 'default';
    }

    if (config.uiType === 'boolean') {
      finalValue = finalValue === 'Yes' || finalValue === true;
    } else if (config.uiType === 'number') {
      finalValue = parseInt(finalValue, 10);
    } else if (config.uiType === 'select' && finalValue === 'custom') {
      finalValue = ingestionSettings["custom".concat(config.uiField)];
    }

    standardizedArgs[config.callArgField] = finalValue;
    valueSourceDataGroups[config.uiField] = sourceDataGroup;
  }

  return {
    args: standardizedArgs,
    sources: valueSourceDataGroups
  };
};

var readExcel = function readExcel(file, ingestionSettings) {
  var detectedSettings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise(function (resolve, reject) {
    var _standardizeExcelArgu = standardizeExcelArguments(ingestionSettings, detectedSettings),
        args = _standardizeExcelArgu.args,
        sources = _standardizeExcelArgu.sources;

    console.log('Standardized args:', args); // Log the standardized arguments

    var reader = new FileReader();

    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {
        type: 'array'
      });
      var sheetNames = workbook.SheetNames;
      var parsedData = [];

      if (args.sheetSelection === 'allSheets') {
        sheetNames.forEach(function (sheet) {
          parsedData.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            header: args.header ? 1 : undefined,
            raw: !args.dateParsing
          }));
        });
      } else {
        var selectedSheet = args.sheetSelection === 'firstSheet' ? sheetNames[0] : args.sheetSelection;
        parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[selectedSheet], {
          header: args.header ? 1 : undefined,
          raw: !args.dateParsing
        });
      }

      resolve({
        data: parsedData,
        sources: sources,
        args: args
      });
    };

    reader.onerror = function (error) {
      return reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

exports.readExcel = readExcel;

var getExcelIngestionSummary = function getExcelIngestionSummary(ingestionSettings, detectedSettings) {
  var summary = {};

  for (var _i4 = 0, _Object$entries3 = Object.entries(excelConfig); _i4 < _Object$entries3.length; _i4++) {
    var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i4], 2),
        key = _Object$entries3$_i[0],
        config = _Object$entries3$_i[1];

    var uiValue = ingestionSettings[config.uiField];
    var detectedValue = detectedSettings[config.uiField];
    var defaultValue = config["default"];
    var finalValue = uiValue !== undefined ? uiValue : detectedValue !== undefined ? detectedValue : defaultValue;

    if (config.uiType === 'select' && finalValue === 'custom') {
      finalValue = ingestionSettings["custom".concat(config.uiField)];
    }

    summary[config.uiField] = {
      value: finalValue,
      sourceDataGroup: uiValue !== undefined ? 'user' : detectedValue !== undefined ? 'auto-detect' : 'default'
    };
  }

  return summary;
};

exports.getExcelIngestionSummary = getExcelIngestionSummary;