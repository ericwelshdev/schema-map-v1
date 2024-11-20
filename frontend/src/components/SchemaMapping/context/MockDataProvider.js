import React, { createContext, useContext } from 'react';
import * as mockData from '../mockData/schemaMappingData';

const MockDataContext = createContext();

export const MockDataProvider = ({ children }) => {
  return (
    <MockDataContext.Provider value={mockData}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => useContext(MockDataContext);
