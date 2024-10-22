import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Autocomplete, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { stringSimilarity } from 'string-similarity';

const ResourceDataDictionaryClassification = ({ schema, sourceSchema, onClassificationChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [classifications, setClassifications] = useState({});
  const [sourceMapping, setSourceMapping] = useState([]);

  const standardClassifications = [
    'physical_table_name', 'logical_table_name', 'physical_column_name', 'logical_column_name',
    'column_description', 'data_type', 'nullability', 'primary_key', 'foreign_key', 'tags'
  ];

  useEffect(() => {
    // Auto-classify based on similarity
    const autoClassify = schema.reduce((acc, column) => {
      const bestMatch = standardClassifications.reduce((best, classification) => {
        const similarity = stringSimilarity.compareTwoStrings(column.name.toLowerCase(), classification.toLowerCase());
        return similarity > best.score ? { classification, score: similarity } : best;
      }, { classification: '', score: 0 });

      acc[column.name] = bestMatch.score > 0.3 ? bestMatch.classification : '';
      return acc;
    }, {});

    setClassifications(autoClassify);
  }, [schema]);

  useEffect(() => {
    // Map source schema to data dictionary
    if (sourceSchema && schema) {
      const mapping = sourceSchema.map(sourceColumn => {
        const match = schema.find(dictColumn => 
          dictColumn.name.toLowerCase() === sourceColumn.name.toLowerCase()
        );
        return {
          sourceColumn: sourceColumn.name,
          sourceDataType: sourceColumn.type,
          dictionaryColumn: match ? match.name : '',
          dictionaryDataType: match ? match.type : '',
          classification: match ? classifications[match.name] : ''
        };
      });
      setSourceMapping(mapping);
    }
  }, [sourceSchema, schema, classifications]);

  const handleClassificationChange = (columnName, newClassification) => {
    setClassifications(prev => ({ ...prev, [columnName]: newClassification }));
    onClassificationChange({ ...classifications, [columnName]: newClassification });
  };

  const renderSchemaClassification = () => (
    <Box>
      {schema.map(column => (
        <Autocomplete
          key={column.name}
          options={standardClassifications}
          value={classifications[column.name] || ''}
          onChange={(event, newValue) => handleClassificationChange(column.name, newValue)}
          renderInput={(params) => <TextField {...params} label={column.name} />}
        />
      ))}
    </Box>
  );

  const renderDataMapping = () => (
    <DataGrid
      rows={sourceMapping}
      columns={[
        { field: 'sourceColumn', headerName: 'Source Column', width: 150 },
        { field: 'sourceDataType', headerName: 'Source Data Type', width: 150 },
        { field: 'dictionaryColumn', headerName: 'Dictionary Column', width: 150 },
        { field: 'dictionaryDataType', headerName: 'Dictionary Data Type', width: 150 },
        { field: 'classification', headerName: 'Classification', width: 150 },
      ]}
    />
  );

  return (
    <Box>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Schema Classification" />
        <Tab label="Data Mapping" />
      </Tabs>
      {activeTab === 0 && renderSchemaClassification()}
      {activeTab === 1 && renderDataMapping()}
    </Box>
  );
};

export default ResourceDataDictionaryClassification;