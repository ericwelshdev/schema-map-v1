import React from 'react';
import { Box, Tabs, Tab, Typography, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const ResourceDataPreview = ({ schema, resourceData, fileInfo, sampleData, rawData }) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderGeneralInfo = () => (
    <Box>
      <Typography variant="h6">File Information</Typography>
      {fileInfo && (
        <>
          <Typography variant="body2">Name: {fileInfo.name}</Typography>
          <Typography variant="body2">Type: {fileInfo.type}</Typography>
          <Typography variant="body2">Size: {fileInfo.size} bytes</Typography>
          <Typography variant="body2">Last Modified: {fileInfo.lastModified}</Typography>
        </>
      )}
    </Box>
  );

  const schemaColumns = [
    { field: 'name', headerName: 'Column Name', flex: 1 },
    { field: 'type', headerName: 'Data Type', flex: 1 },
    { field: 'order', headerName: 'Column Order', flex: 1 },
    { field: 'comment', headerName: 'Comment', flex: 1 },
  ];

  const renderSchema = () => (
    schema ? (
      <Box sx={{ height: 400, width: '100%', overflow: 'auto' }}>
        <DataGrid
          rows={schema.map((col, index) => ({ id: index, ...col, order: index + 1 }))}
          columns={schemaColumns}          
          autoPageSize
          rowsPerPageOptions={[10, 25, 50]}
          density="compact"
          autosizeOptions={{ columns: schema.map(col => col.name) }}
        />
      </Box>
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
      <Box sx={{ height: 400, width: '100%', overflow: 'auto' }}>
        <DataGrid
          rows={sampleData.map((row, index) => ({ id: index, ...row }))}
          columns={schema.map(col => ({
            field: col.name,
            headerName: col.name,
            flex: 1,
          }))}
          autoPageSize
          rowsPerPageOptions={[10, 25, 50]}
          columnHeaderHeight={40}
          rowHeight={40}
          density="compact"
          autosizeOptions={{ columns: schema.map(col => col.name) }}
          disableExtendRowFullWidth ={false}
        />
      </Box>
    ) : (
      <Typography>No sample data available</Typography>
    )
  );

  const renderRawData = () => (
    <TextField
      multiline
      fullWidth
      rows={15}
      size="small"
      value={rawData || ''}
      variant="outlined"
      InputProps={{
        readOnly: true,
      }}
    />
  );

  return (
    <Box sx={{mt:-3, ml: -2 }}>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="General"  />
        <Tab label="Schema" />
        <Tab label="Sample Data" />
        <Tab label="Raw Data" />
      </Tabs>
      <Box sx={{ml:-1, mt:-1, p: 2 }}>
        {tabValue === 0 && renderGeneralInfo()}
        {tabValue === 1 && renderSchema()}
        {tabValue === 2 && renderSampleData()}
        {tabValue === 3 && renderRawData()}
      </Box>
    </Box>
  );
};

export default ResourceDataPreview;
