const { ChatOpenAI } = require('@langchain/openai');
const { InteractiveBrowserCredential } = require('@azure/identity');

class LangChainService {
    constructor() {
        this.llm = null;
        this.credentials = new InteractiveBrowserCredential({
            clientId: "2a459df9-d8e1-43e0-998e-320abbe581d0",
            tenantId: "5989ece0-f90e-40bf-9c79-1a7beccdb861"
        });
    }

    async initializeLLM() {
        const tokenResponse = await this.credentials.getToken("api://2a459df9-d8e1-43e0-998e-320abbe581d0/token");
        console.log('LangChainService Token Debug:', {
            timestamp: new Date().toISOString(),
            tokenAvailable: !!tokenResponse.token,
            tokenLength: tokenResponse.token.length,
            tokenExpiration: tokenResponse.expiresOnTimestamp,
            token: tokenResponse.token,
        });
        
        console.log('LangChainService Config Debug:', {
            timestamp: new Date().toISOString(),
            basePath: "https://openai.work.iqvia.com/cse/prod/proxy/azure/Qwen2-72B-Instruct-vllm",
            modelName: "Qwen2-72B-Instruct-vllm",
            apiVersion: "2023-08-01-preview"
        
        });

        this.llm = new ChatOpenAI({
            modelName: "Qwen2-72B-Instruct-vllm",
            openAIApiKey: tokenResponse.token,
            configuration: {
                basePath: "https://openai.work.iqvia.com/cse/prod/proxy/azure/Qwen2-72B-Instruct-vllm",
                baseOptions: {
                    headers: {
                        'Authorization': `Bearer ${tokenResponse.token}`,
                        'api-version': "2023-08-01-preview"
                    }
                }
            }
        });
    }

    async execute(messages) {
        if (!this.llm) {
            await this.initializeLLM();
        }

        console.log('LangChainService Execute Debug:', {
            timestamp: new Date().toISOString(),
            messageCount: messages.length,
            messageTypes: messages.map(m => m.role),
            llmInitialized: !!this.llm
        });

        const response = await this.llm.call(messages);
        
        console.log('LangChainService Response Debug:', {
            timestamp: new Date().toISOString(),
            responseReceived: !!response,
            responseType: typeof response,
            responseStructure: Object.keys(response),
            llm: this.llm
        });

        return response;
    }
}

module.exports = new LangChainService();