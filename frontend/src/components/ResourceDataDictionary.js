import React, { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Button, Alert, LinearProgress, Autocomplete, TextField, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGrid } from '@mui/x-data-grid';
import ResourceFileUpload from './ResourceFileUpload';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import { detectFileType, autoDetectSettings, generateSchema } from '../utils/fileUtils';
import { getConfigForResourceType } from '../utils/ingestionConfig';

const standardClassifications = [
  'physical_table_name', 'physical_column_name', 'data_type', 'nullability',
  'primary_key', 'foreign_key', 'table_description', 'column_description', 'tags'
];

const ResourceDataDictionary = ({ resourceData, onUpload, onSkip, savedState = {}, onStateChange }) => {
  const [expandedAccordion, setExpandedAccordion] = useState(savedState.expandedAccordion || false);
  const [uploadStatus, setUploadStatus] = useState(savedState.uploadStatus || null);
  const [schema, setSchema] = useState(savedState.schema || null);
  const [ingestionSettings, setIngestionSettings] = useState(savedState.ingestionSettings || {});
  const [fileInfo, setFileInfo] = useState(savedState.fileInfo || null);
  const [sampleData, setSampleData] = useState(savedState.sampleData || null);
  const [rawData, setRawData] = useState(savedState.rawData || null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedFileType, setDetectedFileType] = useState(savedState.detectedFileType || null);
  const [currentFile, setCurrentFile] = useState(null);
  const [config, setConfig] = useState(savedState.config || {});
  const [classifications, setClassifications] = useState(savedState.classifications || {});
  const [sourceDataMapping, setSourceDataMapping] = useState(savedState.sourceDataMapping || []);

  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        expandedAccordion,
        uploadStatus,
        schema,
        ingestionSettings,
        fileInfo,
        sampleData,
        rawData,
        detectedFileType,
        config,
        classifications,
        sourceDataMapping
      });
    }
  }, [expandedAccordion, uploadStatus, schema, ingestionSettings, fileInfo, sampleData, rawData, detectedFileType, config, classifications, sourceDataMapping]);

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
      const newConfig = getConfigForResourceType(fileType);
      setConfig(newConfig);
      
      const combinedSettings = {
        ...newConfig,
        ...autoDetectedSettings,
        ...settings
      };

      setIngestionSettings(combinedSettings);
      setProgress(60);

      const schemaResult = await generateSchema(file, combinedSettings);
      const schemaWithIds = schemaResult.schema.map((item, index) => ({ ...item, id: index }));
      setSchema(schemaWithIds);
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
        setUploadStatus({ type: 'success', message: 'Data dictionary file successfully ingested.' });
      }

      setExpandedAccordion('data');
      setProgress(100);
      onUpload(schemaResult);

      // Auto-detect classifications
      const autoDetectedClassifications = autoDetectClassifications(schemaWithIds);
      setClassifications(autoDetectedClassifications);
    } catch (error) {
      setUploadStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setCurrentFile(file);
    const fileType = await detectFileType(file);
    const detectedSettings = await autoDetectSettings(file, fileType);
    
    const newConfig = getConfigForResourceType(fileType);
    setConfig(newConfig);
    
    const defaultSettings = Object.entries(newConfig).reduce((acc, [key, value]) => {
      acc[value.uiField] = detectedSettings[value.uiField] ?? value.default;
      return acc;
    }, {});

    if (fileType === 'excel' && detectedSettings.sheetNames) {
      defaultSettings.sheetSelection = detectedSettings.sheetNames[0];
    }

    setIngestionSettings(defaultSettings);
    
    await processFile(file, defaultSettings);
  };

  const handleApplyChanges = async () => {
    if (currentFile) {
      await processFile(currentFile, ingestionSettings);
    }
  };

  const handleSettingChange = (field, value) => {
    setIngestionSettings(prevSettings => ({
      ...prevSettings,
      [field]: value
    }));
  };

  const autoDetectClassifications = (schema) => {
    return schema.reduce((acc, column) => {
      acc[column.id] = standardClassifications.includes(column.name.toLowerCase().replace(/\s/g, '_'))
        ? column.name.toLowerCase().replace(/\s/g, '_')
        : '';
      return acc;
    }, {});
  };

  const handleClassificationChange = (id, newValue) => {
    setClassifications(prev => ({ ...prev, [id]: newValue }));
  };

  const applyClassifications = () => {
    const newMapping = schema.map((column) => ({
      id: column.id,
      sourceColumn: column.name,
      dictionaryColumn: column.name,
      classification: classifications[column.id] || 'Unclassified'
    }));
    setSourceDataMapping(newMapping);
    setExpandedAccordion('mapping');
  };

  const classificationColumns = [
    { field: 'name', headerName: 'Column Name', width: 150 },
    { field: 'type', headerName: 'Data Type', width: 150 },
    {
      field: 'classification',
      headerName: 'Classification',
      width: 300,
      renderCell: (params) => (
        <Autocomplete
          value={classifications[params.row.id] || ''}
          onChange={(event, newValue) => handleClassificationChange(params.row.id, newValue)}
          options={standardClassifications}
          renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          style={{ width: '100%' }}
        />
      ),
    }
  ];

  const mappingColumns = [
    { field: 'sourceColumn', headerName: 'Source Column', width: 150 },
    { field: 'dictionaryColumn', headerName: 'Dictionary Column', width: 150 },
    { field: 'classification', headerName: 'Classification', width: 150 }
  ];

  return (
    <Box sx={{ '& > *': { mb: '1px' } }}>
      <ResourceFileUpload onUpload={handleFileUpload} type="dataDictionary" />
      
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
          Data Dictionary Ingestion Settings
        </AccordionSummary>
        <AccordionDetails>
          <ResourceIngestionSettings 
            config={config}
            ingestionSettings={ingestionSettings}
            onSettingChange={handleSettingChange}
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
          Data Dictionary Preview
        </AccordionSummary>
        <AccordionDetails>
          {schema && (
            <DataGrid
              rows={schema}
              columns={classificationColumns}
              pageSize={5}
              autoHeight
              disableSelectionOnClick
            />
          )}
          <Button onClick={applyClassifications} variant="contained" color="primary" sx={{ mt: 2 }}>
            Apply Classifications
          </Button>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expandedAccordion === 'mapping'} 
        onChange={handleAccordionChange('mapping')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Source Data Mapping
        </AccordionSummary>
        <AccordionDetails>
          <DataGrid
            rows={sourceDataMapping}
            columns={mappingColumns}
            pageSize={5}
            autoHeight
            disableSelectionOnClick
          />
        </AccordionDetails>
      </Accordion>

      <Button onClick={onSkip} variant="outlined" sx={{ mt: 2 }}>
        Skip
      </Button>
    </Box>
  );
};

export default ResourceDataDictionary;