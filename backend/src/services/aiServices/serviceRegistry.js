  const serviceRegistry = {
      schemas: new Map(),
      prompts: new Map(),
    
      registerSchema(key, schema) {
          this.schemas.set(key, schema);
      },
    
      registerPrompt(key, prompt) {
          this.prompts.set(key, prompt);
      },
    
      getSchema(key) {
          return this.schemas.get(key);
      },
    
      getPrompt(key) {
          return this.prompts.get(key);
      }
  };

  // Register default prompts
  serviceRegistry.registerPrompt('columnClassification', {
      role: 'system',
      content: 'You are a data dictionary expert. Your task is to classify column names according to these definitions:'
  });

  module.exports = serviceRegistry;
