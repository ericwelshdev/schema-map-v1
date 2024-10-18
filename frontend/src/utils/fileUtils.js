import Papa from 'papaparse';
import { parse } from 'fast-xml-parser';  // Use fast-xml-parser for XML parsing
import * as XLSX from 'xlsx';

// Detects the file type based on the file extension
export const detectFileType = (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
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
};

// Auto-detect settings based on file type
export const autoDetectSettings = async (file, fileType) => {
  switch (fileType) {
    case 'csv':
      return detectCSVSettings(file);
    case 'json':
      return detectJSONSettings(file);
    case 'xml':
      return detectXMLSettings(file);
    case 'excel':
      return detectExcelSettings(file);
    default:
      return {};
  }
};

// Detects settings for CSV files
const detectCSVSettings = (file) => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      preview: 5,
      complete: (results) => {
        const delimiter = results.meta.delimiter;
        const hasHeader = results.data[0].every(cell => isNaN(cell));
        resolve({ delimiter, hasHeader });
      }
    });
  });
};

// Detects settings for JSON files
const detectJSONSettings = async (file) => {
  const text = await file.text();
  const json = JSON.parse(text);
  const isArray = Array.isArray(json);
  return { isArray };
};

// Detects settings for XML files
const detectXMLSettings = async (file) => {
  const text = await file.text();
  const result = parse(text);  // Use fast-xml-parser to parse XML
  const rootElement = Object.keys(result)[0];  // Get the root element
  return { rootElement };
};

// Detects settings for Excel files
export const detectExcelSettings = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetNames = workbook.SheetNames;
  return { sheetNames, defaultSheet: sheetNames[0] };
};

// Generate schema based on the file and settings
export const generateSchema = async (file, settings) => {
  const fileType = detectFileType(file);
  switch (fileType) {
    case 'csv':
      return generateCSVSchema(file, settings);
    case 'json':
      return generateJSONSchema(file, settings);
    case 'xml':
      return generateXMLSchema(file, settings);
    case 'excel':
      return generateExcelSchema(file, settings);
    default:
      throw new Error('Unsupported file type');
  }
};

// Generate schema for CSV files

const generateCSVSchema = async (file, settings) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      ...settings,
      complete: (results) => {
        const schema = results.meta.fields.map((field, index) => {
          const columnValues = results.data.map(row => row[field]).filter(value => value !== undefined && value !== null);
          return {
            name: field,
            type: inferDataType(columnValues),
            comment: ''
          };
        });
        const sampleData = results.data.slice(0, 10);
        const warnings = [];
        if (results.errors.length > 0) {
          warnings.push('Some rows could not be parsed correctly -> ',results.errors);
        }
        if (results.data.length > 1000000) {
          warnings.push('Large file detected. Only a sample of the data was processed.');
        }
        const rawData = results.data.slice(0, 100).map(row => 
          Object.values(row).join(settings.delimiter)
        ).join('\n');
        resolve({ schema, sampleData, warnings, rawData });
      },
      error: (error) => reject(error)
    });
  });
};




// Generate schema for JSON files
const generateJSONSchema = async (file, settings) => {
  const text = await file.text();
  const json = JSON.parse(text);
  const sampleData = settings.isArray ? json.slice(0, 10) : [json];
  const schema = inferJSONSchema(sampleData[0]);
  return { schema, sampleData, warnings: [], rawData: text.slice(0, 1000) };
};

// Generate schema for XML files
const generateXMLSchema = async (file, settings) => {
  const text = await file.text();
  const result = parse(text);  // Parse XML using fast-xml-parser
  const rootElement = settings.rootElement;
  const sampleData = result[rootElement].slice(0, 10);
  const schema = inferXMLSchema(sampleData[0]);
  return { schema, sampleData, warnings: [], rawData: text.slice(0, 1000) };
};

