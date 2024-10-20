import React, { useState, useCallback } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Alert } from '@mui/material';
import { Upload } from 'lucide-react';
import { detectFileType, autoDetectSettings, generateSchema } from '../utils/fileUtils';
import { getConfigForResourceType } from '../utils/ingestionConfig';
import ResourceIngestionSettings from './ResourceIngestionSettings';

const ResourceFileIngestionSetup = ({ ingestionConfig, onConfigChange }) => {
  const [state, setState] = useState({
    loading: false,
    progress: 0,
    showIngestionSettings: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileTypes = [".txt", ".csv", ".xls", ".xlsx", ".json", ".xml", ".parquet", ".snappy", ".hive"];


  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (typeof onUpload === 'function') {
      handleFileUpload(selectedFile);
    }
  };


  const updateState = useCallback((newState) => {
    console.log('Updating state:', newState);
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  const processFile = useCallback(async (file, settings) => {
    console.log('Processing file:', file.name);
    updateState({ loading: true, progress: 0 });

    try {
      const fileType = await detectFileType(file);
      console.log('Detected file type:', fileType);
      updateState({ progress: 20 });

      const autoDetectedSettings = await autoDetectSettings(file, fileType);
      console.log('Auto-detected settings:', autoDetectedSettings);
      updateState({ progress: 40 });

      const newConfig = getConfigForResourceType(fileType);
      console.log('New config:', newConfig);
      updateState({ progress: 60 });
      
      const combinedSettings = {
        ...newConfig,
        ...autoDetectedSettings,
        ...settings
      };
      console.log('Combined settings:', combinedSettings);

      const schemaResult = await generateSchema(file, combinedSettings);
      console.log('Schema result:', schemaResult);
      updateState({ progress: 80 });
      
      updateState({
        loading: false,
        progress: 100,
        uploadStatus: { type: 'success', message: 'File successfully ingested.' },
        config: newConfig,
        ingestionSettings: combinedSettings,
        schema: schemaResult.schema,
        sourceSchema: schemaResult.schema,        
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: new Date(file.lastModified).toLocaleString(),
        },
        sampleData: schemaResult.sampleData,
        rawData: schemaResult.rawData,
        expandedAccordion: 'data',
        showIngestionSettings: true
      });
      console.log('File processing completed successfully');
      
    } catch (error) {
      console.error('Error processing file:', error);
      updateState({
        loading: false,
        uploadStatus: { type: 'error', message: error.message }
      });
    }
  }, [updateState]);

  const handleFileUpload = (file) => {
    console.log('File upload initiated:', file.name);
    processFile(file);
  };

  return (
    <Box sx={{ '& > *': {mt:-4 } }}>
     <Card>
        <CardContent>
        <Typography variant="h6" component="div" >
          <Upload style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          File Upload
        </Typography>
          <input
            accept={fileTypes}
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
          <label htmlFor="raised-button-file">
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
                alignItems: 'center',
                padding: 3,
                cursor: 'pointer',
              }}
            >
              <Upload size={48} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Click to upload or drag and drop
              </Typography>
              <Typography variant="body2" color="textSecondary">
              {fileTypes}
              </Typography>
            </Card>
          </label>
        </CardContent>
      </Card>
      {state.loading && <LinearProgress variant="determinate" value={state.progress} sx={{ mt: 2, mb: 2 }} />}
      {state.uploadStatus && (
        <Alert severity={state.uploadStatus.type} sx={{ mt: 2, mb: 2 }}>
          {state.uploadStatus.message}
        </Alert>
      )}
      {state.showIngestionSettings && (
        <ResourceIngestionSettings
          ingestionConfig={state.ingestionSettings}
          onConfigChange={onConfigChange}
        />
      )}
    </Box>
  );
};

export default ResourceFileIngestionSetup;