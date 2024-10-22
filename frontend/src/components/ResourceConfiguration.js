import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResourceFileIngestionSetup from './ResourceFileIngestionSetup';
import ResourceDatabaseIngestionSetup from './ResourceDatabaseIngestionSetup';
import ResourceApiIngestionSetup from './ResourceApiIngestionSetup';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import ResourceDataPreview from './ResourceDataPreview';

const ResourceConfiguration = ({ savedState, onStateChange }) => {
  const [resourceConfig, setResourceConfig] = useState({
    expandedAccordion: 'ingestionSetup',
    activeTab: 0, // Assuming tabs are used and this tracks the active one
    sourceInfo: null,
    schema: null,
    sampleData: null,
    rawData: null,
    ingestionSettings: {},
    ingestionConfig: {},
    uploadStatus: null,
    error: null,
  });

  // Sync local state with savedState whenever it changes (e.g., when navigating between steps)
  useEffect(() => {
    if (savedState) {
      setResourceConfig((prevState) => ({ ...prevState, ...savedState }));
    }
  }, [savedState]);

  const handleConfigChange = useCallback(
    (updates) => {
      setResourceConfig((prevConfig) => {
        const newConfig = { ...prevConfig, ...updates };
        onStateChange(newConfig); // Update parent component's state
        return newConfig;
      });
    },
    [onStateChange]
  );

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

  const renderIngestionSetup = () => {
      const resourceType = resourceConfig.resourceSetup?.resourceSetup?.resourceType;
      console.log("resourceType", resourceType);
      console.log("resourceConfig.resourceSetup", resourceConfig.resourceSetup);

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

  const memoizedIngestionConfig = useMemo(
    () => ({
      ingestionSettings: resourceConfig.ingestionSettings,
      ingestionConfig: resourceConfig.ingestionConfig,
      ingestionAppliedProperties: resourceConfig.ingestionSettings,
    }),
    [resourceConfig.ingestionConfig, resourceConfig.ingestionSettings]
  );

  return (
    <Box sx={{ '& > *': { mb: '1px' } }}>
      {resourceConfig.uploadStatus && (
        <Alert severity={resourceConfig.uploadStatus.type} sx={{ mb: 2 }}>
          {resourceConfig.uploadStatus.message}
        </Alert>
      )}

      {resourceConfig.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {resourceConfig.error}
        </Alert>
      )}

      <Accordion
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

      {resourceConfig.schema && (
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
                onApplyChanges={() => handleConfigChange({ expandedAccordion: 'data' })}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={resourceConfig.expandedAccordion === 'data'}
            onChange={handleAccordionChange('data')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Resource Data Preview
            </AccordionSummary>
            <AccordionDetails>
              <ResourceDataPreview
                activeTab={resourceConfig.activeTab} // Pass down the active tab
                onTabChange={handleTabChange} // Handle tab changes
                schema={resourceConfig.schema}
                sampleData={resourceConfig.sampleData}
                rawData={resourceConfig.rawData}
                fileInfo={resourceConfig.sourceInfo}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
};

export default ResourceConfiguration;
