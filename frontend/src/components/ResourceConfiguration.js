import React, { useState } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Button, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ResourceFileUpload from './ResourceFileUpload';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import ResourceDataPreview from './ResourceDataPreview';
import ResourceSummary from './ResourceSummary';
import { detectFileType, autoDetectSettings, generateSchema } from '../utils/fileUtils';
import { ingestionConfig } from '../utils/ingestionConfig';

const ResourceConfiguration = ({ resourceData }) => {
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [schema, setSchema] = useState(null);
  const [ingestionSettings, setIngestionSettings] = useState({});
  const [fileInfo, setFileInfo] = useState(null);
  const [sampleData, setSampleData] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleFileUpload = async (file) => {
    try {
      const fileType = await detectFileType(file);
      const autoDetectedSettings = await autoDetectSettings(file, fileType);
      const defaultSettings = ingestionConfig.file[fileType];
      
      const combinedSettings = {
        ...defaultSettings,
        ...autoDetectedSettings
      };

      setIngestionSettings(combinedSettings);

      const schemaResult = await generateSchema(file, combinedSettings);
      setSchema(schemaResult.schema);
      setSampleData(schemaResult.sampleData);

      setFileInfo({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified).toLocaleString(),
      });

      if (schemaResult.warnings.length > 0) {
        setUploadStatus({ type: 'warning', message: schemaResult.warnings.join('. ') });
      } else {
        setUploadStatus({ type: 'success', message: 'File successfully ingested.' });
      }

      setExpandedAccordion('ingestionSettings');
    } catch (error) {
      setUploadStatus({ type: 'error', message: error.message });
    }
  };

  const handleViewData = () => {
    setExpandedAccordion('data');
  };

  return (
    <Box>
      <ResourceFileUpload onUpload={handleFileUpload} type={resourceData.resourceType} />
      
      {uploadStatus && (
        <Alert severity={uploadStatus.type} sx={{ mt: 2, mb: 2 }}>
          {uploadStatus.message}
        </Alert>
      )}

      <Accordion 
        expanded={expandedAccordion === 'ingestionSettings'} 
        onChange={handleAccordionChange('ingestionSettings')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Source Ingestion Settings
        </AccordionSummary>
        <AccordionDetails>
          <ResourceIngestionSettings 
            resourceData={resourceData}
            ingestionSettings={ingestionSettings}
            onSettingChange={(field, value) => setIngestionSettings(prev => ({ ...prev, [field]: value }))}
          />
          <Button onClick={handleViewData}>View Data</Button>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expandedAccordion === 'data'} 
        onChange={handleAccordionChange('data')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Data
        </AccordionSummary>
        <AccordionDetails>
          <ResourceDataPreview 
            schema={schema} 
            resourceData={resourceData} 
            fileInfo={fileInfo}
            sampleData={sampleData}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expandedAccordion === 'summary'} 
        onChange={handleAccordionChange('summary')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Summary
        </AccordionSummary>
        <AccordionDetails>
          <ResourceSummary resourceData={resourceData} ingestionSettings={ingestionSettings} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ResourceConfiguration;