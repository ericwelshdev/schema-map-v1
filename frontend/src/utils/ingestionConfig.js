import { csvConfig } from './ingestionConfigs/csvConfig';
// import { databaseConfig } from './ingestionConfigs/databaseConfig';
// import { apiConfig } from './ingestionConfigs/apiConfig';

export const ingestionConfig = {
  file: {
    csv: csvConfig,
    // Add other file types here
  },
  // database: databaseConfig,
  // api: apiConfig
};
