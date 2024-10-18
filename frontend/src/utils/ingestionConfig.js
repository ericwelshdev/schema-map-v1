import { csvConfig, updateCSVConfig } from './ingestionConfigs/csvConfig';
import { excelConfig, updateExcelConfig } from './ingestionConfigs/excelConfig';

export const ingestionConfig = {
  file: {
    csv: csvConfig,
    excel: excelConfig,
  },
};

export const getConfigForResourceType = (resourceType) => {
  if (resourceType in ingestionConfig.file) {
    return ingestionConfig.file[resourceType];
  }
  return ingestionConfig[resourceType] || {};
};

export const updateConfigForResourceType = (resourceType, detectedSettings) => {
  if (resourceType === 'csv') {
    updateCSVConfig(detectedSettings);
  } else if (resourceType === 'excel') {
    updateExcelConfig(detectedSettings);
  }
  // Add more file types here as needed
};