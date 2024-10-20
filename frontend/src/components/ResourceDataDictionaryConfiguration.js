import React, { useState, useCallback, useMemo } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResourceFileIngestionSetup from './ResourceFileIngestionSetup';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import ResourceDataPreview from './ResourceDataPreview';
import { processFile } from '../utils/fileUtils';

const ResourceDataDictionaryConfiguration = ({ sourceProps, onStateChange }) => {
  const [dataDictionaryConfig, setDataDictionaryConfig] = useState({
    expandedAccordion: 'ingestionSetup',
    ddFileInfo: null,
    ddSchema: null,
    ddSampleData: null,
    ddRawData: null,
    ddIngestionSettings: {},
    uploadStatus: null,
  });

  const handleConfigChange = useCallback((updates) => {
    setDataDictionaryConfig(prevConfig => {
      const newConfig = { ...prevConfig, ...updates };
      onStateChange(newConfig);
      return newConfig;
    });
  }, [onStateChange]);

  const handleAccordionChange = useCallback((panel) => (event, isExpanded) => {
    handleConfigChange({ expandedAccordion: isExpanded ? panel : false });
  }, [handleConfigChange]);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) {
      handleConfigChange({
        uploadStatus: { type: 'error', message: 'No file provided' },
        expandedAccordion: 'ingestionSetup'
      });
      return;
    }

    try {
      const result = await processFile(file, {}, true);
      
      if (result.schema && result.sampleData && result.rawData) {
        handleConfigChange({
          ddFileInfo: result.fileInfo,
          ddSchema: result.schema,
          ddSampleData: result.sampleData,
          ddRawData: result.rawData,
          ddIngestionSettings: result.ingestionSettings,
          expandedAccordion: 'ingestionSettings',
          uploadStatus: { type: 'success', message: 'File processed successfully' }
        });
      } else {
        throw new Error('Invalid result from file processing');
      }
    } catch (error) {
      handleConfigChange({
        uploadStatus: { type: 'error', message: `Error processing file: ${error.message}` },
        expandedAccordion: 'ingestionSetup'
      });
    }
  }, [handleConfigChange]);

  const memoizedIngestionConfig = useMemo(() => ({
    ingestionConfig: dataDictionaryConfig.ddIngestionSettings,
    ingestionAppliedProperties: {}
  }), [dataDictionaryConfig.ddIngestionSettings]);

  return (
    <Box sx={{ '& > *': { mb: '1px' } }}>
      {dataDictionaryConfig.uploadStatus && (
        <Alert severity={dataDictionaryConfig.uploadStatus.type} sx={{ mb: 2 }}>
          {dataDictionaryConfig.uploadStatus.message}
        </Alert>
      )}
      <Accordion 
        expanded={dataDictionaryConfig.expandedAccordion === 'ingestionSetup'}
        onChange={handleAccordionChange('ingestionSetup')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Data Dictionary File Ingestion Setup
        </AccordionSummary>
        <AccordionDetails>
          <ResourceFileIngestionSetup onConfigChange={handleFileUpload} />
        </AccordionDetails>
      </Accordion>

     
        <Accordion 
          expanded={dataDictionaryConfig.expandedAccordion === 'ingestionSettings'} 
          onChange={handleAccordionChange('ingestionSettings')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Data Dictionary Ingestion Settings
          </AccordionSummary>
          <AccordionDetails>
          {dataDictionaryConfig.ddSchema && (
            <ResourceIngestionSettings
              ingestionConfig={memoizedIngestionConfig}
              onConfigChange={(updates) => handleConfigChange({ ddIngestionSettings: updates })}
            />
          )}
          </AccordionDetails>
        </Accordion>
      

      
        <Accordion 
          expanded={dataDictionaryConfig.expandedAccordion === 'data'} 
          onChange={handleAccordionChange('data')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Data Dictionary Preview
          </AccordionSummary>
          <AccordionDetails>
          {dataDictionaryConfig.ddSchema && (
            <ResourceDataPreview
              schema={dataDictionaryConfig.ddSchema}
              sampleData={dataDictionaryConfig.ddSampleData}
              rawData={dataDictionaryConfig.ddRawData}
              fileInfo={dataDictionaryConfig.ddFileInfo}
            />
          )}
          </AccordionDetails>
        </Accordion>
    
    </Box>
  );
};

export default ResourceDataDictionaryConfiguration;