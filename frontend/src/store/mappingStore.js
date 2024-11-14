import { create } from 'zustand';

export const useMappingStore = create((set) => ({
  sourceSchema: [],
  targetSchema: [],
  mappings: new Map(),
  
  setSourceSchema: (schema) => set({ sourceSchema: schema }),
  setTargetSchema: (schema) => set({ targetSchema: schema }),
  
  updateMapping: (mapping) => set((state) => {
    const newMappings = new Map(state.mappings);
    newMappings.set(mapping.sourceId, {
      targetId: mapping.targetId,
      confidence: mapping.confidence,
      manual: mapping.manual
    });
    return { mappings: newMappings };
  }),
  
  removeMapping: (sourceId) => set((state) => {
    const newMappings = new Map(state.mappings);
    newMappings.delete(sourceId);
    return { mappings: newMappings };
  }),
  
  clearMappings: () => set({ mappings: new Map() })
}));
