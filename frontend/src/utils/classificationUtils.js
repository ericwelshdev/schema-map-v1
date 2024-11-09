import { getMLPredictions } from '../services/mlService';
import { schemaClassificationOptions } from '../schemas/dataDictionarySchemaClassification';

export const classifySchemaData = async (schemaData) => {
  const classifiedData = await Promise.all(
    schemaData.map(async (table) => {
      const classifiedColumns = await Promise.all(
        table.columns.map(async (column) => {
          const mlPrediction = await getMLPredictions({
            name: column.physicalName,
            type: column.dataType,
            description: column.description,
            sampleValues: column.sampleData
          });

          const matchedClassification = schemaClassificationOptions
            .flatMap(group => group.options)
            .find(option => option.value === mlPrediction?.suggestedClassification?.value);

          return {
            ...column,
            schemaClassification: matchedClassification || null,
            mlConfidence: mlPrediction?.confidence || 0,
            classificationProperties: matchedClassification?.properties || {},
            classificationTags: matchedClassification?.tags || [],
            classificationDescription: matchedClassification?.classification_description || ''
          };
        })
      );

      return {
        ...table,
        columns: classifiedColumns
      };
    })
  );

  return classifiedData;
};

export const getClassificationMetrics = (schemaData) => {
  return {
    classifiedColumns: schemaData.reduce((acc, table) => 
      acc + table.columns.filter(col => col.schemaClassification && col.mlConfidence > 70).length, 0),
    highConfidenceColumns: schemaData.reduce((acc, table) => 
      acc + table.columns.filter(col => col.mlConfidence > 90).length, 0)
  };
};