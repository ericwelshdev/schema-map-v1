export const mappingUtils = {
  calculateConfidenceColor(confidence) {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  },

  formatConfidence(confidence) {
    return `${(confidence * 100).toFixed(1)}%`;
  },

  validateDataTypeCompatibility(sourceType, targetType) {
    const typeCompatibility = {
      string: ['string', 'text', 'varchar'],
      number: ['number', 'integer', 'decimal', 'float'],
      boolean: ['boolean', 'bit'],
      date: ['date', 'datetime', 'timestamp']
    };

    const sourceCategory = Object.keys(typeCompatibility)
      .find(key => typeCompatibility[key].includes(sourceType.toLowerCase()));
    
    const targetCategory = Object.keys(typeCompatibility)
      .find(key => typeCompatibility[key].includes(targetType.toLowerCase()));

    return sourceCategory === targetCategory;
  }
};
