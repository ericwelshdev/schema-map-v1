import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import ResourceWizard from '../components/ResourceWizard';

const NewTarget = () => {

  localStorage.removeItem('resourceConfig');
  
  return (
    <Box sx={{ width: '100%', padding: '24px' }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/targets">Targets</Link>
        <Typography color="textPrimary">New Target</Typography>
      </Breadcrumbs>
  
     <Box sx={{ ml:-3}}>
      <ResourceWizard  />
</Box>
    </Box>
  );
};

export default NewTarget;
