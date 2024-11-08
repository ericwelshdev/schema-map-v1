// frontend\src\utils\ingestionConfigs\excelConfig.js
import * as XLSX from 'xlsx';

const sheetOptions = [
  { label: 'First Sheet', value: 'firstSheet' },
  { label: 'All Sheets', value: 'allSheets' },
  { label: 'Custom', value: 'custom' },
];
  export const excelConfig = {
    header: {
      order: 1,
      default: 1,
      uiField: 'rowHeaderIsRowNumber',
      uiDisplayName: 'Header is in Row Number',
      uiType: 'number',
      callArgField: 'header',
      autoDetect: async (file) => {
        // Implement auto-detection logic
        return 1;
      }
    },

    skipFirstNRows: {
    order: 2,
    default: 0,
    uiField: 'skipFirstNRows',
    uiDisplayName: 'Skip First N Rows',
    uiType: 'number',
    callArgField: 'skipFirstNRows',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return 0;
    }
  },
  previewNRows: {
    order: 3,
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
  sheetSelection: {
    order: 4,
    default: 0,
    uiField: 'sheetSelection',
    uiDisplayName: 'Sheet Selection',
    uiType: 'select',
    options: [], // This will be populated dynamically
    callArgField: 'sheetSelection',
    autoDetect: async (file) => {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      return workbook.SheetNames[0];
    }
  },

  encoding: {
    order: 5,
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
      // Encoding is not a common issue with Excel, return default
      return 'UTF-8';
    }
  },
  includeHeader: {
    order: 6,
    default: true,
    uiField: 'includeHeader',
    uiDisplayName: 'Include Header',
    uiType: 'boolean',
    callArgField: 'includeHeader',
    autoDetect: async (file) => {
      // Implement auto-detection logic
      return true;
    }
  },
  dateParsing: {
    order: 7,
    default: true,
    uiField: 'dateParsing',
    uiDisplayName: 'Auto Parse Dates',
    uiType: 'boolean',
    callArgField: 'dateParsing',
    autoDetect: async (file) => {
      return true;
    }
  }
  // Add more Excel-specific configurations as needed
};

export const getExcelDefaults = () => {
  return Object.entries(excelConfig).reduce((acc, [key, value]) => {
    acc[value.uiField] = value.default;
    return acc;
  }, {});
};

export const detectExcelSettings = async (file) => {
  const detectedSettings = {};
  for (const [key, config] of Object.entries(excelConfig)) {
    if (config.autoDetect) {
      detectedSettings[config.uiField] = await config.autoDetect(file);
    }
  }
  return detectedSettings;
};

// const standardizeExcelArguments = (ingestionSettings, detectedSettings) => {
//   const standardizedArgs = {};
//   const valueSourceDataGroups = {};

//   for (const [key, config] of Object.entries(excelConfig)) {
//     const uiValue = ingestionSettings[config.uiField];
//     const detectedValue = detectedSettings[config.uiField];
//     let finalValue;
//     let sourceDataGroup;

//     if (uiValue !== undefined) {
//       finalValue = uiValue;
//       sourceDataGroup = 'user';
//     } else if (detectedValue !== undefined) {
//       finalValue = detectedValue;
//       sourceDataGroup = 'auto-detect';
//     } else {
//       finalValue = config.default;
//       sourceDataGroup = 'default';
//     }

//     if (config.uiType === 'boolean') {
//       finalValue = finalValue === 'Yes' || finalValue === true;
//     } else if (config.uiType === 'number') {
//       finalValue = parseInt(finalValue, 10);
//     } else if (config.uiType === 'select' && finalValue === 'custom') {
//       finalValue = ingestionSettings[`custom${config.uiField}`];
//     }

//     standardizedArgs[config.callArgField] = finalValue;
//     valueSourceDataGroups[config.uiField] = sourceDataGroup;
//   }

//   return { args: standardizedArgs, sources: valueSourceDataGroups };
// };

// export const readExcel = (file, ingestionSettings, detectedSettings = {}) => {
//   return new Promise((resolve, reject) => {
//     const { args, sources } = standardizeExcelArguments(ingestionSettings, detectedSettings);
//     console.log('Standardized args:', args); // Log the standardized arguments
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });
//       let sheetNames = workbook.SheetNames;

//       let parsedData = [];
//       if (args.sheetSelection === 'allSheets') {
//         sheetNames.forEach(sheet => {
//           parsedData.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
//             header: args.header ? 1 : undefined,
//             raw: !args.dateParsing
//           }));
//         });
//       } else {
//         const selectedSheet = args.sheetSelection === 'firstSheet' ? sheetNames[0] : args.sheetSelection;
//         parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[selectedSheet], {
//           header: args.header ? 1 : undefined,
//           raw: !args.dateParsing
//         });
//       }
//       resolve({ data: parsedData, sources, args });
//     };

//     reader.onerror = (error) => reject(error);
//     reader.readAsArrayBuffer(file);
//   });
// };

// export const getExcelIngestionSummary = (ingestionSettings, detectedSettings) => {
//   const summary = {};
//   for (const [key, config] of Object.entries(excelConfig)) {
//     const uiValue = ingestionSettings[config.uiField];
//     const detectedValue = detectedSettings[config.uiField];
//     const defaultValue = config.default;

//     let finalValue = uiValue !== undefined ? uiValue : (detectedValue !== undefined ? detectedValue : defaultValue);
//     if (config.uiType === 'select' && finalValue === 'custom') {
//       finalValue = ingestionSettings[`custom${config.uiField}`];
//     }

//     summary[config.uiField] = {
//       value: finalValue,
//       sourceDataGroup: uiValue !== undefined ? 'user' : (detectedValue !== undefined ? 'auto-detect' : 'default')
//     };
//   }
//   return summary;
// };

// Existing code...

export const updateExcelConfig = (detectedSettings) => {
  if (detectedSettings.sheetNames) {
    excelConfig.sheetSelection.options = detectedSettings.sheetNames.map(sheet => ({ label: sheet, value: sheet }));
  }
};

// Rest of the existing code...
