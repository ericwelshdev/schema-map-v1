import { getOpenAIClient, getIQVIAOpenAIClient } from '../config/openai';
import { ProfiledData, AnalyzedData, ColumnProfile } from '../types';

export async function analyzeAndTagData(profiledData: ProfiledData, selectedModel: 'openai' | 'iqvia'): Promise<AnalyzedData> {
  const analyzedColumns: Record<string, string[]> = {};
  let missingDataAnalysis;

  try {
    missingDataAnalysis = await analyzeMissingData(profiledData.data);
  } catch (error) {
    console.error('Error analyzing missing data:', error);
    missingDataAnalysis = { error: 'Failed to analyze missing data' };
  }

  let client;
  try {
    client = selectedModel === 'openai' ? await getOpenAIClient() : await getIQVIAOpenAIClient();
  } catch (error: any) {
    throw new Error(`Failed to initialize ${selectedModel.toUpperCase()} client: ${error.message}`);
  }

  if (!client) {
    throw new Error(`Failed to initialize ${selectedModel.toUpperCase()} client. Please check your API key and try again.`);
  }

  for (const [columnName, profile] of Object.entries(profiledData.columnProfiles)) {
    const tags = await generateTags(client, columnName, profile, selectedModel);
    analyzedColumns[columnName] = tags;
  }

  return {
    ...profiledData,
    columnTags: analyzedColumns,
    missingDataAnalysis,
  };
}

async function analyzeMissingData(data: any[]): Promise<any> {
  // Implementation for missing data analysis
  // This is a placeholder and should be implemented based on your specific requirements
  return { missingDataCount: data.filter(item => Object.values(item).some(value => value === null || value === undefined)).length };
}

async function generateTags(client: any, columnName: string, profile: ColumnProfile, clientType: "openai" | "iqvia"): Promise<string[]> {
  try {
    const response = await client.chat.completions.create({
      model: clientType === "openai" ? "gpt-3.5-turbo" : "dep-cio-openaiebt01-gtohackathon-gpt4-turbo",
      messages: [
        { role: "system", content: "You are a data analyst tasked with generating relevant tags for a column in a dataset." },
        { role: "user", content: `Generate relevant tags for a column named "${columnName}" with the following profile: ${JSON.stringify(profile)}. Provide the tags as a comma-separated list.` }
      ],
    });

    const tags = response.choices[0].message.content?.split(',').map(tag => tag.trim()) || [];
    return tags;
  } catch (error: any) {
    console.error(`Error generating tags with ${clientType} client:`, error);
    throw new Error(`Failed to generate tags: ${error.message}`);
  }
}