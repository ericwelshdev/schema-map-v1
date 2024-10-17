import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import ResourceWizard from '../components/ResourceWizard';

const NewSource = () => {
  return (
    <Box sx={{ width: '100%', padding: '24px' }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/sources">Sources</Link>
        <Typography color="textPrimary">New Source</Typography>
      </Breadcrumbs>
  
      
      <ResourceWizard />
    </Box>
  );
};

export default NewSource;
