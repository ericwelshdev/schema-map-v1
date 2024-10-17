import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import ResourceFileUpload from './ResourceFileUpload';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import ResourceDataPreview from './ResourceDataPreview';
import ResourceSummary from './ResourceSummary';

const ResourceConfiguration = ({ resourceData }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Resource Upload" />
        <Tab label="Resource Ingestion Settings" />
        <Tab label="Resource Data Preview" />
        <Tab label="Resource Summary" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {tabValue === 0 && <ResourceFileUpload type={resourceData.resourceType} />}
        {tabValue === 1 && <ResourceIngestionSettings resourceData={resourceData} />}
        {tabValue === 2 && <ResourceDataPreview resourceData={resourceData} />}
        {tabValue === 3 && <ResourceSummary resourceData={resourceData} />}
      </Box>
    </Box>
  );
};

export default ResourceConfiguration;
