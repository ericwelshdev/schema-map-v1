import React, { useState, useEffect, useCallback } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Button, Alert, LinearProgress, Autocomplete, TextField, Chip, Tabs, Tab, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AltRouteIcon from '@mui/icons-material/AltRoute';
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
  const [expandedAccordion, setExpandedAccordion] = useState(savedState.expandedAccordion || 'fileUpload');
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
  const [activeTab, setActiveTab] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
      // onUpload(schemaResult);

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
    setUploadedFileName(file.name);
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
    setExpandedAccordion('data');
    setActiveTab(1); // Activate the schema tab
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
          console.log("Starting updateSourceDataMapping");
          console.log("Schema:", schema);
          console.log("Source Name:", sourceName);
          console.log("Data Dictionary:", dataDictionary);

          const matchedData = schema.map((column) => {
            console.log("Processing column:", column);

            const columnMatches = dataDictionary
              .filter(entry => {
                const match = entry.physical_table_name.toLowerCase() === sourceName.toLowerCase();
                console.log("Filtering entry:", entry, "Match:", match);
                console.log("entry.physical_table_name:", match);
                console.log("sourceName:", sourceName);
                return match;
              })
              .map(entry => {
                const nameSimilarity = stringSimilarity.compareTwoStrings(
                  column.name.toLowerCase(),
                  entry.physical_column_name.toLowerCase()
                );
                const classificationSimilarity = stringSimilarity.compareTwoStrings(
                  classifications[column.id]?.toLowerCase() || '',
                  entry.classification?.toLowerCase() || ''
                );
                const totalSimilarity = (nameSimilarity * 0.7) + (classificationSimilarity * 0.3);
        
                console.log("Entry mapping:", entry, "Name Similarity:", nameSimilarity, "Classification Similarity:", classificationSimilarity, "Total Similarity:", totalSimilarity);

                return {
                  ...entry,
                  similarity: totalSimilarity
                };
              });

            console.log("Column matches:", columnMatches);

            columnMatches.sort((a, b) => b.similarity - a.similarity);
            const bestMatch = columnMatches[0];

            console.log("Best match:", bestMatch);

            if (bestMatch && bestMatch.similarity > 0.6) {
              return {
                sourceColumnName: column.name,
                sourceDataType: column.type,
                physical_table_name: bestMatch.physical_table_name,
                physical_column_name: bestMatch.physical_column_name,
                logical_table_name: bestMatch.logical_table_name,
                logical_column_name: bestMatch.logical_column_name,
                column_description: bestMatch.column_description,
                data_type: bestMatch.data_type,
                primary_key: bestMatch.primary_key,
                foreign_key: bestMatch.foreign_key,
                nullable: bestMatch.nullable,
                similarity: bestMatch.similarity
              };
            }
            return null;
          }).filter(Boolean);

          console.log("Final matched data:", matchedData);

          setSourceDataMapping(matchedData);
          setExpandedAccordion('data');
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
    { field: 'sourceColumnName', headerName: 'Source Column Name', width: 180 },
    { field: 'sourceDataType', headerName: 'Source Data Type', width: 150 },
    { field: 'physical_table_name', headerName: 'Physical Table Name', width: 180 },
    { field: 'physical_column_name', headerName: 'Physical Column Name', width: 180 },
    { field: 'logical_table_name', headerName: 'Logical Table Name', width: 180 },
    { field: 'logical_column_name', headerName: 'Logical Column Name', width: 180 },
    { field: 'column_description', headerName: 'Column Description', width: 200 },
    { field: 'data_type', headerName: 'Data Type', width: 120 },
    { field: 'primary_key', headerName: 'Primary Key', width: 120, type: 'boolean' },
    { field: 'foreign_key', headerName: 'Foreign Key', width: 120, type: 'boolean' },
    { field: 'nullable', headerName: 'Nullable', width: 120, type: 'boolean' },
    { field: 'similarity', headerName: 'Similarity Score', width: 150, type: 'number' },
  ];

  const renderGeneralInfo = () => (
    <Box>
      <Typography variant="h6">File Information</Typography>
      {fileInfo && (
        <>
          <Typography variant="body2">Name: {fileInfo.name}</Typography>
          <Typography variant="body2">Type: {fileInfo.type}</Typography>
          <Typography variant="body2">Size: {fileInfo.size} bytes</Typography>
          <Typography variant="body2">Last Modified: {fileInfo.lastModified}</Typography>
        </>
      )}
    </Box>
  );

  const handleValidateMapping = () => {
    updateSourceDataMapping();
    setExpandedAccordion('data');
    setActiveTab(3); 
  };

  const renderSchema = () => (
    schema ? (
      <Box sx={{ mt:-3, pb:2, height: 350, width: '100%' }}>
        {/* <Button size="small" onClick={applyClassifications} startIcon={<SaveIcon />} variant="contained" color="primary" sx={{ mt: 1 }}>Save Classifications</Button> */}
        <Button size="small" onClick={handleValidateMapping} startIcon={<AltRouteIcon />} variant="contained" color="primary" sx={{  mt: 1 }}>Validate Mapping</Button>
        <DataGrid
          rows={schema}
          columns={classificationColumns}
          pageSize={5}
          rowsPerPageOptions={[10, 25, 50]}
          density="compact"
        />
      </Box>
    ) : (
      <Typography>No schema available</Typography>
    )
  );

  const renderSampleData = () => (
    sampleData ? (
      <Box sx={{ mt:-3, height: 300, width: '100%', overflow: 'auto' }}>
        <DataGrid
          rows={sampleData.map((row, index) => ({ id: index, ...row }))}
          columns={schema.map(col => ({
            field: col.name,
            headerName: col.name,
            flex: 1,
          }))}
          pageSize={10}
          columnHeaderHeight={40}
          rowHeight={40}
          rowsPerPageOptions={[10, 25, 50]}
          density="compact"
        />
      </Box>
    ) : (
      <Typography>No sample data available</Typography>
    )
  );
  const renderMapping = () => (
    schema ? (
      <Box sx={{ height: 300, width: '100%', overflow: 'auto' }}>
                <TextField
            label="Source Name"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button size="small" onClick={handleValidateMapping} startIcon={<AltRouteIcon />} variant="contained" color="primary" sx={{  mt: 1 }}>Validate Mapping</Button>
     
    <DataGrid
      rows={sourceDataMapping.map((row, index) => ({ ...row, id: index }))}
      columns={mappingColumns}
      pageSize={5}
      autoHeight
      disableSelectionOnClick
    />
      </Box>
    ) : (
      <Typography>No schema available</Typography>
    )

  );  



  return (
    <Box sx={{ '& > *': { mb: '1px' } }}>

        <Accordion defaultExpanded
              expanded={expandedAccordion === 'fileUpload'} 
              onChange={handleAccordionChange('fileUpload')}
            >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        File Upload {uploadedFileName && `- ${uploadedFileName} (${uploadStatus ? uploadStatus.type : 'Pending'})`}
        </AccordionSummary>
        <AccordionDetails sx={{ mt:-3 }}>
        <ResourceFileUpload onUpload={handleFileUpload} type="dataDictionary" />
        {loading && <LinearProgress variant="determinate" value={progress} />}
        </AccordionDetails>
      </Accordion>

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


        <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="General" />
        <Tab label="Schema" />
        <Tab label="Sample Data" />
        <Tab label="Data Dictionary" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {activeTab === 0 && renderGeneralInfo()}
        {activeTab === 1 && renderSchema()}
        {activeTab === 2 && renderSampleData()}
        {activeTab === 3 && renderMapping()}
      </Box>          
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ResourceDataDictionary;