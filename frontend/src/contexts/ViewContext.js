import React, { createContext, useState, useContext } from 'react';

const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
  const [projectsView, setProjectsView] = useState('card');
  const [footerAlert, setFooterAlert] = useState(null);

  const value = {
    projectsView,
    setProjectsView,
    footerAlert,
    setFooterAlert: (alert) => {
      setFooterAlert(alert);
      // Auto clear after 10 seconds
      setTimeout(() => setFooterAlert(null), 10000);
    }
  };

  return (
    <ViewContext.Provider value={value}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => useContext(ViewContext);
