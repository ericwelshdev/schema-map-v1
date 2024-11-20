const calculateAverageConfidence = (mappings) => {
  const confidenceValues = Array.from(mappings.values())
    .map(mapping => mapping.confidence || 0);
    
  return confidenceValues.length > 0
    ? (confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length) * 100
    : 0;
};

export const generateMappingReport = (mappings, validations) => {
  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalMappings: mappings.size,
      validMappings: Array.from(validations.values()).filter(v => v.isValid).length,
      confidence: calculateAverageConfidence(mappings)
    },
    details: Array.from(mappings.entries()).map(([sourceId, mapping]) => ({
      source: mapping.sourceColumn,
      target: mapping.targetColumn,
      validation: validations.get(sourceId),
      transformations: mapping.transformations
    }))
  };
};