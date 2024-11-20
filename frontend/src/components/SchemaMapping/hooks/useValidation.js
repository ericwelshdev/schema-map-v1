import { useState, useCallback } from 'react';

const validateDataTypes = (mapping) => {
  const sourceType = mapping.sourceColumn?.type;
  const targetType = mapping.targetColumn?.type;

  return {
    type: 'dataType',
    isValid: isCompatibleTypes(sourceType, targetType),
    score: calculateTypeCompatibilityScore(sourceType, targetType),
    message: `Data type compatibility: ${sourceType} → ${targetType}`
  };
};

const validatePatterns = (mapping) => {
  const sourcePattern = mapping.sourceColumn?.pattern;
  const targetPattern = mapping.targetColumn?.pattern;

  return {
    type: 'pattern',
    isValid: matchesPattern(sourcePattern, targetPattern),
    score: calculatePatternMatchScore(sourcePattern, targetPattern),
    message: 'Pattern validation'
  };
};

const validateConstraints = (mapping) => {
  const constraints = [
    validateLength(mapping),
    validateNullability(mapping),
    validatePrecision(mapping)
  ];

  return {
    type: 'constraints',
    isValid: constraints.every(c => c.isValid),
    score: calculateAverageScore(constraints.map(c => c.score)),
    message: 'Constraint validation'
  };
};

const calculateValidationScore = (results) => {
  const weights = {
    dataType: 0.4,
    pattern: 0.3,
    constraints: 0.3
  };

  return results.reduce((total, result) => {
    return total + (result.score * weights[result.type]);
  }, 0);
};

export const useValidation = () => {
  const [validationResults, setValidationResults] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  const validateMapping = useCallback(async (mapping) => {
    setIsValidating(true);
    try {
      const results = await Promise.all([
        validateDataTypes(mapping),
        validatePatterns(mapping),
        validateConstraints(mapping)
      ]);

      const validationScore = calculateValidationScore(results);
      setValidationResults(prev => ({
        ...prev,
        [mapping.sourceId]: {
          score: validationScore,
          details: results,
          timestamp: new Date()
        }
      }));

      return validationScore;
    } finally {
      setIsValidating(false);
    }
  }, []);

  return { validationResults, isValidating, validateMapping };
};

const calculateTypeCompatibilityScore = (sourceType, targetType) => {
  const typeCompatibility = {
    string: { string: 1, number: 0.5, date: 0.7 },
    number: { number: 1, string: 0.8 },
    date: { date: 1, string: 0.8 },
    boolean: { boolean: 1, string: 0.8, number: 0.7 }
  };

  return typeCompatibility[sourceType]?.[targetType] || 0;
};

const matchesPattern = (sourcePattern, targetPattern) => {
  if (!sourcePattern || !targetPattern) return true;
  const regex = new RegExp(targetPattern);
  return regex.test(sourcePattern);
};

const calculatePatternMatchScore = (sourcePattern, targetPattern) => {
  if (!sourcePattern || !targetPattern) return 1;
  return matchesPattern(sourcePattern, targetPattern) ? 1 : 0;
};

const validateLength = (mapping) => {
  const sourceLength = mapping.sourceColumn?.maxLength || 0;
  const targetLength = mapping.targetColumn?.maxLength || 0;

  return {
    isValid: sourceLength <= targetLength,
    score: sourceLength <= targetLength ? 1 : targetLength / sourceLength
  };
};

const validateNullability = (mapping) => {
  const sourceNullable = mapping.sourceColumn?.nullable || false;
  const targetNullable = mapping.targetColumn?.nullable || false;

  return {
    isValid: !(!targetNullable && sourceNullable),
    score: !(!targetNullable && sourceNullable) ? 1 : 0
  };
};

const validatePrecision = (mapping) => {
  const sourcePrecision = mapping.sourceColumn?.precision || 0;
  const targetPrecision = mapping.targetColumn?.precision || 0;

  return {
    isValid: sourcePrecision <= targetPrecision,
    score: sourcePrecision <= targetPrecision ? 1 : targetPrecision / sourcePrecision
  };
};

const calculateAverageScore = (scores) => {
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

const isCompatibleTypes = (sourceType, targetType) => {
  const typeCompatibility = {
    string: ['string', 'text', 'varchar', 'char'],
    number: ['number', 'integer', 'decimal', 'float', 'double'],
    date: ['date', 'datetime', 'timestamp'],
    boolean: ['boolean', 'bit', 'flag'],
    object: ['object', 'json'],
    array: ['array', 'list']
  };

  const normalizedSourceType = sourceType?.toLowerCase();
  const normalizedTargetType = targetType?.toLowerCase();

  return Object.values(typeCompatibility).some(compatibleTypes => 
    compatibleTypes.includes(normalizedSourceType) && 
    compatibleTypes.includes(normalizedTargetType)
  );
};
