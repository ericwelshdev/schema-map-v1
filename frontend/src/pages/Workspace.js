// frontend/src/components/pages/Workspace.js

import React, { useEffect } from 'react';
import { Tabs, Tab, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from 'react-router-dom';
import ProjectDetail from './ProjectDetail';
import { useWorkspace } from '../contexts/WorkspaceContext';

const Workspace = () => {
  const location = useLocation();
  const { tabs, activeTab, setActiveTab, addTab, closeTab } = useWorkspace();

  useEffect(() => {
    if (location.state && location.state.project) {
      addTab(location.state.project);
    }
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseTab = (event, index) => {
    event.stopPropagation();
    closeTab(index);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        {tabs.map((tab, index) => (
          <Tab
            key={tab.proj_id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {tab.proj_nm}
                <IconButton size="small" onClick={(e) => handleCloseTab(e, index)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
          />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <Box key={tab.proj_id} hidden={activeTab !== index}>
          {activeTab === index && <ProjectDetail project={tab} index={index} />}
        </Box>
      ))}
    </Box>
  );
};

export default Workspace;
