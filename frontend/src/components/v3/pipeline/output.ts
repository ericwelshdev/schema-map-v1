import { AnalyzedData, MappingScores, EnhancedDataset } from '../types';

export async function outputEnhancedData(analyzedData: AnalyzedData, mappingScores: MappingScores): Promise<EnhancedDataset> {
  const enhancedDataset: EnhancedDataset = {
    data: analyzedData.data,
    metadata: {
      rowCount: analyzedData.rowCount,
      columnProfiles: analyzedData.columnProfiles,
      columnTags: analyzedData.columnTags,
    },
    mappingScores: mappingScores,
  };

  return enhancedDataset;
}