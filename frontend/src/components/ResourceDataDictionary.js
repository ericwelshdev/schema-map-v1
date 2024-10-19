import React, { useState, useEffect, useCallback } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Button, Alert, LinearProgress, Autocomplete, TextField, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGrid } from '@mui/x-data-grid';
import ResourceFileUpload from './ResourceFileUpload';
import ResourceIngestionSettings from './ResourceIngestionSettings';
import { detectFileType, autoDetectSettings, generateSchema } from '../utils/fileUtils';
import { getConfigForResourceType } from '../utils/ingestionConfig';
import stringSimilarity from 'string-similarity';


const standardClassifications = [
  'physical_table_name' , 'logical_table_name'  , 'physical_column_name','logical_column_name', 'column_description', 'data_type', 'nullability',
  'primary_key', 'foreign_key', 'tags', 'table_description'
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
  const [sourceName, setSourceName] = useState('');
  const [dataDictionary, setDataDictionary] = useState([]);

  const memoizedOnStateChange = useCallback(() => {
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
        sourceDataMapping,
        sourceName,
        dataDictionary
      });
    }
  }, [expandedAccordion, uploadStatus, schema, ingestionSettings, fileInfo, sampleData, rawData, detectedFileType, config, classifications, sourceDataMapping, sourceName, dataDictionary, onStateChange]);

  useEffect(() => {
    memoizedOnStateChange();
  }, [memoizedOnStateChange]);

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

  // Auto-detect classifications using string similarity
  const autoDetectClassifications = (schema) => {
    return schema.reduce((acc, column) => {
      // Get the classification with the highest similarity score
      const highestMatch = standardClassifications.reduce((bestMatch, cls) => {
        const similarityScore = stringSimilarity.compareTwoStrings(column.name.toLowerCase(), cls.toLowerCase());
        return similarityScore > bestMatch.score ? { classification: cls, score: similarityScore } : bestMatch;
      }, { classification: '', score: 0 });

      acc[column.id] = highestMatch.score > 0.3 ? highestMatch.classification : ''; // Set a threshold for classification
      return acc;
    }, {});
  };

  const handleClassificationChange = (id, newValue) => {
    setClassifications(prev => ({ ...prev, [id]: newValue }));
  };

  const applyClassifications = () => {
    const newDataDictionary = schema.map((column) => {
      // Find the matching entry in the data dictionary based on column name
      const dictionaryEntry = dataDictionary.find(entry => entry.columnName === column.name);

      return {
        id: column.id,
        columnName: column.name,
        classification: classifications[column.id] || 'Unclassified'
      };
    });

    setDataDictionary(newDataDictionary);
    updateSourceDataMapping();
  };

  const updateSourceDataMapping = () => {
    // Initialize a mapping for all the best matches based on similarity scores
    const allMatches = schema.map((column) => {
        const columnMatches = dataDictionary
            
            .filter(entry => entry.physical_table_name === sourceName) // Ensure we're matching the correct table
            .map(entry => ({
                ...entry,
                similarity: stringSimilarity.compareTwoStrings(column.name.toLowerCase(), entry.physical_column_name.toLowerCase()
              )
              
            }));
            console.log("columnMatches",columnMatches)  
        // Filter matches by similarity score, we can set a threshold if necessary
        const validMatches = columnMatches.filter(match => match.similarity > 0.3); // Adjust threshold as needed

        // Sort matches by similarity score
        validMatches.sort((a, b) => b.similarity - a.similarity);

        // Get the best match or return a default if none are found
        const bestMatch = validMatches[0] || {
            physical_column_name: 'Unclassified',
            similarity: 0,
            physical_table_name: sourceName,
            // Add other default properties as needed
        };

        return {
            id: column.id,
            phys_table_name: bestMatch.physical_table_name,
            phys_column_nm: column.name,
            log_table_name: sourceName,
            log_column_name: column.name,
            column_desc: bestMatch.physical_column_name,
            data_type_cd: column.type,
            pk_ind: bestMatch.primary_key || false, // Use appropriate field from best match
            null_ind: bestMatch.nullability || true,
            similarity: bestMatch.similarity // Keep track of the similarity score
        };
    });

    // Remove duplicates and keep only the best matches for each physical column
    const filteredMapping = allMatches.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.phys_column_nm === item.phys_column_nm && t.phys_table_name === item.phys_table_name
        ))
    );

    setSourceDataMapping(filteredMapping);
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
    { field: 'phys_table_name', headerName: 'Physical Table Name', width: 200 },
    { field: 'phys_column_nm', headerName: 'Physical Column Name', width: 200 },
    { field: 'log_table_name', headerName: 'Logical Table Name', width: 200 },
    { field: 'log_column_name', headerName: 'Logical Column Name', width: 200 },
    { field: 'column_desc', headerName: 'Column Description', width: 300 },
    { field: 'data_type_cd', headerName: 'Data Type', width: 150 },
    { field: 'pk_ind', headerName: 'Primary Key', width: 150, type: 'boolean' },
    { field: 'null_ind', headerName: 'Nullable', width: 150, type: 'boolean' },
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
          <TextField
            label="Source Name"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            fullWidth
            margin="normal"
          />
     
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