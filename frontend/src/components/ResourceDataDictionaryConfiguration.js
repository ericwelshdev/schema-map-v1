import React, { useState, useCallback, useMemo } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Alert, Card, CardContent, Radio, RadioGroup, FormControlLabel, FormControl, Grid, Typography, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResourceFileIngestionSetup from './ResourceFileIngestionSetup';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import ResourceDataPreview from './ResourceDataPreview';
import DataDictionaryAssignment from './DataDictionaryAssignment';
import { FileText, Database, Globe } from 'lucide-react';

const ResourceDataDictionaryConfiguration = ({ sourceProps, onStateChange }) => {
  const [dataDictionaryConfig, setDataDictionaryConfig] = useState({
    mode: 'dd_new',
    expandedAccordion: 'ingestionSetup',
    ddFileInfo: null,
    ddSchema: null,
    ddSampleData: null,
    ddRawData: null,
    ddIngestionSettings: {},
    ddIngestionConfig: {},
    uploadStatus: null,
    error: null,
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
    const handleFileUpload = useCallback((fileData) => {
      if (!fileData) {
        handleConfigChange({
          uploadStatus: { type: 'error', message: 'No file data provided' },
          expandedAccordion: 'ingestionSetup'
        });
        return;
      }

      try {
        const { file, schema, sampleData, rawData, ingestionSettings, ingestionConfig } = fileData;
        console.log('File processing result:', fileData);
        // console.log('Result schema:', schema);
        // console.log('Result sampleData:', sampleData);
        // console.log('Result rawData:', rawData);
        // console.log('Result ingestionSettings:', ingestionSettings);
        // console.log('Result ingestionConfig:', ingestionConfig);

        if (fileData && schema && sampleData) {
          handleConfigChange({
            ddFileInfo: file,
            ddSchema: schema,
            ddSampleData: sampleData,
            ddRawData: rawData,
            ddIngestionSettings: ingestionSettings || {},
            ddIngestionConfig: ingestionConfig || {},
            expandedAccordion: 'ingestionSettings',
            uploadStatus: { type: 'success', message: 'File processed successfully' },
            error: null
          });
        } else {
          throw new Error('Invalid or incomplete result from file processing');
        }
      } catch (error) {
        console.error('File processing error:', error);
        handleConfigChange({
          uploadStatus: { type: 'error', message: `Error processing file: ${error.message}` },
          expandedAccordion: 'ingestionSetup',
          error: error.message
        });
      }
    }, [handleConfigChange]);  const handleExistingDictionarySelect = useCallback(async (selectedDictionary) => {
    if (!selectedDictionary) {
      handleConfigChange({
        uploadStatus: { type: 'error', message: 'No data dictionaries provided' },
        expandedAccordion: 'ingestionSetup'
      });
      return;
    }

    try {
      const result = []//await processFile(file, {}, true);
      
      if (result.schema && result.sampleData && result.rawData) {
        handleConfigChange({
          ddFileInfo: result.fileInfo,
          ddSchema: result.schema,
          ddSampleData: result.sampleData,
          ddRawData: result.rawData,
          ddIngestionSettings: result.ingestionSettings,
          ddIngestionConfig: result.ingestionConfig,          
          expandedAccordion: 'ingestionSettings',
          uploadStatus: { type: 'success', message: 'Data Dictionary processed successfully' },
          error: null
        });
      } else {
        throw new Error('Invalid result from Data Dictionary processing');
      }
    } catch (error) {
      handleConfigChange({
        uploadStatus: { type: 'error', message: `Error processing Data Dictionary: ${error.message}` },
        expandedAccordion: 'ingestionSetup',
        error: error.message
      });
    }
  }, [handleConfigChange]);


  const memoizedIngestionConfig = useMemo(() => ({
    ingestionSettings: dataDictionaryConfig.ddIngestionSettings,
    ingestionConfig: dataDictionaryConfig.ddIngestionConfig,
    ingestionAppliedProperties: {}
  }), [dataDictionaryConfig.ddIngestionConfig, dataDictionaryConfig.ddIngestionSettings]);

  const handleModeChange = (event) => {
    const newMode = event.target.value;
    handleConfigChange({ 
      mode: newMode,
      expandedAccordion: 'ingestionSetup',
      ddFileInfo: null,
      ddSchema: null,
      ddSampleData: null,
      ddRawData: null,
      ddIngestionSettings: {},
      ddIngestionConfig: {},
      uploadStatus: null,
      error: null
    });
  };




  return (
    <Box sx={{ '& > *': { mb: '1px' } }}>
      <Card sx={{ mb: -1 }}>
        <CardContent>
        <FormControl component="fieldset">
        <Grid item xs={5}>
            <Typography variant="subtitle1" gutterBottom>
              Choose Data Dictionary Option:
            </Typography>
            <RadioGroup
              aria-label="data-dictionary-option"
              name="data-dictionary-option"
              value={dataDictionaryConfig.mode}
              onChange={handleModeChange}
            >
              <Box display="flex" justifyContent="space-between">
                <FormControlLabel 
                  value="dd_new" 
                  control={<Radio />} 
                  label={
                    <Box display="flex" alignItems="center">
                      <FileText style={{ marginRight: '8px' }} />
                      Create New Data Dictionary
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="dd_existing" 
                  control={<Radio />} 
                  label={
                    <Box display="flex" alignItems="center">
                      <Database style={{ marginRight: '8px' }} />
                      Assign Existing Data Dictionary
                    </Box>
                  } 
                />
              </Box>
            </RadioGroup>
          </Grid>
          </FormControl>
        </CardContent>
      </Card>

      {dataDictionaryConfig.uploadStatus && (
        <Alert severity={dataDictionaryConfig.uploadStatus.type} sx={{ mb: 2 }}>
          {dataDictionaryConfig.uploadStatus.message}
        </Alert>
      )}

      {dataDictionaryConfig.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {dataDictionaryConfig.error}
        </Alert>
      )}

      
        <>

          <Accordion 
            expanded={dataDictionaryConfig.expandedAccordion === 'ingestionSetup'}
            onChange={handleAccordionChange('ingestionSetup')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Data Dictionary Setup
            </AccordionSummary>
            <AccordionDetails>
            {dataDictionaryConfig.mode === 'dd_new' && (
              <ResourceFileIngestionSetup onConfigChange={handleFileUpload} />
            )}
            {dataDictionaryConfig.mode === 'dd_existing' && (
              <DataDictionaryAssignment  onSelect={handleExistingDictionarySelect} />
            )}  
            </AccordionDetails>
          </Accordion>

          {dataDictionaryConfig.ddSchema && (
            <Accordion 
              expanded={dataDictionaryConfig.expandedAccordion === 'ingestionSettings'} 
              onChange={handleAccordionChange('ingestionSettings')}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Data Dictionary Ingestion Settings
              </AccordionSummary>
              <AccordionDetails>
                <ResourceIngestionSettings
                  ingestionConfig={memoizedIngestionConfig}
                  onConfigChange={(updates) => handleConfigChange({ ddIngestionSettings: updates })}
                />
              </AccordionDetails>
            </Accordion>
          )}

          {dataDictionaryConfig.ddSchema && (
            <Accordion 
              expanded={dataDictionaryConfig.expandedAccordion === 'data'} 
              onChange={handleAccordionChange('data')}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Data Dictionary Preview
              </AccordionSummary>
              <AccordionDetails>
                <ResourceDataPreview
                  schema={dataDictionaryConfig.ddSchema}
                  sampleData={dataDictionaryConfig.ddSampleData}
                  rawData={dataDictionaryConfig.ddRawData}
                  fileInfo={dataDictionaryConfig.ddFileInfo}
                />
              </AccordionDetails>
            </Accordion>
          )}
        </>
  
    </Box>
  );
};

export default ResourceDataDictionaryConfiguration;