import { aiService } from './aiService';
import { schemaClassificationOptions } from '../schemas/dataDictionarySchemaClassification';

export const getAIColumnClassification = async (columnData) => {
    try {
        const classification = await aiService.classifyColumn(
            columnData,
            schemaClassificationOptions
        );
        return {
            suggestedClassification: classification.suggestedClassification,
            confidence: classification.confidence,
            scoring_weights: classification.scoring_weights,
            scoring_components: classification.scoring_components
        };
    } catch (error) {
        console.error('Column classification failed:', error);
        return null;
    }
};
