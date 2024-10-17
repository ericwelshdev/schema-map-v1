import { ingestData } from './ingest';
import { profileData } from './profile';
import { analyzeAndTagData } from './analyze';
import { generateMappingScores } from './mapping';
import { outputEnhancedData } from './output';
import { Schema, EnhancedDataset } from '../types';

export async function runDataProcessingPipeline(
  inputFilePath: string,
  sourceSchema: Schema,
  targetSchema: Schema,
  selectedModel: 'openai' | 'iqvia'
): Promise<EnhancedDataset> {
  try {
    // Step 1: Ingest the input file
    const ingestedData = await ingestData(inputFilePath);

    // Step 2: Execute data profiling tasks
    const profiledData = await profileData(ingestedData);

    // Step 3: Analyze and tag data using AI
    const analyzedData = await analyzeAndTagData(profiledData, selectedModel);

    // Step 4: Generate mapping scores
    const mappingScores = await generateMappingScores(analyzedData, sourceSchema, targetSchema);

    // Step 5: Output enhanced dataset
    const enhancedDataset = await outputEnhancedData(analyzedData, mappingScores);

    return enhancedDataset;
  } catch (error) {
    console.error('Error in data processing pipeline:', error);
    throw new Error(`Failed to process data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}