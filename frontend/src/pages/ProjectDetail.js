// src/components/ProjectDetail.js
import React, { useState, useCallback } from 'react';
import { Box, Tabs, Tab, IconButton } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import ProjectSidebar from '../components/ProjectSidebar';
import SourceDetail from './SourceDetail';
import Sources from './Sources';
import DataDictionaryDetail from './DataDictionaryDetail';
import TaskTab from '../components/TaskTab';

const mockProjectData = {
  id: 1,
  name: 'Sample Project',
  assignedTarget: 'Target Schema 1',
  sources: {
    files: [
      {
        id: 1,
        name: 'data.csv',
        columns: [
          { id: 1, name: 'id', type: 'number' },
          { id: 2, name: 'name', type: 'string' },
          { id: 3, name: 'desc', type: 'string' },
          { id: 4, name: 'create_dt', type: 'date' },
          { id: 5, name: 'phi_ind', type: 'boolean' },
        ]
      },
      {
        id: 2,
        name: 'info.xlsx',
        columns: [
          { id: 1,
            name: 'id', type: 'number' },
          { id: 2, name: 'name', type: 'string' },
        ]
      },
    ],
    databases: [
      {
        id: 1,
        name: 'UserDB',
        tables: [
          {
            id: 1,
            name: 'users',
            columns: [
              { id: 1, name: 'user_id', type: 'number' },
              { id: 2, name: 'username', type: 'string' },
              { id: 3, name: 'email', type: 'string' },
            ]
          },
          {
            id: 2,
            name: 'orders',
            columns: [
              { id: 1, name: 'order_id', type: 'number' },
              { id: 2, name: 'user_id', type: 'number' },
              { id: 3, name: 'order_date', type: 'date' },
            ]
          }
        ]
      },
    ],
    apis: [
      {
        id: 1,
        name: 'Weather API',
        endpoints: [
          { id: 1, name: '/current', method: 'GET' },
          { id: 2, name: '/forecast', method: 'GET' },
        ]
      },
    ],
  },
  targets: [
    { id: 1, name: 'Target Schema 1' },
    { id: 2, name: 'Target Schema 2' },
  ],
  dataDictionaries: [
    { id: 1, name: 'Main Dictionary' },
    { id: 2, name: 'Secondary Dictionary' },
  ],
};

const ProjectDetail = () => {
  const [project, setProject] = useState(mockProjectData);
  const [tabs, setTabs] = useState([{ id: 'task', label: 'Tasks', content: <TaskTab project={project} /> }]);
  const [activeTab, setActiveTab] = useState("task");
  const [expandedItems, setExpandedItems] = useState({});
  // const [sidebarWidth, setSidebarWidth] = useState(300);
  // const [isDragging, setIsDragging] = useState(false);

  // const handleMouseDown = useCallback(() => {
  //   setIsDragging(true);
  // }, []);

  // const handleMouseUp = useCallback(() => {
  //   setIsDragging(false);
  // }, []);

  // const handleMouseMove = useCallback((e) => {
  //   if (isDragging) {
  //     setSidebarWidth(e.clientX);
  //   }
  // }, [isDragging]);

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTabClose = (tabId) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    setActiveTab(newTabs[0]?.id || "task");
  };

  const openOrNavigateToTab = (tabId, label, content) => {
    const existingTabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (existingTabIndex !== -1) {
      setActiveTab(tabId);
    } else {
      setTabs(prevTabs => [...prevTabs, { id: tabId, label, content }]);
      setActiveTab(tabId);
    }
  };

  const handleItemSelect = (item, type) => {
    switch (type) {
      case 'sources':
        openOrNavigateToTab('sources', 'All Sources', <Sources />);
        break;
      case 'files':
        openOrNavigateToTab('files', 'Files', <Sources filter="files" />);
        break;
      case 'databases':
        openOrNavigateToTab('databases', 'Databases', <Sources filter="databases" />);
        break;
      case 'apis':
        openOrNavigateToTab('apis', 'APIs', <Sources filter="apis" />);
        break;
      case 'file':
      case 'database':
      case 'api':
      case 'column':
        openOrNavigateToTab(`source-${item.id}`, item.name, <SourceDetail item={item} type={type} />);
        break;
      default:
        console.log('Unhandled item type:', type);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        height: '100vh',
        width: '100%',
        position: 'relative',
      }}
      // onMouseMove={handleMouseMove}
      // onMouseUp={handleMouseUp}
    >
 
        <ProjectSidebar 
          project={project}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
          onItemSelect={handleItemSelect}
        />
    
      {/* <Box
        sx={{
          width: '5px',
          backgroundColor: '#ccc',
          cursor: 'col-resize',
          '&:hover': { backgroundColor: '#999' },
        }}
        onMouseDown={handleMouseDown}
      /> */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {tab.label}
                  {tab.id !== 'task' && (
                    <IconButton size="small" onClick={() => handleTabClose(tab.id)}>
                      <Close fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              }
              value={tab.id}
            />
          ))}
          <Tab icon={<Add />} onClick={() => {/* Logic to add a new tab */}} />
        </Tabs>
        {tabs.map((tab) => (
          <Box key={tab.id} hidden={activeTab !== tab.id} sx={{ flexGrow: 1, overflow: 'auto' }}>
            {tab.content}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProjectDetail;
