import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import ResourceWizard from '../components/ResourceDataDictionaryWizard';

const NewDataDictionary = () => {

  localStorage.removeItem('resourceConfig');
  
  return (
    <Box sx={{ width: '100%', padding: '24px' }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/">Home</Link>
        <Link color="inherit" href="/data-dictionaries">Data Dictionary</Link>
        <Typography color="textPrimary">New Data Dictionary</Typography>
      </Breadcrumbs>
  
     <Box sx={{ ml:-3}}>
      <ResourceWizard  />
</Box>
    </Box>
  );
};

export default NewDataDictionary;
