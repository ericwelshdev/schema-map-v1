import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const ResourceDataPreview = ({ schema, resourceData, fileInfo, sampleData }) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderGeneralInfo = () => (
    <Box>
      <Typography variant="h6">File Information</Typography>
      {fileInfo && (
        <>
          <Typography>Name: {fileInfo.name}</Typography>
          <Typography>Type: {fileInfo.type}</Typography>
          <Typography>Size: {fileInfo.size} bytes</Typography>
          <Typography>Last Modified: {fileInfo.lastModified}</Typography>
        </>
      )}
    </Box>
  );

  const schemaColumns = [
    { field: 'name', headerName: 'Column Name', flex: 1 },
    { field: 'type', headerName: 'Data Type', flex: 1 },
  ];

  const renderSchema = () => (
    schema ? (
      <DataGrid
        rows={schema.map((col, index) => ({ id: index, ...col }))}
        columns={schemaColumns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        autoHeight
      />
    ) : (
      <Typography>No schema available</Typography>
    )
  );

  const sampleDataColumns = schema ? schema.map(col => ({
    field: col.name,
    headerName: col.name,
    flex: 1,
  })) : [];

  const renderSampleData = () => (
    sampleData ? (
      <DataGrid
        rows={sampleData.map((row, index) => ({ id: index, ...row }))}
        columns={sampleDataColumns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        autoHeight
      />
    ) : (
      <Typography>No sample data available</Typography>
    )
  );

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="General" />
        <Tab label="Schema" />
        <Tab label="Sample Data" />
      </Tabs>
      <Box sx={{ p: 3, height: 400 }}>
        {tabValue === 0 && renderGeneralInfo()}
        {tabValue === 1 && renderSchema()}
        {tabValue === 2 && renderSampleData()}
      </Box>
    </Box>
  );
};

export default ResourceDataPreview;
