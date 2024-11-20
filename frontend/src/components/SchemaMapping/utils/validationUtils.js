import { schemaClassificationOptions } from '../../../schemas/dataDictionarySchemaClassification';

const isCompatibleDataType = (sourceType, targetType) => {
  const typeCompatibility = {
    string: ['string', 'text', 'varchar', 'char'],
    number: ['number', 'integer', 'decimal', 'float', 'double'],
    date: ['date', 'datetime', 'timestamp'],
    boolean: ['boolean', 'bit', 'flag']
  };

  return typeCompatibility[sourceType]?.includes(targetType) || false;
};

const calculateTypeCompatibilityScore = (sourceType, targetType) => {
  const compatibilityScores = {
    exact: 1.0,    // Same type
    compatible: 0.8, // Different but compatible types
    convertible: 0.6, // Requires conversion but possible
    incompatible: 0.0 // Cannot convert
  };

  if (sourceType === targetType) return compatibilityScores.exact;
  if (isCompatibleDataType(sourceType, targetType)) return compatibilityScores.compatible;
  
  return compatibilityScores.incompatible;
};

const matchesPattern = (value, pattern) => {
  if (!pattern || !value) return true;
  const regex = new RegExp(pattern);
  return regex.test(value);
};

const calculatePatternMatchScore = (value, pattern) => {
  if (!pattern || !value) return 1.0;
  return matchesPattern(value, pattern) ? 1.0 : 0.0;
};

export const validateDataTypes = (mapping) => {
  const sourceType = mapping.sourceColumn.type;
  const targetType = mapping.targetColumn.type;

  return {
    type: 'dataType',
    isValid: isCompatibleDataType(sourceType, targetType),
    score: calculateTypeCompatibilityScore(sourceType, targetType),
    details: `${sourceType} → ${targetType}`
  };
};

export const validatePatterns = (mapping) => {
  const { value: classification } = mapping.targetColumn;
  const option = schemaClassificationOptions
    .flatMap(group => group.options)
    .find(opt => opt.value === classification);

  return {
    type: 'pattern',
    isValid: matchesPattern(mapping.sourceColumn.name, option?.properties),
    score: calculatePatternMatchScore(mapping.sourceColumn.name, option?.properties),
    details: option?.properties?.character_pattern || 'No pattern defined'
  };
};