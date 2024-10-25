import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Autocomplete, Chip } from '@mui/material';
import stringSimilarity from 'string-similarity';

// Sample tags
const coreTags = ['PII', 'Sensitive', 'Confidential', 'Business', 'Required'];

const ResourceMappingTagging = ({ savedState }) => {
  const [matchResults, setMatchResults] = useState([]);
  
  // Get source schema
  const resourceSchema = JSON.parse(localStorage.getItem('resourcePreviewRows'));
  
  // Get data dictionary schema and data
  const dataDictionarySchema = JSON.parse(localStorage.getItem('ddResourcePreviewRows'));

  const dataDictionaryData = JSON.parse(localStorage.getItem('ddResourceGeneralConfig'));

  // Extract classified columns from data dictionary schema
  const getClassifiedColumns = useCallback((classificationType) => {
    return dataDictionarySchema?.filter(
      (column) => column.schemaClassification?.value === classificationType
    );
  }, [dataDictionarySchema]);

  const computeMatches = useCallback(() => {
    if (!resourceSchema?.length || !dataDictionarySchema?.length || !dataDictionaryData?.length) {
      console.log('Missing required data for matching');
      return;
    }

    // Get columns classified as table and column names
    const tableNameColumns = getClassifiedColumns('physical_table_name');
    const columnNameColumns = getClassifiedColumns('physical_column_name');

    if (!tableNameColumns?.length || !columnNameColumns?.length) {
      console.log('No classified columns found');
      return;
    }

    const tableNameField = tableNameColumns[0].name;
    const columnNameField = columnNameColumns[0].name;

    // Create arrays of valid strings for comparison
    const tableNames = dataDictionaryData
      .map(entry => String(entry[tableNameField] || ''))
      .filter(Boolean);
    
    const columnNames = dataDictionaryData
      .map(entry => String(entry[columnNameField] || ''))
      .filter(Boolean);

    console.log('Table Names:', tableNames);
    console.log('Column Names:', columnNames);

    const results = resourceSchema.map(sourceColumn => {
      const standardizedName = String(sourceColumn.standardizedSourceName || '');
      const columnName = String(sourceColumn.name || '');

      if (!standardizedName || !columnName) {
        console.log('Missing source column data:', sourceColumn);
        return null;
      }

      const tableMatch = stringSimilarity.findBestMatch(standardizedName, tableNames);
      const columnMatch = stringSimilarity.findBestMatch(columnName, columnNames);

      return {
        source_column_name: columnName,
        matched_table_name: tableMatch.bestMatch.target,
        matched_column_name: columnMatch.bestMatch.target,
        table_similarity_score: tableMatch.bestMatch.rating,
        column_similarity_score: columnMatch.bestMatch.rating,
        tags: []
      };
    }).filter(Boolean);

    setMatchResults(results);
  }, [resourceSchema, dataDictionarySchema, dataDictionaryData, getClassifiedColumns]);

  useEffect(() => {
    console.log('Resource Schema:', resourceSchema);
    console.log('DD Schema:', dataDictionarySchema);
    console.log('DD Data:', dataDictionaryData);
    
    if (resourceSchema && dataDictionarySchema && dataDictionaryData) {
      computeMatches();
    }
  }, [resourceSchema, dataDictionarySchema, dataDictionaryData, computeMatches]);

  const [selectedTags, setSelectedTags] = useState({});
  // Render match results and tagging interface
  return (
    <Box>
      {matchResults.map((match, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee' }}>
          <Typography variant="subtitle1">
            Source: {match.source_column_name}
          </Typography>
          <Typography>
            Table Match: {match.matched_table_name} 
            (Confidence: {(match.table_similarity_score * 100).toFixed(1)}%)
          </Typography>
          <Typography>
            Column Match: {match.matched_column_name}
            (Confidence: {(match.column_similarity_score * 100).toFixed(1)}%)
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            options={coreTags}
            value={match.tags}
            onChange={(_, newTags) => {
              setSelectedTags(prev => ({
                ...prev,
                [match.source_column_name]: newTags
              }));
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  sx={{ backgroundColor: 'lightblue' }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                label="Tags"
                placeholder="Add tags..."
              />
            )}
          />
        </Box>
      ))}
    </Box>
  );
};
export default ResourceMappingTagging;
