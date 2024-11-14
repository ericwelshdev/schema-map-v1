const PROMPT_TEMPLATES = {
    columnClassification: {
        system: `You are a data dictionary expert. Analyze column names and properties to classify them according to the provided schema classification options. Consider:
        - Column name patterns and conventions
        - Data types and sample values
        - Business context and semantic meaning
        - Anti-patterns that should be avoided`,
        
        user: (columnData, schemaOptions) => `
        Classify this column:
        Name: ${columnData.name}
        Type: ${columnData.type}
        Sample Values: ${columnData.sampleValues?.join(', ')}

        Available Classifications:
        ${JSON.stringify(schemaOptions, null, 2)}

        Provide classification with confidence score and reasoning.`
    }
};

module.exports = {
    PROMPT_TEMPLATES
};
