import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResourceFileIngestionSetup from './ResourceFileIngestionSetup';
import ResourceDatabaseIngestionSetup from './ResourceDatabaseIngestionSetup';
import ResourceApiIngestionSetup from './ResourceApiIngestionSetup';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import ResourceDataPreview from './ResourceDataPreview';

const ResourceConfiguration = ({ savedState, onStateChange }) => {
  const [resourceConfig, setResourceConfig] = useState(() => {
    const saved = localStorage.getItem('resourceGeneralConfig');
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
      resourceType: savedState?.resourceSetup?.resourceType
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
    if (resourceConfig) {
      onStateChange(resourceConfig);
      localStorage.setItem('resourceGeneralConfig', JSON.stringify(resourceConfig));
    }
  }, [resourceConfig, onStateChange]);



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

  
  const renderIngestionSetup = () => {
    const resourceType = savedState?.resourceSetup?.resourceType;
    // console.log("resourceType", resourceType);
    // console.log("savedState:", savedState);

    switch (resourceType) {
      case 'file':
        return <ResourceFileIngestionSetup onConfigChange={handleConfigChange} />;
      case 'database':
        return <ResourceDatabaseIngestionSetup onConfigChange={handleConfigChange} />;
      case 'api':
        return <ResourceApiIngestionSetup onConfigChange={handleConfigChange} />;
      default:
        return null;
    }
  };

  const handleApplyChanges = useCallback(async (updatedConfig) => {
    try {
      
      const resourceType = savedState?.resourceSetup?.resourceType;
      // console.log("resourceType", resourceType);
      // if (!resourceType) {
      //   throw new Error('Resource type not specified');
      // }

      const updatedIngestionConfig = {
        ...resourceConfig.ingestion,
        ingestionSettings: resourceConfig.ingestionSettings,
        ingestionAppliedProperties: resourceConfig.ingestionSettings
      };

      let result;
      switch (resourceType) {
        case 'file':
          result = await ResourceFileIngestionSetup.handleFileUpload({
            File: resourceConfig.resourceInfo.file,
            ingestionSettings: resourceConfig.ingestionSettings,
          });
          break;
        case 'database':
          result = await ResourceDatabaseIngestionSetup.handleDatabaseIngestion({
            connectionInfo: resourceConfig.resourceInfo,
            ingestionSettings: resourceConfig.ingestionSettings,
          });
          break;
        case 'api':
          result = await ResourceApiIngestionSetup.handleApiIngestion({
            apiConfig: resourceConfig.resourceInfo,
            ingestionSettings: resourceConfig.ingestionSettings,
          });
          break;
        default:
          throw new Error(`Unsupported resource type: ${resourceType}`);
      }

      handleConfigChange({        
        ingestion: updatedIngestionConfig,
        schema: result.resourceSchema,
        fullData: result.fullData,
        sampleData: result.sampleData,
        rawData: result.rawData,
        expandedAccordion: 'data',
        error: null // Clear any previous errors
      });
    } catch (error) {
      console.error('Error processing data:', error);
      handleConfigChange({
        error: `Failed to process data: ${error.message}`,
        uploadStatus: { type: 'error', message: error.message }
      });
    }
  }, [resourceConfig, handleConfigChange]);

  



  const memoizedIngestionConfig = useMemo(
    () => ({
      ingestionSettings: resourceConfig.ingestionSettings,
      ingestionConfig: resourceConfig.ingestionConfig,
      ingestionAppliedProperties: resourceConfig.ingestionSettings,
    }),
    [resourceConfig.ingestionConfig, resourceConfig.ingestionSettings]
  );

  return (
    <Box sx={{ '& > *': { mb: '1px', height: '100%' } }}>
      {/* {resourceConfig.uploadStatus && (
        <Alert severity={resourceConfig.uploadStatus.type} sx={{ mb: 2 }}>
          {resourceConfig.uploadStatus.message}
        </Alert>
      )}

      {resourceConfig.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {resourceConfig.error}
        </Alert>
      )} */}

      <Accordion
        disableGutters={true}
        expanded={resourceConfig.expandedAccordion === 'ingestionSetup'}
        onChange={handleAccordionChange('ingestionSetup')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Resource Ingestion Setup
        </AccordionSummary>
        <AccordionDetails>
          {renderIngestionSetup()}
        </AccordionDetails>
      </Accordion>

      {resourceConfig.resourceSchema && (
        <>
          <Accordion
            expanded={resourceConfig.expandedAccordion === 'ingestionSettings'}
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
            expanded={resourceConfig.expandedAccordion === 'data'}
            onChange={handleAccordionChange('data')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Resource Data Preview
            </AccordionSummary>
            <AccordionDetails >
              <ResourceDataPreview
                activeTab={resourceConfig.activeTab} // pass down the active tab
                onTabChange={handleTabChange} //  tab changes
                schema={resourceConfig.resourceSchema}
                sampleData={resourceConfig.sampleData}
                rawData={resourceConfig.rawData}
                resourceInfo={resourceConfig.resourceInfo}
                onDataChange={handleDataChange}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
};

export default ResourceConfiguration;
