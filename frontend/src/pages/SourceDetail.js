// frontend/src/components/pages/SourceDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Box, Breadcrumbs, Card, Tabs, Tab, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import { analyzeSource } from '../services/aiService';

const SourceDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [activeTab, setActiveTab] = useState('schema');
  const [subTab, setSubTab] = useState('grid');
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    // Fetch source details using the id
    // Update the item state
  }, [id]);

  useEffect(() => {
    // const fetchAiAnalysis = async () => {
    //   if (item) {
    //     const analysis = await analyzeSource(item);
    //     setAiAnalysis(analysis);
    //   }
    // };
    // fetchAiAnalysis();
  }, [item]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'schema':
        return renderSchemaTab();
      case 'dataDictionary':
        return renderDataDictionaryTab();
      case 'dataProfiling':
        return renderDataProfilingTab();
      case 'mappings':
        return renderMappingsTab();
      case 'preview':
        return renderPreviewTab();
      default:
        return null;
    }
  };
    const renderSchemaTab = () => {
      const columns = [
        { field: 'columnName', headerName: 'Column Name', width: 150 },
        { field: 'dataType', headerName: 'Data Type', width: 120 },
        { field: 'length', headerName: 'Length', width: 100 },
        { field: 'nullable', headerName: 'Nullable', width: 100 },
        { field: 'primaryKey', headerName: 'Primary Key', width: 120 },
        { field: 'foreignKey', headerName: 'Foreign Key', width: 120 },
        { field: 'uniqueKey', headerName: 'Unique Key', width: 120 },
        { field: 'defaultValue', headerName: 'Default Value', width: 120 },
        { field: 'description', headerName: 'Description', width: 200 },
      ];

      return (
        <Box>
          <Tabs value={subTab} onChange={(e, newValue) => setSubTab(newValue)}>
            <Tab label="Grid" value="grid" />
            <Tab label="View" value="view" />
            <Tab label="Edit" value="edit" />
          </Tabs>
          {subTab === 'grid' && item && item.columns && (
            <DataGrid
              rows={item.columns}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              checkboxSelection
              disableSelectionOnClick
            />
          )}
          {/* Implement View and Edit sub-tabs */}
        </Box>
      );
    };
  const renderDataDictionaryTab = () => (
    <Typography>Data Dictionary tab content</Typography>
  )

  const renderDataProfilingTab = () => (
    <Typography>Data Profiling tab content</Typography>
  )

  const renderMappingsTab = () => (
    <Typography>Mappings tab content</Typography>
  )

  const renderPreviewTab = () => (
    <Typography>Preview tab content</Typography>
  )

  return (
    <Container>
      <Breadcrumbs aria-label="breadcrumb">
        {/* Add breadcrumb items */}
      </Breadcrumbs>
      <Divider />
      <Card>
        <Box p={2}>
          <Typography variant="h4">{item?.name}</Typography>
          <Typography>Type: {item?.type}</Typography>
          <Typography>Columns: {item?.columns?.length || 0}</Typography>
          <Typography>Rows: {item?.rowCount || 'N/A'}</Typography>
          {/* Add more high-level details */}
        </Box>
      </Card>
      <Divider />
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Schema" value="schema" />
        <Tab label="Data Dictionary" value="dataDictionary" />
        <Tab label="Data Profiling" value="dataProfiling" />
        <Tab label="Mappings" value="mappings" />
        <Tab label="Preview" value="preview" />
      </Tabs>
      {renderTabContent()}
      {aiAnalysis && (
        <Box mt={2}>
          <Typography variant="h6">AI Analysis</Typography>
          {/* Display AI analysis results */}
        </Box>
      )}
    </Container>
  );
};

export default SourceDetail;
