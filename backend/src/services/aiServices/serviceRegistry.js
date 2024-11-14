  const langChainService = require('./langChainService');

  class ServiceRegistry {
      constructor() {
          this.services = {
              'default': langChainService,
              'classification': langChainService
          };
      }

      getService(task = 'default') {
          return this.services[task] || this.services.default;
      }
  }

  module.exports = new ServiceRegistry();