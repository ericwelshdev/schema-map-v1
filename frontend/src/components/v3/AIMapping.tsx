import React, { useState } from 'react';
import { Brain, RefreshCw } from 'lucide-react';
import { Schema, Mapping, MetadataMapping } from '../types';

interface AIMappingProps {
  sourceSchema: Schema;
  targetSchema: Schema;
  metadataMapping: MetadataMapping | null;
  onMappingComplete: (mapping: Mapping[]) => void;
}

const AIMapping: React.FC<AIMappingProps> = ({
  sourceSchema,
  targetSchema,
  metadataMapping,
  onMappingComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMapping, setGeneratedMapping] = useState<Mapping[] | null>(null);

  const handleGenerateMapping = () => {
    setIsLoading(true);
    // Simulate AI mapping process
    setTimeout(() => {
      const aiMapping: Mapping[] = sourceSchema.columns.map((sourceColumn) => {
        const { targetColumn, targetTable, confidence, explanation } = findBestMatch(sourceColumn, targetSchema, metadataMapping);
        return {
          sourceColumn: sourceColumn.name,
          targetColumn: targetColumn.name,
          targetTable: targetTable,
          confidence,
          explanation,
          userCorrected: false,
        };
      });
      setGeneratedMapping(aiMapping);
      onMappingComplete(aiMapping);
      setIsLoading(false);
    }, 2000);
  };

  const findBestMatch = (sourceColumn: Schema['columns'][0], targetSchema: Schema, metadataMapping: MetadataMapping | null) => {
    const matches = targetSchema.columns.map(targetColumn => ({
      targetColumn,
      targetTable: targetSchema.name,
      similarity: calculateSimilarity(sourceColumn, targetColumn, metadataMapping),
    }));

    const bestMatch = matches.reduce((best, current) => 
      current.similarity > best.similarity ? current : best
    );

    const confidence = bestMatch.similarity;
    const explanation = generateExplanation(sourceColumn, bestMatch.targetColumn, confidence, metadataMapping);

    return {
      targetColumn: bestMatch.targetColumn,
      targetTable: bestMatch.targetTable,
      confidence,
      explanation,
    };
  };

  const calculateSimilarity = (source: Schema['columns'][0], target: Schema['columns'][0], metadataMapping: MetadataMapping | null) => {
    const nameSimilarity = calculateStringSimilarity(source.name, target.name);
    const typeSimilarity = source.type === target.type ? 1 : 0;
    const tagSimilarity = calculateTagSimilarity(source.tags, target.tags);
    const metadataSimilarity = metadataMapping ? calculateMetadataSimilarity(source, target, metadataMapping) : 0;
    
    return (nameSimilarity * 0.3 + typeSimilarity * 0.2 + tagSimilarity * 0.2 + metadataSimilarity * 0.3);
  };

  const calculateStringSimilarity = (a: string, b: string) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const maxLength = Math.max(aLower.length, bLower.length);
    let matches = 0;
    for (let i = 0; i < maxLength; i++) {
      if (aLower[i] === bLower[i]) matches++;
    }
    return matches / maxLength;
  };

  const calculateTagSimilarity = (sourceTags: Array<{name: string; isAI: boolean}>, targetTags: Array<{name: string; isAI: boolean}>) => {
    const sourceTagNames = sourceTags.map(tag => tag.name);
    const targetTagNames = targetTags.map(tag => tag.name);
    const commonTags = sourceTagNames.filter(tag => targetTagNames.includes(tag));
    return commonTags.length / Math.max(sourceTagNames.length, targetTagNames.length);
  };

  const calculateMetadataSimilarity = (source: Schema['columns'][0], target: Schema['columns'][0], metadataMapping: MetadataMapping) => {
    // This is a placeholder implementation. In a real-world scenario, you would use the metadataMapping
    // to compare relevant fields and calculate a similarity score based on the metadata.
    return 0.5; // Placeholder value
  };

  const generateExplanation = (source: Schema['columns'][0], target: Schema['columns'][0], confidence: number, metadataMapping: MetadataMapping | null) => {
    const reasons = [];
    if (calculateStringSimilarity(source.name, target.name) > 0.5) {
      reasons.push("Column names are similar");
    }
    if (source.type === target.type) {
      reasons.push("Data types match");
    }
    const commonTags = source.tags.filter(sourceTag => 
      target.tags.some(targetTag => targetTag.name === sourceTag.name)
    );
    if (commonTags.length > 0) {
      reasons.push(`Common tags: ${commonTags.map(tag => tag.name).join(', ')}`);
    }
    if (metadataMapping) {
      reasons.push("Metadata information considered");
    }
    if (reasons.length === 0) {
      reasons.push("Best guess based on available information");
    }
    return `${reasons.join(". ")}. Confidence: ${(confidence * 100).toFixed(0)}%`;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          onClick={handleGenerateMapping}
          disabled={isLoading}
        >
          <Brain className="mr-2" />
          {isLoading ? 'Generating Mapping...' : 'Generate AI Mapping'}
        </button>
        {generatedMapping && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600"
            onClick={handleGenerateMapping}
          >
            <RefreshCw className="mr-2" />
            Regenerate Mapping
          </button>
        )}
      </div>
      {generatedMapping && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Generated Mappings</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Source Column</th>
                <th className="border p-2 text-left">Target Column</th>
                <th className="border p-2 text-left">Confidence</th>
                <th className="border p-2 text-left">Explanation</th>
              </tr>
            </thead>
            <tbody>
              {generatedMapping.map((mapping) => (
                <tr key={mapping.sourceColumn}>
                  <td className="border p-2">{mapping.sourceColumn}</td>
                  <td className="border p-2">{mapping.targetColumn}</td>
                  <td className="border p-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${mapping.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{(mapping.confidence * 100).toFixed(0)}%</span>
                  </td>
                  <td className="border p-2 text-sm">{mapping.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AIMapping;