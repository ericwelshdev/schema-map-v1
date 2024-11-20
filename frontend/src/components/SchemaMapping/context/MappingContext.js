import React, { createContext, useContext, useReducer } from 'react';

const MappingContext = createContext();

const initialState = {
  mappings: new Map(),
  selectedColumns: [],
  validationResults: new Map(),
  transformations: new Map(),
  activeDialog: null
};

const mappingReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_MAPPING':
      const newMappings = new Map(state.mappings);
      newMappings.set(action.payload.sourceId, action.payload);
      return { ...state, mappings: newMappings };
      
    case 'SET_SELECTED_COLUMNS':
      return { ...state, selectedColumns: action.payload };
      
    case 'UPDATE_VALIDATION':
      const newValidations = new Map(state.validationResults);
      newValidations.set(action.payload.id, action.payload.results);
      return { ...state, validationResults: newValidations };
      
    case 'SET_ACTIVE_DIALOG':
      return { ...state, activeDialog: action.payload };
      
    default:
      return state;
  }
};

export const MappingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mappingReducer, initialState);

  return (
    <MappingContext.Provider value={{ state, dispatch }}>
      {children}
    </MappingContext.Provider>
  );
};

export const useMappingContext = () => {
  const context = useContext(MappingContext);
  if (!context) {
    throw new Error('useMappingContext must be used within a MappingProvider');
  }
  return context;
};
