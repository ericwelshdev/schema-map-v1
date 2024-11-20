export const MAPPING_CONFIG = {
  validation: {
    confidenceThresholds: {
      high: 0.8,
      medium: 0.6,
      low: 0.4
    },
    batchSize: 50
  },
  
  visualization: {
    colors: {
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336'
    },
    layout: {
      nodeSpacing: 50,
      levelSpacing: 200
    }
  },
  
  transformation: {
    maxBatchSize: 1000,
    previewLimit: 5
  },
  
  search: {
    minSearchLength: 2,
    debounceMs: 300
  }
};

export const SUPPORTED_DATA_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean'
};
