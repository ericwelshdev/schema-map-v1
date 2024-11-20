export class EventHandlerService {
  constructor() {
    this.subscribers = new Map();
  }

  subscribe(eventType, handler) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType).add(handler);
    
    return () => this.unsubscribe(eventType, handler);
  }

  unsubscribe(eventType, handler) {
    const handlers = this.subscribers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  emit(eventType, data) {
    const handlers = this.subscribers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

export const mappingEvents = {
  MAPPING_UPDATED: 'mapping:updated',
  VALIDATION_COMPLETED: 'validation:completed',
  TRANSFORMATION_APPLIED: 'transformation:applied',
  SELECTION_CHANGED: 'selection:changed'
};

export default new EventHandlerService();
