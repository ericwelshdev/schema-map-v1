export const createMappingState = (initialData) => ({
  mappings: new Map(),
  history: [],
  metadata: new Map(),
  validations: new Map()
});

export const persistMappingState = async (state) => {
  const serializedState = {
    mappings: Array.from(state.mappings.entries()),
    metadata: Array.from(state.metadata.entries()),
    validations: Array.from(state.validations.entries())
  };
  
  await localStorage.setItem('mappingState', JSON.stringify(serializedState));
  return true;
};
