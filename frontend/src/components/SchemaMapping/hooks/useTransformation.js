import { useState, useCallback } from 'react';

const validateTransformedValue = (value) => {
  // Return true if value is not null/undefined
  if (value == null) return false;
  
  // Check if string is not empty after trimming
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  // For numbers, check if it's a valid number
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  
  // For other types, check if value exists
  return true;
};

export const useTransformation = () => {
  const [transformations, setTransformations] = useState([]);
  const [previewData, setPreviewData] = useState(null);

  const applyTransformation = useCallback(async (sourceData, transformationRules) => {
    const transformed = sourceData.map(item => {
      let result = item;
      transformationRules.forEach(rule => {
        result = rule.transform(result);
      });
      return {
        original: item,
        transformed: result,
        isValid: validateTransformedValue(result)
      };
    });

    setPreviewData(transformed);
    return transformed;
  }, []);

  const addTransformation = useCallback((rule) => {
    setTransformations(prev => [...prev, rule]);
  }, []);

  return { 
    transformations, 
    previewData, 
    applyTransformation, 
    addTransformation 
  };
};