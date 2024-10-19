import React, { createContext, useContext, useState } from 'react';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const addTab = (project) => {
    setTabs(prevTabs => [...prevTabs, { ...project, isDirty: false }]);
    setActiveTab(tabs.length);
  };

  const updateTab = (index, updatedProject) => {
    setTabs(prevTabs => prevTabs.map((tab, i) => i === index ? { ...updatedProject, isDirty: true } : tab));
  };

  const closeTab = (index) => {
    setTabs(prevTabs => prevTabs.filter((_, i) => i !== index));
    setActiveTab(prev => (prev >= index ? Math.max(0, prev - 1) : prev));
  };

  return (
    <WorkspaceContext.Provider value={{ tabs, activeTab, setActiveTab, addTab, updateTab, closeTab }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
