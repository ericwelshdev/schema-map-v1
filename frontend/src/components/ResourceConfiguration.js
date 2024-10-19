import React, { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Button, Alert, LinearProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResourceFileUpload from './ResourceFileUpload';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import ResourceDataPreview from './ResourceDataPreview';
import ResourceSummary from './ResourceSummary';
import { detectFileType, autoDetectSettings, generateSchema } from '../utils/fileUtils';
import { getConfigForResourceType } from '../utils/ingestionConfig';

const ResourceConfiguration = ({ savedState = {}, onStateChange }) => {
  const [state, setState] = useState({
    resourceType: savedState.resourceType || '',
    expandedAccordion: savedState.expandedAccordion || 'fileUpload',
    loading: false,
    progress: 0,
    uploadStatus: null,
    config: savedState.config || {},
    ingestionSettings: savedState.ingestionSettings || {},
    schema: null,
    fileInfo: null,
    sampleData: null,
    rawData: null,
    currentFile: null,
    dataDictionary: null,
    ...savedState
  });

  useEffect(() => {
    if (state.resourceType) {
      const defaultConfig = getConfigForResourceType(state.resourceType);
      setState(prevState => ({
        ...prevState,
        config: defaultConfig,
        ingestionSettings: { ...defaultConfig, ...prevState.ingestionSettings }
      }));
    }
  }, [state.resourceType]);

  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setState(prevState => ({ ...prevState, expandedAccordion: isExpanded ? panel : false }));
  };

  const processFile = async (file, settings) => {
    setState(prevState => ({ ...prevState, loading: true, progress: 0 }));
    try {
      const fileType = await detectFileType(file);
      const autoDetectedSettings = await autoDetectSettings(file, fileType);
      const newConfig = getConfigForResourceType(fileType);
      
      const combinedSettings = {
        ...newConfig,
        ...autoDetectedSettings,
        ...settings
      };

      const schemaResult = await generateSchema(file, combinedSettings);
      
      setState(prevState => ({
        ...prevState,
        loading: false,
        progress: 100,
        uploadStatus: { type: 'success', message: 'File successfully ingested.' },
        config: newConfig,
        ingestionSettings: combinedSettings,
        schema: schemaResult.schema,
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: new Date(file.lastModified).toLocaleString(),
        },
        sampleData: schemaResult.sampleData,
        rawData: schemaResult.rawData,
        expandedAccordion: 'data'
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        uploadStatus: { type: 'error', message: error.message }
      }));
    }
  };

  const handleFileUpload = async (file) => {
    setState(prevState => ({ ...prevState, currentFile: file }));
    const fileType = await detectFileType(file);
    const detectedSettings = await autoDetectSettings(file, fileType);
    
    const newConfig = getConfigForResourceType(fileType);
    
    const defaultSettings = Object.entries(newConfig).reduce((acc, [key, value]) => {
      acc[value.uiField] = detectedSettings[value.uiField] ?? value.default;
      return acc;
    }, {});

    if (fileType === 'excel' && detectedSettings.sheetNames) {
      defaultSettings.sheetSelection = detectedSettings.sheetNames[0];
    }

    await processFile(file, defaultSettings);
  };

  const handleApplyChanges = async () => {
    if (state.currentFile) {
      await processFile(state.currentFile, state.ingestionSettings);
    }
  };

  const handleSettingChange = (field, value) => {
    setState(prevState => ({
      ...prevState,
      ingestionSettings: { ...prevState.ingestionSettings, [field]: value }
    }));
  };

  return (
    <Box sx={{ '& > *': { mb: '1px' } }}>
      <ResourceFileUpload onUpload={handleFileUpload} type={state.resourceType} />
      
      {state.loading && <LinearProgress variant="determinate" value={state.progress} />}

      {state.uploadStatus && (
        <Alert severity={state.uploadStatus.type} sx={{ mt: '1px', mb: '1px' }}>
          {state.uploadStatus.message}
        </Alert>
      )}

      <Accordion 
        expanded={state.expandedAccordion === 'ingestionSettings'} 
        onChange={handleAccordionChange('ingestionSettings')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Source Ingestion Settings
        </AccordionSummary>
        <AccordionDetails>
          <ResourceIngestionSettings 
            config={state.config}
            ingestionSettings={state.ingestionSettings}
            onSettingChange={handleSettingChange}
          />
          <Button onClick={handleApplyChanges} variant="contained" color="primary" sx={{ mt: 2 }}>
            Apply Changes
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={state.expandedAccordion === 'data'} 
        onChange={handleAccordionChange('data')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Data
        </AccordionSummary>
        <AccordionDetails>
          <ResourceDataPreview 
            schema={state.schema} 
            resourceData={state}
            fileInfo={state.fileInfo}
            sampleData={state.sampleData}
            rawData={state.rawData}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={state.expandedAccordion === 'summary'} 
        onChange={handleAccordionChange('summary')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Summary
        </AccordionSummary>
        <AccordionDetails>
          {/* <ResourceSummary 
            resourceData={state} 
            ingestionSettings={state.ingestionSettings} 
            schema={state.schema}
            dataDictionary={state.dataDictionary}
          /> */}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ResourceConfiguration;