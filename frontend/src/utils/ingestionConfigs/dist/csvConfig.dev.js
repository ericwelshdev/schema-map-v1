"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCSVIngestionSummary = exports.readCSV = exports.detectCSVSettings = exports.getCSVDefaults = exports.csvConfig = void 0;

var _papaparse = _interopRequireDefault(require("papaparse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var commonColumnDelimiters = [{
  label: 'Comma ( , )',
  value: ','
}, {
  label: 'Semicolon ( ; )',
  value: ';'
}, {
  label: 'Tab ( \\t )',
  value: '\t'
}, {
  label: 'Pipe ( | )',
  value: '|'
}, {
  label: 'Custom',
  value: 'custom'
}];
var commonRowDelimiters = [{
  label: 'Unix Newline ( \\n )',
  value: '\n'
}, // Used in Unix/Linux systems
{
  label: 'Windows Newline ( \\r\\n )',
  value: '\r\n'
}, // Used in Windows systems
{
  label: 'Mac Classic Newline ( \\r )',
  value: '\r'
}, // Used in old Mac systems
{
  label: 'Custom',
  value: 'custom'
}];
var quoteCharOptions = [{
  label: 'Double Quote ( " )',
  value: '"'
}, {
  label: 'Single Quote ( \' )',
  value: '\''
}, {
  label: 'Custom',
  value: 'custom'
}];
var csvConfig = {
  header: {
    order: 1,
    "default": true,
    uiField: 'includeHeader',
    uiDisplayName: 'Include Header',
    uiType: 'boolean',
    callArgField: 'header',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", true);

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  },
  skipFirstNLines: {
    order: 2,
    "default": 0,
    uiField: 'skipFirstNLines',
    uiDisplayName: 'Skip First N Lines',
    uiType: 'number',
    callArgField: 'skipFirstNLines',
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
  delimiter: {
    order: 4,
    "default": ',',
    uiField: 'columnDelimiter',
    uiDisplayName: 'Column Delimiter',
    uiType: 'select',
    options: commonColumnDelimiters,
    callArgField: 'delimiter',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", ',');

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  },
  newline: {
    order: 5,
    "default": '\n',
    uiField: 'rowDelimiter',
    uiDisplayName: 'Row Delimiter',
    uiType: 'select',
    options: commonRowDelimiters,
    callArgField: 'newline',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", '\r\n');

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  },
  quoteChar: {
    order: 6,
    "default": '"',
    uiField: 'quoteChar',
    uiDisplayName: 'Quote Character',
    uiType: 'select',
    options: quoteCharOptions,
    callArgField: 'quoteChar',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              return _context6.abrupt("return", '"');

            case 1:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  },
  escapeChar: {
    order: 7,
    "default": '"',
    uiField: 'escapeChar',
    uiDisplayName: 'Escape Character',
    uiType: 'select',
    options: quoteCharOptions,
    callArgField: 'escapeChar',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              return _context7.abrupt("return", '"');

            case 1:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
  },
  commentChar: {
    order: 8,
    "default": '',
    uiField: 'commentChar',
    uiDisplayName: 'Comment Character',
    uiType: 'text',
    callArgField: 'comment',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              return _context8.abrupt("return", '');

            case 1:
            case "end":
              return _context8.stop();
          }
        }
      });
    }
  },
  dynamicTyping: {
    order: 9,
    "default": false,
    uiField: 'dynamicTyping',
    uiDisplayName: 'Dynamic Typing',
    uiType: 'boolean',
    callArgField: 'dynamicTyping',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              return _context9.abrupt("return", false);

            case 1:
            case "end":
              return _context9.stop();
          }
        }
      });
    }
  },
  skipEmptyLines: {
    order: 10,
    "default": false,
    uiField: 'skipEmptyLines',
    uiDisplayName: 'Skip Empty Lines',
    uiType: 'boolean',
    callArgField: 'skipEmptyLines',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt("return", true);

            case 1:
            case "end":
              return _context10.stop();
          }
        }
      });
    }
  },
  encoding: {
    order: 11,
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
      return regeneratorRuntime.async(function autoDetect$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              return _context11.abrupt("return", 'UTF-8');

            case 1:
            case "end":
              return _context11.stop();
          }
        }
      });
    }
  },
  fastMode: {
    order: 12,
    "default": false,
    uiField: 'fastMode',
    uiDisplayName: 'Fast Mode',
    uiType: 'boolean',
    callArgField: 'fastMode',
    autoDetect: function autoDetect(file) {
      return regeneratorRuntime.async(function autoDetect$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              return _context12.abrupt("return", false);

            case 1:
            case "end":
              return _context12.stop();
          }
        }
      });
    }
  } //  delimtersToGuess: {
  //    order: 13,
  //    default: ['\t', ',', '|', ';'],
  //    uiField: 'delimtersToGuess',
  //    uiDisplayName: 'Delimiters to Guess',
  //    uiType: 'multiSelect',
  //    options: ['\t', ',', '|', ';', ':', ' '],
  //    callArgField: 'delimtersToGuess',
  //    autoDetect: async (file) => {
  //      // Implement auto-detection logic
  //      return ['\t', ',', '|', ';'];
  //    }
  //  }
  // add more CSV-specific configurations as needed

};
exports.csvConfig = csvConfig;

