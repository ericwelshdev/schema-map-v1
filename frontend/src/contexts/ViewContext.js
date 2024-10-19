import React, { createContext, useState, useContext } from 'react';

const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
  const [projectsView, setProjectsView] = useState('card');

  return (
    <ViewContext.Provider value={{ projectsView, setProjectsView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => useContext(ViewContext);
