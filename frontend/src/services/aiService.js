import axios from 'axios';
import { PROMPT_TEMPLATES } from '../config/ai/aiColumnClassificationConfig';
const API_URL = 'http://localhost:5000/api';

class AIService {
  async getCompletion(messages) {
    console.log('Frontend AI Service Debug:', {
      timestamp: new Date().toISOString(),
      endpoint: `${API_URL}/ai/completions`,
      messages
    });

    const response = await axios.post(`${API_URL}/ai/completions`, { messages });
    return response.data;
  }

  async classifyColumn(columnData, schemaOptions) {
    const messages = [
      {
        role: 'system',
        content: PROMPT_TEMPLATES.columnClassification.system
      },
      {
        role: 'user',
        content: PROMPT_TEMPLATES.columnClassification.user(columnData, schemaOptions)
      }
    ];

    const completion = await this.getCompletion(messages);
    return this.parseClassificationResponse(completion);
  }

  parseClassificationResponse(completion) {
    try {
      const content = completion.choices[0].message.content;
      return {
        suggestedClassification: content.classification,
        confidence: content.confidence,
        scoring_weights: content.weights,
        scoring_components: content.analysis
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return null;
    }
  }
}

export const aiService = new AIService();