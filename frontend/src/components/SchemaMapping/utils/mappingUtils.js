const calculateNameSimilarity = (sourceName, targetName) => {
  const sourceWords = sourceName.toLowerCase().split(/[^a-zA-Z0-9]+/);
  const targetWords = targetName.toLowerCase().split(/[^a-zA-Z0-9]+/);
  
  const commonWords = sourceWords.filter(word => targetWords.includes(word));
  const similarity = (2.0 * commonWords.length) / (sourceWords.length + targetWords.length);
  
  return similarity;
};

const calculateTypeCompatibility = (sourceType, targetType) => {
  const typeCompatibility = {
    string: { string: 1.0, text: 0.9, varchar: 0.9 },
    number: { number: 1.0, integer: 0.9, decimal: 0.9, float: 0.8 },
    date: { date: 1.0, datetime: 0.9, timestamp: 0.9 },
    boolean: { boolean: 1.0, bit: 0.9 }
  };

  return typeCompatibility[sourceType]?.[targetType] || 0;
};

const calculatePatternMatch = (sourceName, targetPattern) => {
  if (!targetPattern) return 1.0;
  const regex = new RegExp(targetPattern);
  return regex.test(sourceName) ? 1.0 : 0.0;
};

export const calculateMappingConfidence = (source, target, existingMappings) => {
  const nameScore = calculateNameSimilarity(source.name, target.name);
  const typeScore = calculateTypeCompatibility(source.type, target.type);
  const patternScore = calculatePatternMatch(source.name, target.pattern);
  
  return {
    confidence: (nameScore * 0.5 + typeScore * 0.3 + patternScore * 0.2),
    scores: { nameScore, typeScore, patternScore }
  };
};

export const suggestMappings = (sourceColumns, targetColumns) => {
  return sourceColumns.map(source => {
    const suggestions = targetColumns
      .map(target => ({
        target,
        ...calculateMappingConfidence(source, target, [])
      }))
      .filter(suggestion => suggestion.confidence > 0.3)
      .sort((a, b) => b.confidence - a.confidence);

    return {
      source,
      suggestions: suggestions.slice(0, 3)
    };
  });
};