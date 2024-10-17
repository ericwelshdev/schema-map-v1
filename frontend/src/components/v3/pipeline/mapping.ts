import { AnalyzedData, Schema, MappingScores } from '../types';

export async function generateMappingScores(analyzedData: AnalyzedData, sourceSchema: Schema, targetSchema: Schema): Promise<MappingScores> {
  const mappingScores: MappingScores = {};

  for (const sourceColumn of sourceSchema.columns) {
    mappingScores[sourceColumn.name] = {};
    for (const targetColumn of targetSchema.columns) {
      const score = calculateMappingScore(
        sourceColumn,
        targetColumn,
        analyzedData.columnProfiles[sourceColumn.name],
        analyzedData.columnTags[sourceColumn.name]
      );
      mappingScores[sourceColumn.name][targetColumn.name] = score;
    }
  }

  return mappingScores;
}

function calculateMappingScore(sourceColumn: any, targetColumn: any, sourceProfile: any, sourceTags: string[]): number {
  let score = 0;

  // Name similarity
  score += calculateStringSimilarity(sourceColumn.name, targetColumn.name) * 0.3;

  // Data type compatibility
  if (sourceColumn.type === targetColumn.type) score += 0.2;

  // Tag similarity
  const tagSimilarity = calculateTagSimilarity(sourceTags, targetColumn.tags.map((tag: any) => tag.name));
  score += tagSimilarity * 0.3;

  // Profile-based scoring
  score += calculateProfileScore(sourceProfile, targetColumn) * 0.2;

  return score;
}

function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j - 1] + 1, dp[i][j - 1] + 1, dp[i - 1][j] + 1);
      }
    }
  }

  return dp[m][n];
}

function calculateTagSimilarity(sourceTags: string[], targetTags: string[]): number {
  const commonTags = sourceTags.filter(tag => targetTags.includes(tag));
  return commonTags.length / Math.max(sourceTags.length, targetTags.length);
}

function calculateProfileScore(sourceProfile: any, targetColumn: any): number {
  let score = 0;

  // Add more sophisticated profile-based scoring logic here
  // For example, compare value ranges, patterns, etc.

  return score;
}