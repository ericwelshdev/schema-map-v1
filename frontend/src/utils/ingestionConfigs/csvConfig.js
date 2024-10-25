// frontend\src\utils\ingestionConfigs\csvConfig.js
import Papa from 'papaparse';

const commonColumnDelimiters = [
  { label: 'Comma ( , )', value: ',' },
  { label: 'Semicolon ( ; )', value: ';' },
  { label: 'Tab ( \\t )', value: '\t' },
  { label: 'Pipe ( | )', value: '|' },
  { label: 'Custom', value: 'custom' },
];
const commonRowDelimiters = [
  { label: 'Unix Newline ( \\n )', value: '\n' }, // Used in Unix/Linux systems
  { label: 'Windows Newline ( \\r\\n )', value: '\r\n' }, // Used in Windows systems
  { label: 'Mac Classic Newline ( \\r )', value: '\r' }, // Used in old Mac systems
  { label: 'Custom', value: 'custom' },
];

const quoteCharOptions = [
  { label: 'Double Quote ( " )', value: '"' },
  { label: 'Single Quote ( \' )', value: '\'' },
  { label: 'Custom', value: 'custom' },
];

export const csvConfig = {

  skipFirstNLines: {
    order: 1,
    default: 0,
    uiField: 'skipFirstNLines',
    uiDisplayName: 'Skip First N Lines',
    uiType: 'number',
    callArgField: 'skipFirstNLines',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return 0;
    }
  },
    previewNRows: {
      order: 2,
      default: 100,
      uiField: 'previewNRows',
      uiDisplayName: 'Preview N Rows',
      uiType: 'number',
      callArgField: 'preview',
      autoDetect: async (file) => {
        // Implement auto-detection logic
        return 100;
      }
    },
  delimiter: {
    order: 3,
    default: ',',
    uiField: 'columnDelimiter',
    uiDisplayName: 'Column Delimiter',
    uiType: 'select',
    options: commonColumnDelimiters,
    callArgField: 'delimiter',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return ',';
    }
  },
  newline: {
    order: 4,
    default: '\n',
    uiField: 'rowDelimiter',
    uiDisplayName: 'Row Delimiter',
    uiType: 'select',
    options: commonRowDelimiters,
    callArgField: 'newline',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return '\r\n';
    }
  },
  quoteChar: {
    order: 5,
    default: '"',
    uiField: 'quoteChar',
    uiDisplayName: 'Quote Character',
    uiType: 'select',
    options: quoteCharOptions,
    callArgField: 'quoteChar',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return '"';
    }
  },
  escapeChar: {
    order: 6,
    default: '"',
    uiField: 'escapeChar',
    uiDisplayName: 'Escape Character',
    uiType: 'select',
    options: quoteCharOptions,
    callArgField: 'escapeChar',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return '"';
    }
  },
  commentChar: {
    order: 7,
    default: '',
    uiField: 'commentChar',
    uiDisplayName: 'Comment Character',
    uiType: 'text',
    callArgField: 'comment',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return '';
    }
  },
  encoding: {
    order: 8,
    default: 'UTF-8',
    uiField: 'encoding',
    uiDisplayName: 'Encoding',
    uiType: 'select',
    options: [
      { label: 'UTF-8', value: 'UTF-8' },
      { label: 'ISO-8859-1', value: 'ISO-8859-1' },
      { label: 'ASCII', value: 'ASCII' },
    ],
    callArgField: 'encoding',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return 'UTF-8';
    }
  },
  header: {
    order: 9,
    default: true,
    uiField: 'includeHeader',
    uiDisplayName: 'Include Header',
    uiType: 'boolean',
    callArgField: 'header',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return true;
    }
  },
  dynamicTyping: {
    order: 10,
    default: false,
    uiField: 'dynamicTyping',
    uiDisplayName: 'Dynamic Typing',
    uiType: 'boolean',
    callArgField: 'dynamicTyping',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return false;
    }
  },
  skipEmptyLines: {
    order: 11,
    default: false,
    uiField: 'skipEmptyLines',
    uiDisplayName: 'Skip Empty Lines',
    uiType: 'boolean',
    callArgField: 'skipEmptyLines',
    autoDetect: async (file) => {
      // Implement auto-detection logic
     return true;
    }
  },

  fastMode: {
    order: 12,
    default: false,
    uiField: 'fastMode',
    uiDisplayName: 'Fast Mode',
    uiType: 'boolean',
    callArgField: 'fastMode',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return false;
    }
  },
  fullMode: {
    order: 13,
    default: true,
    uiField: 'fastMode',
    uiDisplayName: 'Full Data Mode',
    uiType: 'boolean',
    callArgField: 'fullMode',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return true;
    }
  },  
  
