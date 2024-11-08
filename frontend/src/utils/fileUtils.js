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
  console.log('detectExcelSettings was called file: ,args:',file);
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
  console.log('generateCSVSchema was called file: ,args:',file, settings);
  console.log('settings', settings); // Debugging log for settings
  return new Promise((resolve, reject) => {

    if(settings.fullMode){
      settings.preview = 0;
    }

    Papa.parse(file, {
      ...settings,
      complete: (results) => {
        console.log('Parsing results:', results); // Debugging log for results

        try {
          // Check if results.data exists and is an array with valid data
          if (!results.data || !Array.isArray(results.data) || results.data.length === 0) {
            throw new Error('No valid data found in the CSV file');
          }

          // Check if fields exist in results.meta or from the first row of results.data
          let fields = results.meta?.fields || (results.data[0] ? Object.keys(results.data[0]) : []);
          if (fields.length === 0) {
            throw new Error('No fields could be identified from the CSV data');
          }

          // Generate schema based on the fields and inferred data types
          let schema = fields.map((field) => {
            let columnValues = results.data
              .map(row => row ? row[field] : null) // Ensure row exists before accessing field
              .filter(value => value != null); // Filter out null or undefined values

            return {
              name: field,
              type: inferDataType(columnValues), // Infer data type based on column values
              comment: ''
            };
          });

          // Log the number of rows in the CSV file for debugging
          console.log('results.data.length:', results.data.length);

          // Prepare sample data based on the settings or default to 100 rows
          let sampleData = results.data.slice(0, Math.min(settings.preview || 100, results.data.length));

          // Handle warnings for any parsing errors or large file sizes
          let warnings = [];
          if (results.errors && results.errors.length > 0) {
            warnings.push('Some rows could not be parsed correctly -> ', results.errors);
          }
          if (results.data.length > 1000000) {
            warnings.push('Large file detected. Only a sample of the data was processed.');
          }

          let fullData = sampleData
          if(settings.fullMode){
            fullData = results.data;
          }
          
          // Generate raw data sample by joining the first 100 rows
          let rawData = results.data.slice(0, settings.preview).map(row => 
            row ? Object.values(row).join(settings.delimiter || ',') : '' // Ensure row exists before joining
          ).join('\n');


          // Resolve with schema, sample data, warnings, and raw data
          resolve({ schema, fullData, sampleData, warnings, rawData });
        } catch (error) {
          // Log any error that occurs during schema generation
          console.error('Error in CSV schema generation:', error);
          reject(error);
        }
      },
      error: (error) => {
        // Log any parsing errors from Papa Parse
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
  console.log('generateXMLSchema was called file: ,args:',file, settings);
  const text = await file.text();
  const result = parse(text);  // Parse XML using fast-xml-parser
  const rootElement = settings.rootElement;
  const sampleData = result[rootElement].slice(0, 10);
  const schema = inferXMLSchema(sampleData[0]);
  return { schema, sampleData, warnings: [], rawData: text.slice(0, 1000) };
};

// Generate schema for Excel files
export const generateExcelSchema = async (file, settings) => {
  try {
    console.log('generateExcelSchema was called file: ,args:', file, settings);

    if (!file) {
      throw new Error('No file provided');
    }

    const data = await file.arrayBuffer();
    console.log('Standardized args:', settings);

    let workbook;
    try {
      workbook = XLSX.read(data, { type: 'array' });
    } catch (error) {
      throw new Error(`Failed to read Excel file: ${error.message}`);
    }

    if (!workbook.SheetNames.length) {
      throw new Error('Excel file contains no sheets');
    }

    
    // Use the sheet selection logic from excelConfig
    const sheetName = settings.sheetSelection === 'firstSheet' 
      ? workbook.SheetNames[0] 
      : workbook.SheetNames[settings.sheetSelection] || workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];
    

    if (!worksheet) {
      throw new Error(`Sheet "${sheetName}" not found in workbook`);
    }

    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: settings.includeHeader ? settings.header : 1,
      range: settings.skipFirstNRows,
      blankrows: !settings.skipEmptyLines,
      raw: !settings.dateParsing,
      defval: null
    });

    if (!jsonData.length) {
      throw new Error('No data found in selected sheet');
    }

    const warnings = [];
    
    // Data validation and warnings
    if (jsonData.length > 1000000) {
      warnings.push('Large file detected. Only a sample of the data was processed.');
    }

    if (Object.keys(jsonData[0]).length === 0) {
      warnings.push('First row contains no data');
    }

    const headerRow = settings.includeHeader ? 
      jsonData[0] : 
      Object.keys(jsonData[0]).map((_, index) => `Column${index + 1}`);

    const dataRows = settings.includeHeader ? jsonData.slice(1) : jsonData;

    const schema = headerRow.map((header, index) => {
      const columnData = dataRows.slice(0, 5).map(row => row[index]);
      return {
        name: header || `Column${index + 1}`,
        type: inferDataType(columnData),
        comment: ''
      };
    });

    const sampleData = dataRows
      .slice(0, settings.previewNRows)
      .map(row => headerRow.reduce((acc, header, index) => {
        acc[header] = row[index] !== undefined ? row[index] : null;
        return acc;
      }, {}));

    const rawData = XLSX.utils.sheet_to_csv(worksheet, { 
      FS: '\t', 
      RS: '\n' 
    }).slice(0, 1000);

    console.log('generateExcelSchema Result:', schema, sampleData, warnings, rawData);

    return {
      schema,
      sampleData,
      warnings,
      rawData,
      metadata: {
        totalRows: jsonData.length,
        processedRows: sampleData.length,
        sheetName,
        hasHeaders: settings.includeHeader ? settings.header : 1
      }
    };

  } catch (error) {
    console.error('Excel Schema Generation Error:', error);
    throw new Error(`Failed to generate Excel schema: ${error.message}`);
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

// Calculate file checksum
const calculateFileChecksum = async (file) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};


export const processFile = async (file, settings = {}, isInitialIngestion = true, progressCallback = () => {}) => {
  try {
    console.log('processFile was called file: ,args, isInitialIngestion:',file, settings, isInitialIngestion);
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
    
    // Get header detection from autoDetectedSettings
    const hasHeader = autoDetectedSettings.hasHeader;
    
    let formattedSettings;
    if (Object.keys(settings).length === 0) {
      formattedSettings = { ...getDefaultIngestionSettings(fileType, autoDetectedSettings), includeHeader: hasHeader || true };
    } else {
      formattedSettings = { ...getIngestionedValueSettings(fileType, autoDetectedSettings), ...settings };
    }
    console.log('processFile -->Formatted settings:',settings,  formattedSettings);

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
      ingestionSettings: {
        ...formattedSettings,
        includeHeader: hasHeader
      },
      schema: schemaResult.schema,
      resourceSchema: schemaResult.schema,      
      resourceInfo: {
        name: file.name,
        type: file.type,
        size: file.size ?? 0,
        numCols : schemaResult.schema.length ?? 0,
        sampleNumRows: schemaResult.sampleData?.length ?? 0,
        fullNumRows: schemaResult?.fullData?.length ?? schemaResult.sampleData?.length ?? 0,
        processedDate: new Date().toLocaleString(),
        lastModified: new Date(file.lastModified).toLocaleString(),
        createdDate: new Date().toLocaleString(),
        checksum: await calculateFileChecksum(file) ,
        sourceLocation: URL.createObjectURL(file),
        file: file,
        hasHeader: hasHeader
      },
      fullData: schemaResult.fullData,
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