import Papa from 'papaparse';

export const detectFileType = (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
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

export const autoDetectSettings = async (file, fileType) => {
  if (fileType === 'csv') {
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
  }
  return {};
};

export const generateSchema = async (file, settings) => {
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
        resolve({ schema, sampleData, warnings });
      },
      error: (error) => reject(error)
    });
  });
};

const inferDataType = (values) => {
  if (values.every(v => !isNaN(v))) return 'number';
  if (values.every(v => !isNaN(Date.parse(v)))) return 'date';
  return 'string';
};