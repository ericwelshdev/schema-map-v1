import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppHeader from './Header';
import Sidebar from './Sidebar';
import SplitFrame from '../SplitFrame';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader toggleSidebar={toggleSidebar} />
      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}>
        <Sidebar open={sidebarOpen} setSidebarOpen={setSidebarOpen}  />
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <SplitFrame />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;