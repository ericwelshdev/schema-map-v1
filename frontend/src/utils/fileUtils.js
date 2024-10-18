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
        const schema = results.meta.fields.map((field, index) => ({
          name: field,
          type: inferDataType(results.data.slice(1, 6).map(row => row[index])),
          comment: ''
        }));
        const sampleData = results.data.slice(1, 11);
        const warnings = [];
        if (results.errors.length > 0) {
          warnings.push('Some rows could not be parsed correctly');
        }
        if (results.data.length > 1000000) {
          warnings.push('Large file detected. Only a sample of the data was processed.');
        }
        resolve({ schema, sampleData, warnings, rawData: results.data.slice(0, 100).map(row => row.join(settings.delimiter)).join('\n') });
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
  const workbook = XLSX.read(data, { type: 'array', ...settings });
  const sheetName = settings.sheetSelection === 'firstSheet' ? workbook.SheetNames[0] : settings.sheetSelection;
  const worksheet = workbook.Sheets[sheetName];
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: settings.header ? 1 : undefined,
    range: settings.skipFirstNRows,
    blankrows: !settings.skipEmptyLines,
    raw: !settings.dateParsing,
  });

  const schema = Object.keys(jsonData[0]).map(key => ({
    name: key,
    type: inferDataType(jsonData.slice(0, 5).map(row => row[key])),
    comment: ''
  }));

  const sampleData = jsonData.slice(0, settings.previewNRows);
  const warnings = [];

  if (jsonData.length > 1000000) {
    warnings.push('Large file detected. Only a sample of the data was processed.');
  }

  const rawData = XLSX.utils.sheet_to_csv(worksheet, { FS: '\t', RS: '\n' }).slice(0, 1000);

  return { schema, sampleData, warnings, rawData };
};
// Infer data type for CSV schema generation
const inferDataType = (values) => {
  if (values.every(value => !isNaN(value))) {
    return 'number';
  } else if (values.every(value => new Date(value).toString() !== 'Invalid Date')) {
    return 'date';
  } else {
    return 'string';
  }
};

// Infer schema from JSON objects
const inferJSONSchema = (sample) => {
  return Object.keys(sample).map(key => ({
    name: key,
    type: inferDataType([sample[key]]),
    comment: ''
  }));
};

// Infer schema from XML objects
const inferXMLSchema = (sample) => {
  return Object.keys(sample).map(key => ({
    name: key,
    type: typeof sample[key] === 'object' ? 'object' : 'string',
    comment: ''
  }));
};
