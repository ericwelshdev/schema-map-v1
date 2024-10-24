import React, { useState, useCallback, useEffect, useMemo} from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Alert, Card, CardContent, Radio, RadioGroup, FormControlLabel, FormControl, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResourceFileIngestionSetup from './ResourceFileIngestionSetup';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import ResourceDataDictionaryDataPreview from './ResourceDataDictionaryDataPreview';
import ResourceDataDictionaryAssignment from './ResourceDataDictionaryAssignment';
import ResourceDataDictionaryClassification from './ResourceDataDictionaryClassification';
import { FileText, Database, TextCursorInput  } from 'lucide-react';
import AlertComponent from './AlertComponent';

const ResourceDataDictionaryConfiguration = ({ savedState, onStateChange }) => {
  const [dataDictionaryConfig, setDataDictionaryConfig] = useState({
    mode: 'dd_new',
    activeTab: 0,
    expandedAccordion: 'ingestionSetup',
    ddSourceInfo: null,
    ddSchema: null,
    ddSampleData: null,
    ddRawData: null,
    ddIngestionSettings: {},
    ddIngestionConfig: {},
    uploadStatus: null,
    error: null,
    ingestionProcessSource: null,
  });

  const [ddSourceInfo, setDdSourceInfo] = useState(null);
  const [processStatus, setProcessStatus] = useState(null);


  const handleDataChange = (resourceData) => {
    // Access the combined schema and sample data
    console.log("Resource Schema:",resourceData.processedSchema);
    console.log("Resource Sample Data:",resourceData.sampleData);
    console.log("Resource Info:",resourceData.resourceInfo);
  };
  useEffect(() => {
    if (savedState) {
      setDataDictionaryConfig((prevState) => ({ ...prevState, ...savedState }));
    }
  }, [savedState]);


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
      setDdSourceInfo(fileData.file);
      console.log('File processing result:', fileData);

      if (fileData && schema && sampleData) {
        handleConfigChange({
          ddSourceInfo: fileData.fileInfo,
          ddSchema: fileData.schema,
          ddSampleData: fileData.sampleData,
          ddRawData: fileData.rawData,
          ddIngestionSettings: fileData.ingestionSettings || {},
          ddIngestionConfig: fileData.ingestionConfig || {},
          expandedAccordion: 'ingestionSettings',
          uploadStatus: { type: 'success', message: 'File processed successfully' },
          error: null,
          ingestionProcessSource: 'fileUpload',
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
  }, [handleConfigChange]);

  const handleExistingDictionarySelect = useCallback(async (selectedDictionary) => {
    setDdSourceInfo(selectedDictionary);
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
          ddSourceInfo: result.fileInfo,
          ddSchema: result.schema,
          ddSampleData: result.sampleData,
          ddRawData: result.rawData,
          ddIngestionSettings: result.ingestionSettings,
          ddIngestionConfig: result.ingestionConfig,          
          expandedAccordion: 'ingestionSettings',
          uploadStatus: { type: 'success', message: 'Data Dictionary processed successfully' },
          error: null,
          ingestionProcessSource: 'existingDictionary',
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
    ingestionAppliedProperties: dataDictionaryConfig.ddIngestionSettings
  }), [dataDictionaryConfig.ddIngestionSettings, dataDictionaryConfig.ddIngestionConfig]);

  const handleModeChange = (event) => {
    const newMode = event.target.value;
    handleConfigChange({ 
      mode: newMode,
      expandedAccordion: 'ingestionSetup',
      ddSchema: null,
      ddSampleData: null,
      ddRawData: null,
      ddIngestionSettings: {},
      ddIngestionConfig: {},
      uploadStatus: null,
      error: null
    });
    setDdSourceInfo(null);
  };

    const handleApplyChanges = useCallback(async (updatedConfig) => {
      try {
        let result;
        if (updatedConfig.ingestionProcessSource === 'fileUpload') {
          result = await ResourceFileIngestionSetup.handleFileUpload(updatedConfig);
          console.log('File re-processing result:', result);
        } else if (updatedConfig.ingestionProcessSource === 'existingDictionary') {
          // Handle existing dictionary case
        } else {
          throw new Error('Invalid ingestion process source');
        }

        handleConfigChange({
          ddIngestionSettings: updatedConfig.ingestionAppliedProperties,
          ddSchema: result.schema,
          ddSampleData: result.sampleData,
          ddRawData: result.rawData,
          expandedAccordion: 'data'
        });
      } catch (error) {
        console.error('Error processing data:', error);
        handleConfigChange({
          error: 'Failed to process data with new settings'
        });
      }
    }, [handleConfigChange]);



  

  return (
    <Box sx={{ '& > *': { mb: '1px' } }}>
      <Card sx={{ mb: -1 }}>
        <CardContent>
        <FormControl component="fieldset">
        <Grid item xs={5}>
            {/* <Typography variant="subtitle1" sx={{ mt: -1 }} >
              Choose Data Dictionary Option:
            </Typography> */}
            <RadioGroup
              aria-label="data-dictionary-option"
              name="data-dictionary-option"
              value={dataDictionaryConfig.mode}
              onChange={handleModeChange}
            >
              <Box  display="flex" justifyContent="space-between">
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
             <FormControlLabel 
                  value="dd_manual" 
                  control={<Radio />} 
                  label={
                    <Box display="flex" alignItems="center">
                      <TextCursorInput style={{ marginRight: '8px' }} />
                      Manually Create New Data Dictionary
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
      <Alert severity={dataDictionaryConfig.uploadStatus.type} sx={{ mt: 2, mb: 2 }}></Alert>

    
      )}

      {dataDictionaryConfig.error && (

      <Alert severity="error" sx={{ mt: 2, mb: 2 }}> </Alert>
      )}

      
        <>

          <Accordion 
            expanded={dataDictionaryConfig.expandedAccordion === 'ingestionSetup'}
            onChange={handleAccordionChange('ingestionSetup')}
            sx={{ '&.Mui-expanded': { margin: 0 } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Data Dictionary Setup
            </AccordionSummary>
            <AccordionDetails>
            {dataDictionaryConfig.mode === 'dd_new' && (
              <ResourceFileIngestionSetup onConfigChange={handleFileUpload} />
            )}
            {dataDictionaryConfig.mode === 'dd_existing' && (
              <ResourceDataDictionaryAssignment  onSelect={handleExistingDictionarySelect} />
            )}  
            </AccordionDetails>
          </Accordion>

          {dataDictionaryConfig.ddSchema && (
            <Accordion 
              expanded={dataDictionaryConfig.expandedAccordion === 'ingestionSettings'} 
              onChange={handleAccordionChange('ingestionSettings')}
              sx={{ '&.Mui-expanded': { margin: 0 } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Data Dictionary Ingestion Settings
              </AccordionSummary>
              <AccordionDetails>
                <ResourceIngestionSettings
                  ingestionConfig={memoizedIngestionConfig}
                  onConfigChange={(updates) => handleConfigChange({ ddIngestionSettings: updates.ingestionAppliedProperties })}
                  onApplyChanges={handleApplyChanges}
                />
              </AccordionDetails>
            </Accordion>
          )}

          {dataDictionaryConfig.ddSchema && (
            <Accordion 
              expanded={dataDictionaryConfig.expandedAccordion === 'data'} 
              onChange={handleAccordionChange('data')}
              sx={{ '&.Mui-expanded': { margin: 0 } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Data Dictionary Preview
              </AccordionSummary>
              <AccordionDetails>
                <ResourceDataDictionaryDataPreview
                  schema={dataDictionaryConfig.ddSchema}
                  sampleData={dataDictionaryConfig.ddSampleData}
                  rawData={dataDictionaryConfig.ddRawData}
                  sourceInfo={dataDictionaryConfig.ddSourceInfo}
                />
              </AccordionDetails>
            </Accordion>
          )}
       
       {dataDictionaryConfig.ddSchema && (
            <Accordion 
              expanded={dataDictionaryConfig.expandedAccordion === 'classification'} 
              onChange={handleAccordionChange('classification')}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Data Dictionary Classification and Mapping
              </AccordionSummary>
              <AccordionDetails>
                {/* <ResourceDataDictionaryDataPreview
                  schema={dataDictionaryConfig.ddSchema}
                  sourceSchema={sourceProps.schema}
                  onClassificationChange={(newClassifications) => handleConfigChange({ ddClassifications: newClassifications })}
                /> */}
              </AccordionDetails>
            </Accordion>
          )}          
        </>
    </Box>
  );
};

export default ResourceDataDictionaryConfiguration;
