const langChainService = require('../services/aiServices/langChainService');
const serviceRegistry = require('../services/aiServices/serviceRegistry');

const getCompletion = async (req, res) => {
    const { messages, task, options } = req.body;
    
    try {
        // Get the appropriate service based on task type
        const service = serviceRegistry.getService(task);
        const response = await service.execute(messages, options);
        
        res.json(response);
    } catch (error) {
        console.error('AI completion error:', error);
        res.status(500).json({ 
            error: 'Failed to get AI completion',
            details: error.message 
        });
    }
};

module.exports = {
    getCompletion
};

