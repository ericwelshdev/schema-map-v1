import Papa from 'papaparse';
import { parse } from 'fast-xml-parser';  // Use fast-xml-parser for XML parsing
import * as XLSX from 'xlsx';
import { getConfigForResourceType } from './ingestionConfig';

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

const getIngestionedValueSettings = (fileType, settings) => {
  const defaultConfig = getConfigForResourceType(fileType);
  const formattedSettings = {};

  for (const [key, value] of Object.entries(settings)) {
    if (value !== undefined) {
      if (typeof value === 'object' && value.callArgField) {
        formattedSettings[value.callArgField] = value.value;
      } else {
        formattedSettings[key] = value;
      }
    }
  }
  console.log('settings', settings);
  console.log('formattedSettings', formattedSettings);
  return formattedSettings;
};


export const getDefaultIngestionSettings = (fileType, detectedSettings) => {
  const defaultConfig = getConfigForResourceType(fileType);
  const formattedSettings = {};

  for (const [key, value] of Object.entries(defaultConfig)) {
    if (value.callArgField) {
      formattedSettings[value.callArgField] = detectedSettings[value.uiField] ?? value.default;
    } else {
      formattedSettings[key] = detectedSettings[value.uiField] ?? value.default;
    }
  }

  return formattedSettings;
};

const mapUiFieldsToCallArgFields = (settings, config) => {
  const mappedSettings = {};
  for (const [key, value] of Object.entries(config)) {
    if (value.uiField && value.callArgField && settings.hasOwnProperty(value.uiField)) {
      mappedSettings[value.callArgField] = settings[value.uiField];
    } else if (settings.hasOwnProperty(key)) {
      mappedSettings[key] = settings[key];
    }
  }
  return mappedSettings;
};



const generateCSVSchema = async (file, settings) => {
  console.log('settings', settings);
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      ...settings,
      complete: (results) => {
        try {
          if (!results.data || !Array.isArray(results.data) || results.data.length === 0) {
            throw new Error('No valid data found in the CSV file');
          }

          let fields = results.meta.fields || Object.keys(results.data[0]);
          let schema = fields.map((field) => {
            let columnValues = results.data.map(row => row[field]).filter(value => value != null);
            return {
              name: field,
              type: inferDataType(columnValues),
              comment: ''
            };
          });
        
          console.log('results.data.length:', results.data.length);
          let sampleData = results.data.slice(0, Math.min(settings.preview || 100, results.data.length));
    
          let warnings = [];
          if (results.errors && results.errors.length > 0) {
            warnings.push('Some rows could not be parsed correctly -> ', results.errors);
          }
          if (results.data.length > 1000000) {
            warnings.push('Large file detected. Only a sample of the data was processed.');
          }
          let rawData = results.data.slice(0, 100).map(row => 
            Object.values(row).join(settings.delimiter || ',')
          ).join('\n');
          resolve({ schema, sampleData, warnings, rawData });
        } catch (error) {
          console.error('Error in CSV schema generation:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('Papa Parse error:', error);
        reject(error);
      }
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


// Infer schema from XML objects
const inferXMLSchema = (sample) => {
  return Object.keys(sample).map(key => ({
    name: key,
    type: typeof sample[key] === 'object' ? 'object' : 'string',
    comment: ''
  }));
};



export const processFile = async (file, settings = {}, isInitialIngestion = true, progressCallback = () => {}) => {
  try {
    console.log('fileUtil-> Uploading file:', file);
    console.log('fileUtil-> Ingestion Settings:', settings);

    progressCallback(20);
    console.log('Processing file:', file.name);
    const fileType = await detectFileType(file);
    console.log('Detected file type:', fileType);
    const autoDetectedSettings = await autoDetectSettings(file, fileType);
    console.log('Auto-detected settings:', autoDetectedSettings);
    progressCallback(40);
    const newConfig = getConfigForResourceType(fileType);
    console.log('New config:', newConfig);
    
    let formattedSettings;
    if (Object.keys(settings).length === 0) {
      formattedSettings = getDefaultIngestionSettings(fileType, autoDetectedSettings);
    } else {
      formattedSettings = { ...getIngestionedValueSettings(fileType, autoDetectedSettings), ...settings };
    }
    console.log('Formatted settings:', formattedSettings);

    progressCallback(80);
    const schemaResult = await generateSchema(file, formattedSettings);
    console.log('Schema result:', schemaResult);
    console.log('File processing completed successfully');
    progressCallback(100);

    return {
      loading: false,
      progress: 100,
      uploadStatus: { type: 'success', message: 'File successfully processed.' },
      ingestionConfig: newConfig,
      ingestionSettings: formattedSettings,
      schema: schemaResult.schema,
      sourceSchema: schemaResult.schema,      
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toLocaleString(),
        file: file,
      },
      numCols : schemaResult.schema.length,
      numRows: schemaResult.sampleData.length,
      sampleData: schemaResult.sampleData,
      rawData: schemaResult.rawData,
      expandedAccordion: isInitialIngestion ? 'ingestionSettings' : 'data'
    };
    
  } catch (error) {
    return {
      loading: false,
      progress: 0,
      uploadStatus: { 
        type: 'error', 
        message: `Error processing file: ${error.message}` 
      },
      expandedAccordion: 'ingestionSetup'
    };
  }
};