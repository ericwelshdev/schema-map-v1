export const AI_SERVICE_CONFIG = {
  endpoint: process.env.REACT_APP_AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.REACT_APP_AZURE_OPENAI_API_KEY,
  deploymentName: process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT,
  apiVersion: '2023-05-15'
};

export const PROMPT_TEMPLATES = {
  columnClassification: {
    system: `You are a data dictionary expert. Analyze column names and properties to classify them according to the provided schema classification options. Consider:
    - Column name patterns and conventions
    - Data types and sample values
    - Business context and semantic meaning
    - Anti-patterns that should be avoided`,
    
    user: (column, schemaOptions) => `
    Classify this column:
    Name: ${column.name}
    Type: ${column.type}
    Sample Values: ${column.sampleValues?.join(', ')}

    Available Classifications:
    ${JSON.stringify(schemaOptions, null, 2)}

    Provide classification with confidence score and reasoning.`
  }
};