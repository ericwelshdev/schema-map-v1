const calculateCompleteness = (mappings) => {
  const totalFields = mappings.length;
  const mappedFields = mappings.filter(m => m.targetId).length;
  return (mappedFields / totalFields) * 100;
};

const calculateConsistency = (mappings) => {
  const typeConsistency = mappings.filter(m => 
    validateDataTypeCompatibility(m.sourceColumn, m.targetColumn)
  ).length;
  return (typeConsistency / mappings.length) * 100;
};

const calculateAccuracy = (mappings) => {
  return mappings.reduce((sum, mapping) => 
    sum + (mapping.confidence || 0), 0) / mappings.length * 100;
};

const validateDataTypeCompatibility = (sourceColumn, targetColumn) => {
  const typeCompatibility = {
    string: ['string', 'text', 'varchar'],
    number: ['number', 'integer', 'decimal', 'float'],
    date: ['date', 'datetime', 'timestamp'],
    boolean: ['boolean', 'bit']
  };

  const sourceType = sourceColumn.type.toLowerCase();
  const targetType = targetColumn.type.toLowerCase();

  return Object.values(typeCompatibility).some(group => 
    group.includes(sourceType) && group.includes(targetType)
  );
};

const validateNullability = (mapping, sourceData, targetSchema) => {
  const hasNulls = sourceData.some(value => value === null);
  const targetAllowsNull = targetSchema.nullable;
  return !hasNulls || targetAllowsNull;
};

const validateLength = (mapping, sourceData, targetSchema) => {
  if (!targetSchema.maxLength) return true;
  return sourceData.every(value => 
    value === null || String(value).length <= targetSchema.maxLength
  );
};

export const calculateQualityMetrics = (mappings) => {
  const metrics = {
    completeness: calculateCompleteness(mappings),
    accuracy: calculateAccuracy(mappings),
    consistency: calculateConsistency(mappings)
  };

  return {
    ...metrics,
    overall: (metrics.completeness + metrics.accuracy + metrics.consistency) / 3
  };
};

export const validateMappingQuality = (mapping, sourceData, targetSchema) => {
  return {
    dataTypeMatch: validateDataTypeCompatibility(mapping, sourceData),
    patternMatch: validatePatternCompatibility(mapping, sourceData),
    nullabilityMatch: validateNullability(mapping, sourceData, targetSchema),
    lengthMatch: validateLength(mapping, sourceData, targetSchema)
  };
};

const validatePatternCompatibility = (mapping, sourceData) => {
  if (!mapping.targetColumn.pattern) return true;
  
  const pattern = new RegExp(mapping.targetColumn.pattern);
  return sourceData.every(value => 
    value === null || pattern.test(String(value))
  );
};
