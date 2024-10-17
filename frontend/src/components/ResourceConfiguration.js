import React, { useState } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Button, Alert, LinearProgress } from '@mui/material';
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
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedFileType, setDetectedFileType] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const processFile = async (file, settings) => {
    setLoading(true);
    setProgress(0);
    try {
      const fileType = await detectFileType(file);
      setDetectedFileType(fileType);
      setProgress(20);
      const autoDetectedSettings = await autoDetectSettings(file, fileType);
      setProgress(40);
      const defaultSettings = ingestionConfig.file[fileType];
      
      const combinedSettings = {
        ...defaultSettings,
        ...autoDetectedSettings,
        ...settings
      };

      setIngestionSettings(combinedSettings);
      setProgress(60);

      const schemaResult = await generateSchema(file, combinedSettings);
      setSchema(schemaResult.schema);
      setSampleData(schemaResult.sampleData);
      setRawData(schemaResult.rawData);
      setProgress(80);

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

      setExpandedAccordion('data');
      setProgress(100);
    } catch (error) {
      setUploadStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setCurrentFile(file);
    await processFile(file, {});
  };

  const handleApplyChanges = async () => {
    if (currentFile) {
      await processFile(currentFile, ingestionSettings);
    }
  };

  return (
    <Box sx={{ '& > *': { mb: '1px' } }}>
      <ResourceFileUpload onUpload={handleFileUpload} type={resourceData.resourceType} />
      
      {loading && <LinearProgress variant="determinate" value={progress} />}

      {uploadStatus && (
        <Alert severity={uploadStatus.type} sx={{ mt: '1px', mb: '1px' }}>
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
            resourceData={{...resourceData, fileType: detectedFileType}}
            ingestionSettings={ingestionSettings}
            onSettingChange={(field, value) => setIngestionSettings(prev => ({ ...prev, [field]: value }))}
          />
          <Button onClick={handleApplyChanges} variant="contained" color="primary" sx={{ mt: 2 }}>
            Apply Changes
          </Button>
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
            rawData={rawData}
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
