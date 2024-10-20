import React, { useState, useEffect, useCallback } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResourceFileIngestionSetup from './ResourceFileIngestionSetup';
import ResourceDatabaseIngestionSetup from './ResourceDatabaseIngestionSetup';
import ResourceApiIngestionSetup from './ResourceApiIngestionSetup';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import ResourceDataPreview from './ResourceDataPreview';

const ResourceConfiguration = ({ savedState, onStateChange }) => {
  const [ingestionConfig, setIngestionConfig] = useState(savedState);

  const handleConfigChange = useCallback((updates) => {
    setIngestionConfig(prevConfig => {
      const newConfig = { ...prevConfig, ...updates };
      if (updates.schema) {
        newConfig.expandedAccordion = 'ingestionSettings';
      }
      return newConfig;
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onStateChange(ingestionConfig);
    }, 0);
    return () => clearTimeout(timer);
  }, [ingestionConfig, onStateChange]);

  const handleAccordionChange = useCallback((panel) => (event, isExpanded) => {
    handleConfigChange({ expandedAccordion: isExpanded ? panel : false });
  }, [handleConfigChange]);

  const renderIngestionSetup = () => {
    switch (ingestionConfig.sourceType) {
      case 'file':
        return <ResourceFileIngestionSetup ingestionConfig={ingestionConfig} onConfigChange={handleConfigChange} />;
      case 'database':
        return <ResourceDatabaseIngestionSetup ingestionConfig={ingestionConfig} onConfigChange={handleConfigChange} />;
      case 'api':
        return <ResourceApiIngestionSetup ingestionConfig={ingestionConfig} onConfigChange={handleConfigChange} />;
      default:
        return null;
    }
  };

  const getAccordionTitle = (sourceType) => {
    return sourceType ? `${sourceType.charAt(0).toUpperCase() + sourceType.slice(1)} Ingestion Setup` : 'Ingestion Setup';
  };

  return (
    <Box sx={{ '& > *': { mb: '1px' } }}>
      <Accordion 
        defaultExpanded
        expanded={ingestionConfig.expandedAccordion === 'ingestionSetup' || ingestionConfig.expandedAccordion === undefined}
        onChange={handleAccordionChange('ingestionSetup')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {getAccordionTitle(ingestionConfig.sourceType)}
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ '& > *': { mb: '1px', mt:-2 } }}>
            {renderIngestionSetup()}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={ingestionConfig.expandedAccordion === 'ingestionSettings'} 
        onChange={handleAccordionChange('ingestionSettings')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Resource Ingestion Settings
        </AccordionSummary>
        <AccordionDetails>
          <ResourceIngestionSettings
            ingestionConfig={ingestionConfig}
            onConfigChange={handleConfigChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={ingestionConfig.expandedAccordion === 'data'} 
        onChange={handleAccordionChange('data')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Data Preview
        </AccordionSummary>
        <AccordionDetails>
          <ResourceDataPreview
            schema={ingestionConfig.schema}
            sampleData={ingestionConfig.sampleData}
            rawData={ingestionConfig.rawData}
            fileInfo={ingestionConfig.fileInfo}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ResourceConfiguration;