// Generate schema for Excel files
export const generateExcelSchema = async (file, settings) => {
  const data = await file.arrayBuffer();
  console.log('Standardized args:', settings);
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = settings.sheetSelection === 'firstSheet' ? workbook.SheetNames[0] : settings.sheetSelection;
  const worksheet = workbook.Sheets[sheetName];
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: settings.header ? 1 : undefined,
    range: settings.skipFirstNRows,
    blankrows: !settings.skipEmptyLines,
    raw: !settings.dateParsing,
    defval: null  // Use null for empty cells instead of empty string
  });

  const headerRow = settings.includeHeader ? jsonData[0] : jsonData[0].map((_, index) => `Column${index + 1}`);
  const dataRows = settings.includeHeader ? jsonData.slice(1) : jsonData;

  const schema = headerRow.map((header, index) => ({
    name: header,
    type: inferDataType(dataRows.slice(0, 5).map(row => row[index])),
    comment: ''
  }));

  const sampleData = dataRows.slice(0, settings.previewNRows).map(row => 
    headerRow.reduce((acc, header, index) => {
      acc[header] = row[index] !== undefined ? row[index] : null;
      return acc;
    }, {})
  );

  const warnings = [];
  if (jsonData.length > 1000000) {
    warnings.push('Large file detected. Only a sample of the data was processed.');
  }

  const rawData = XLSX.utils.sheet_to_csv(worksheet, { FS: '\t', RS: '\n' }).slice(0, 1000);

  return { schema, sampleData, warnings, rawData };
};

// Infer schema from JSON objects
const inferJSONSchema = (sample) => {
  return Object.keys(sample).map(key => ({
    name: key,
    type: inferDataType([sample[key]]),
    comment: ''
  }));
};

// infer data type
const inferDataType = (values) => {
  const nonNullValues = values.filter(v => v != null && v.toString().trim() !== '');
  if (nonNullValues.length === 0) return 'string'; // default to 'string' if all values are null or empty

  const types = nonNullValues.map(value => {
    const strValue = value.toString().trim();

    // handle integers (including zero)
    if (/^-?\d+$/.test(strValue)) return 'integer';

    // handle numbers (floats/decimals, including large numbers and small precision)
    if (/^-?\d+(\.\d+)?$/.test(strValue)) {
      return Number.isInteger(parseFloat(strValue)) ? 'integer' : 'number';
    }

    // handle boolean values
    if (/^(true|false)$/i.test(strValue)) return 'boolean';

    // handle dates
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(strValue) || !isNaN(Date.parse(strValue))) {
      return 'date';
    }

    // check for arrays or objects
    if (Array.isArray(value)) return 'array';
    if (value !== null && typeof value === 'object') return 'object';

    // default fallback to string
    return 'string';
  });

  const uniqueTypes = [...new Set(types)];
  return uniqueTypes.length === 1 ? uniqueTypes[0] : 'mixed'; // Return 'mixed' only if multiple data types exist
};




// export const generateSchema = (data) => {
//   if (Array.isArray(data) && data.length > 0) {
//     if (typeof data[0] === 'object' && !Array.isArray(data[0])) {
//       // For tabular data (CSV, Excel, database tables)
//       return Object.keys(data[0]).map(key => ({
//         name: key,
//         type: inferDataType(data.map(row => row[key])),
//         comment: ''
//       }));
//     } else {
//       // For array data
//       return [{
//         name: 'value',
//         type: inferDataType(data),
//         comment: ''
//       }];
//     }
//   } else if (typeof data === 'object') {
//     // For JSON or XML data
//     return Object.keys(data).map(key => ({
//       name: key,
//       type: inferDataType([data[key]]),
//       comment: ''
//     }));
//   }
//   // Fallback for unexpected data structures
//   return [{
//     name: 'value',
//     type: inferDataType([data]),
//     comment: ''
//   }];
// };


// Infer schema from XML objects
const inferXMLSchema = (sample) => {
  return Object.keys(sample).map(key => ({
    name: key,
    type: typeof sample[key] === 'object' ? 'object' : 'string',
    comment: ''
  }));
};