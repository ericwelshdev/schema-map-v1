import React, { createContext, useState, useContext } from 'react';

const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
  const [sharedState, setSharedState] = useState({
    sourceSchema: null,
    dataDictionarySchema: null,
    // Add other shared properties here
  });

  const updateSharedState = (newState) => {
    setSharedState(prevState => ({ ...prevState, ...newState }));
  };

  return (
    <ResourceContext.Provider value={{ sharedState, updateSharedState }}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResourceContext = () => useContext(ResourceContext);
