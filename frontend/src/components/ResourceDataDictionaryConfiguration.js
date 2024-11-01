import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResourceFileIngestionSetup from './ResourceFileIngestionSetup';
import ResourceDataDictionaryAssignment from './ResourceDataDictionaryAssignment';
import ResourceApiIngestionSetup from './ResourceApiIngestionSetup';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import ResourceDataDictionaryDataPreview from './ResourceDataDictionaryDataPreview';

const ResourceDataDictionaryConfiguration = ({ savedState, onStateChange }) => {
  // console.log('ResourceDataDictionaryConfiguration-> Incoming savedState:', savedState);

  const [ddResourceConfig, setResourceConfig] = useState(() => {
    const saved = localStorage.getItem('ddResourceGeneralConfig');
    console.log("savedState:", savedState);
    return saved ? JSON.parse(saved) : {
    expandedAccordion: 'ingestionSetup',
    activeTab: 0,
    sourceInfo: null,
    schema: null,
    fullData: null,
    sampleData: null,
    rawData: null,
    ingestionSettings: {},
    ingestionConfig: {},
    uploadStatus: null,
    error: null,
    resourceType: savedState?.ddResourceSetup?.resourceType
      };
    });

  const handleConfigChange = useCallback(
    (updates) => {
      setResourceConfig(prevConfig => {
        const newConfig = { 
          ...prevConfig, 
          ...updates,
          // Initially open data accordion when schema first becomes available
          expandedAccordion: updates.schema && !prevConfig.schema ? 'data' : updates.expandedAccordion || prevConfig.expandedAccordion
        };
        return newConfig;
      });
    },
    []
  );
  
  
  

  useEffect(() => {
    if (ddResourceConfig) {
      onStateChange(ddResourceConfig);
      localStorage.setItem('ddResourceGeneralConfig', JSON.stringify(ddResourceConfig));
    }
  }, [ddResourceConfig, onStateChange]);



  const handleAccordionChange = useCallback(
    (panel) => (event, isExpanded) => {
      handleConfigChange({ expandedAccordion: isExpanded ? panel : false });
    },
    [handleConfigChange]
  );

  const handleTabChange = useCallback(
    (newTabIndex) => {
      handleConfigChange({ activeTab: newTabIndex });
    },
    [handleConfigChange]
  );


  const handleDataChange = (resourceData) => {
    handleConfigChange({
      processedSchema: resourceData.processedSchema,
      schema: resourceData.schema,
      fullData: resourceData.fullData,
      sampleData: resourceData.sampleData,
      resourceInfo: resourceData.resourceInfo
    });
  };

  // useEffect(() => {
  //   if (savedState && JSON.stringify(savedState) !== JSON.stringify(ddResourceConfig)) {
  //     setResourceConfig(prevState => ({ ...prevState, ...savedState }));
  //   }
  // }, [savedState]);


  const renderIngestionSetup = () => {
    const resourceType = savedState?.ddResourceSetup?.resourceType;
    // console.log("resourceType", resourceType);
    // console.log("savedState:", ddResourceConfig);

    switch (resourceType) {
      case 'dd_new':
        return <ResourceFileIngestionSetup onConfigChange={handleConfigChange} />;
      case 'dd_existing':
        return <ResourceDataDictionaryAssignment onConfigChange={handleConfigChange} />;
      case 'dd_manual':
        return <ResourceApiIngestionSetup onConfigChange={handleConfigChange} />;
      default:
        return null;
    }
  };

  const handleApplyChanges = useCallback(async (updatedConfig) => {
    try {
      const resourceType = savedState?.ddResourceSetup?.resourceType;
    
      const updatedIngestionConfig = {
        ...ddResourceConfig.ingestion,
        ingestionSettings: ddResourceConfig.ingestionSettings,
        ingestionAppliedProperties: ddResourceConfig.ingestionSettings
      };

      let result;
      switch (resourceType) {
        case 'dd_new':
          result = await ResourceFileIngestionSetup.handleFileUpload({
            File: ddResourceConfig.resourceInfo.file,
            ingestionSettings: ddResourceConfig.ingestionSettings,
          });
          break;
        case 'dd_existing':
          result = await ResourceDataDictionaryAssignment.handleDatabaseIngestion({
            connectionInfo: ddResourceConfig.resourceInfo,
            ingestionSettings: ddResourceConfig.ingestionSettings,
          });
          break;
        case 'dd_manual':
          result = await ResourceApiIngestionSetup.handleApiIngestion({
            apiConfig: ddResourceConfig.resourceInfo,
            ingestionSettings: ddResourceConfig.ingestionSettings,
          });
          break;
        default:
          throw new Error(`Unsupported resource type: ${resourceType}`);
      }

      handleConfigChange({        
        ingestion: updatedIngestionConfig,
        schema: result.resourceSchema,
        sampleData: result.sampleData,
        rawData: result.rawData,
        expandedAccordion: 'data',
      });
    } catch (error) {
      console.error('Error processing data:', error);
      handleConfigChange({
        error: `Failed to process data: ${error.message}`,
        uploadStatus: { type: 'error', message: error.message }
      });
    }
  }, [ddResourceConfig, handleConfigChange, savedState]);



  const memoizedIngestionConfig = useMemo(
    () => ({
      ingestionSettings: ddResourceConfig.ingestionSettings,
      ingestionConfig: ddResourceConfig.ingestionConfig,
      ingestionAppliedProperties: ddResourceConfig.ingestionSettings,
    }),
    [ddResourceConfig.ingestionConfig, ddResourceConfig.ingestionSettings]
  );

  return (
    <Box sx={{ '& > *': { mb: '1px', height: '100%' } }}>
      {ddResourceConfig.uploadStatus && (
        <Alert severity={ddResourceConfig.uploadStatus.type} sx={{ mb: 2 }}>
          {ddResourceConfig.uploadStatus.message}
        </Alert>
      )}

      {ddResourceConfig.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {ddResourceConfig.error}
        </Alert>
      )}

      <Accordion
        disableGutters={true}
        expanded={ddResourceConfig.expandedAccordion === 'ingestionSetup'}
        onChange={handleAccordionChange('ingestionSetup')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Resource Ingestion Setup
        </AccordionSummary>
        <AccordionDetails>
          {renderIngestionSetup()}
        </AccordionDetails>
      </Accordion>

      {ddResourceConfig.resourceSchema && (
        <>
          <Accordion
            expanded={ddResourceConfig.expandedAccordion === 'ingestionSettings'}
            onChange={handleAccordionChange('ingestionSettings')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Resource Ingestion Settings
            </AccordionSummary>
            <AccordionDetails>
              <ResourceIngestionSettings
                ingestionConfig={memoizedIngestionConfig}         
                onConfigChange={(updates) =>
                  handleConfigChange({ ingestionSettings: updates.ingestionAppliedProperties })
                }
                onApplyChanges={() => handleApplyChanges({ expandedAccordion: 'data' })}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion 
            disableGutters={true}
            expanded={ddResourceConfig.expandedAccordion === 'data'}
            onChange={handleAccordionChange('data')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Resource Data Preview
            </AccordionSummary>
            <AccordionDetails >
              <ResourceDataDictionaryDataPreview
                activeTab={ddResourceConfig.activeTab} // pass down the active tab
                onTabChange={handleTabChange} //  tab changes
                schema={ddResourceConfig.resourceSchema}
                sampleData={ddResourceConfig.sampleData}
                rawData={ddResourceConfig.rawData}
                resourceInfo={ddResourceConfig.resourceInfo}
                onDataChange={handleDataChange}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
};

export default ResourceDataDictionaryConfiguration;