var getCSVDefaults = function getCSVDefaults() {
  return Object.entries(csvConfig).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    acc[value.uiField] = value["default"];
    return acc;
  }, {});
};

exports.getCSVDefaults = getCSVDefaults;

var detectCSVSettings = function detectCSVSettings(file) {
  var detectedSettings, _i2, _Object$entries, _Object$entries$_i, key, config;

  return regeneratorRuntime.async(function detectCSVSettings$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          detectedSettings = {};
          _i2 = 0, _Object$entries = Object.entries(csvConfig);

        case 2:
          if (!(_i2 < _Object$entries.length)) {
            _context13.next = 11;
            break;
          }

          _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2), key = _Object$entries$_i[0], config = _Object$entries$_i[1];

          if (!config.autoDetect) {
            _context13.next = 8;
            break;
          }

          _context13.next = 7;
          return regeneratorRuntime.awrap(config.autoDetect(file));

        case 7:
          detectedSettings[config.uiField] = _context13.sent;

        case 8:
          _i2++;
          _context13.next = 2;
          break;

        case 11:
          return _context13.abrupt("return", detectedSettings);

        case 12:
        case "end":
          return _context13.stop();
      }
    }
  });
};

exports.detectCSVSettings = detectCSVSettings;

var standardizeCSVArguments = function standardizeCSVArguments(ingestionSettings, detectedSettings) {
  var standardizedArgs = {};
  var valueSourceDataGroups = {};

  for (var _i3 = 0, _Object$entries2 = Object.entries(csvConfig); _i3 < _Object$entries2.length; _i3++) {
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

var readCSV = function readCSV(file, ingestionSettings) {
  var detectedSettings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise(function (resolve, reject) {
    var _standardizeCSVArgume = standardizeCSVArguments(ingestionSettings, detectedSettings),
        args = _standardizeCSVArgume.args,
        sources = _standardizeCSVArgume.sources;

    console.log('Standardized args:', args); // Log the standardized arguments

    _papaparse["default"].parse(file, _objectSpread({
      complete: function complete(results) {
        var data = Array.isArray(results.data) ? results.data : [];
        resolve({
          data: data,
          sources: sources,
          args: args
        });
      },
      error: function error(_error) {
        return reject(_error);
      }
    }, args));
  });
};

exports.readCSV = readCSV;

var getCSVIngestionSummary = function getCSVIngestionSummary(ingestionSettings, detectedSettings) {
  var summary = {};

  for (var _i4 = 0, _Object$entries3 = Object.entries(csvConfig); _i4 < _Object$entries3.length; _i4++) {
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

exports.getCSVIngestionSummary = getCSVIngestionSummary;