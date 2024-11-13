import axios from 'axios';
import { schemaClassificationOptions } from '../schemas/dataDictionarySchemaClassification';

const API_URL = 'http://localhost:8001/api';
  export const getMLPredictions = async (columnData) => {
      try {
          // Create more comprehensive training data from schema classifications
          const trainingExamples = [];
          const trainingLabels = [];

          schemaClassificationOptions.forEach(group => {
              group.options.forEach(option => {
                  // Add label as example
                  trainingExamples.push(option.label.toLowerCase());
                  trainingLabels.push(option.value);

                  // Add property patterns as examples
                  if (option.properties) {
                      if (option.properties.prefix) {
                          trainingExamples.push(option.properties.prefix.toLowerCase());
                          trainingLabels.push(option.value);
                      }
                      if (option.properties.suffix) {
                          trainingExamples.push(option.properties.suffix.toLowerCase());
                          trainingLabels.push(option.value);
                      }
                      if (option.properties.character_pattern) {
                          trainingExamples.push(option.properties.character_pattern.toLowerCase());
                          trainingLabels.push(option.value);
                      }
                  }

                  // Add tags as examples
                  if (option.tags) {
                      option.tags.forEach(tag => {
                          trainingExamples.push(tag.toLowerCase());
                          trainingLabels.push(option.value);
                      });
                  }
              });
          });

          // Keep existing training data setup
          const trainResponse = await axios.post('http://localhost:8001/train', {
              model_name: "schema_classifier",
              model_type: "string",
              training_data: {
                  texts: trainingExamples,
                  labels: trainingLabels
              },
              schema_data: schemaClassificationOptions
          });

          // Add predict payload definition
          const predictPayload = {
              model_name: "schema_classifier",
              texts: [columnData.name.toLowerCase()]
          };

          const predictResponse = await axios.post('http://localhost:8001/predict', predictPayload);
          console.log('Raw Prediction Response:', predictResponse.data);

          const prediction = predictResponse.data.predictions[0];
          console.log('Prediction with Scoring Details:', prediction);

          // Find matching classification
          const matchingOption = schemaClassificationOptions
              .flatMap(group => group.options)
              .find(option => option.value === prediction.prediction);

          return {
              suggestedClassification: matchingOption,
              confidence: prediction.confidence,
              scoring_weights: prediction.scoring_weights,
              scoring_components: prediction.scoring_components
          };
      } catch (error) {
          console.error('ML prediction failed:', error);
          return {
              suggestedClassification: schemaClassificationOptions[0].options[0],
              confidence: 0.5
          };
      }
  };


export const trainModel = async (trainingData) => {
    const response = await axios.post(`${API_URL}/ml/train`, trainingData);
    return response.data;
};