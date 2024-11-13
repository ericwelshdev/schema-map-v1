
class AIServiceRegistry {
    constructor() {
        this.services = new Map();
    }

    registerService(serviceName, serviceInstance) {
        this.services.set(serviceName, serviceInstance);
    }

    getService(serviceName) {
        return this.services.get(serviceName);
    }
}

module.exports = new AIServiceRegistry();