//  delimtersToGuess: {
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

export const getCSVDefaults = () => {
  return Object.entries(csvConfig).reduce((acc, [key, value]) => {
    acc[value.uiField] = value.default;
    return acc;
  }, {});
};

export const detectCSVSettings = async (file) => {
  const detectedSettings = {};
  for (const [key, config] of Object.entries(csvConfig)) {
    if (config.autoDetect) {
      detectedSettings[config.uiField] = await config.autoDetect(file);
    }
  }
  return detectedSettings;
};

const standardizeCSVArguments = (ingestionSettings, detectedSettings) => {
  const standardizedArgs = {};
  const valueSourceDataGroups = {};

  for (const [key, config] of Object.entries(csvConfig)) {
    const uiValue = ingestionSettings[config.uiField];
    const detectedValue = detectedSettings[config.uiField];
    let finalValue;
    let sourceDataGroup;

    if (uiValue !== undefined) {
      finalValue = uiValue;
      sourceDataGroup = 'user';
    } else if (detectedValue !== undefined) {
      finalValue = detectedValue;
      sourceDataGroup = 'auto-detect';
    } else {
      finalValue = config.default;
      sourceDataGroup = 'default';
    }

    if (config.uiType === 'boolean') {
      finalValue = finalValue === 'Yes' || finalValue === true;
    } else if (config.uiType === 'number') {
      finalValue = parseInt(finalValue, 10);
    } else if (config.uiType === 'select' && finalValue === 'custom') {
      finalValue = ingestionSettings[`custom${config.uiField}`];
    }

    standardizedArgs[config.callArgField] = finalValue;
    valueSourceDataGroups[config.uiField] = sourceDataGroup;
  }

  return { args: standardizedArgs, sources: valueSourceDataGroups };
};



export const readCSV = (file, ingestionSettings, detectedSettings = {}) => {
  return new Promise((resolve, reject) => {
    const { args, sources } = standardizeCSVArguments(ingestionSettings, detectedSettings);
    console.log('Standardized args:', args);  // Log the standardized arguments
    Papa.parse(file, {
      complete: (results) => {
        const data = Array.isArray(results.data) ? results.data : [];
        resolve({ data, sources, args });
      },
      error: (error) => reject(error),
      ...args
    });
  });
};





export const getCSVIngestionSummary = (ingestionSettings, detectedSettings) => {
  const summary = {};
  for (const [key, config] of Object.entries(csvConfig)) {
    const uiValue = ingestionSettings[config.uiField];
    const detectedValue = detectedSettings[config.uiField];
    const defaultValue = config.default;

    let finalValue = uiValue !== undefined ? uiValue : (detectedValue !== undefined ? detectedValue : defaultValue);
    if (config.uiType === 'select' && finalValue === 'custom') {
      finalValue = ingestionSettings[`custom${config.uiField}`];
    }

    summary[config.uiField] = {
      value: finalValue,
      sourceDataGroup: uiValue !== undefined ? 'user' : (detectedValue !== undefined ? 'auto-detect' : 'default')
    };
  }
  return summary;
};


// Existing code...

export const updateCSVConfig = (detectedSettings) => {
  // For now, this function doesn't need to do anything specific
  // It's included for consistency and potential future use
};

// Rest of the existing code...
