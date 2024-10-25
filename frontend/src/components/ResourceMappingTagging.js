import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Autocomplete, Chip } from '@mui/material';
import stringSimilarity from 'string-similarity';
import { getData } from '../utils/storageUtils';

// Core tags for classification
const coreTags = ['PII', 'Sensitive', 'Confidential', 'Business', 'Required'];

const ResourceMappingTagging = ({ savedState }) => {
  const [matchResults, setMatchResults] = useState([]);
  const [sourceData, setSourceData] = useState({
    ddResourceFullData: null,
    ddResourcePreviewRows: null,
    resourcePreviewRows: null,
    resourceSampleData: null,
  });

  // Load data from storage on component mount
  useEffect(() => {
    const loadData = async () => {
      const data = {
        ddResourceFullData: await getData('ddResourceFullData'),
        ddResourcePreviewRows: await getData('ddResourcePreviewRows'),
        resourcePreviewRows: await getData('resourcePreviewRows'),
        resourceSampleData: await getData('resourceSampleData'),
      };
      setSourceData(data);
      console.log('Loaded Data:', data);
    };

    loadData();
  }, []);

  // Get columns classified by a specific type
  const getClassifiedColumns = useCallback((classificationType) => {
    const classifiedColumns = sourceData.ddResourcePreviewRows?.filter(
      (column) => column.schemaClassification?.value === classificationType
    ) || [];

    console.log(`Classified Columns for '${classificationType}':`, classifiedColumns);
    return classifiedColumns;
  }, [sourceData.ddResourcePreviewRows]);

  // Compute matches between source and classified columns
  const computeMatches = useCallback(() => {
    const { resourcePreviewRows, ddResourceFullData } = sourceData;

    if (!resourcePreviewRows?.length || !ddResourceFullData?.length) {
      console.log('Missing required data for matching');
      return;
    }

    const tableNameColumns = getClassifiedColumns('physical_table_name');
    const columnNameColumns = getClassifiedColumns('physical_column_name');

    if (!tableNameColumns.length || !columnNameColumns.length) {
      console.log('No classified columns found for matching');
      return;
    }

    const tableNameField = tableNameColumns[0].name;
    const columnNameField = columnNameColumns[0].name;

    console.log('Using fields for matching:', {
      tableNameField,
      columnNameField,
    });

    // Create arrays for table and column names
    const tableNames = ddResourceFullData
      .map(entry => String(entry[tableNameField] || ''))
      .filter(Boolean);
    
    const columnNames = ddResourceFullData
      .map(entry => String(entry[columnNameField] || ''))
      .filter(Boolean);

    console.log('Extracted Table Names:', tableNames);
    console.log('Extracted Column Names:', columnNames);
 

    const results = resourcePreviewRows.map(sourceColumn => {

      const standardizedName = String(savedState?.resourceSetup?.resourceSetup?.standardizedSourceName);
      const columnName = String(sourceColumn.name || '');

      console.log('Extracted standardizedName :', standardizedName);

      // Verbose logging for source columns
      console.log('Evaluating Source Column:', { sourceColumn });

      if (!standardizedName || !columnName) {
        console.log('Missing standardized or source column name:', { standardizedName, columnName, sourceColumn });
        return null;
      }

      const tableMatch = stringSimilarity.findBestMatch(standardizedName, tableNames);
      const columnMatch = stringSimilarity.findBestMatch(columnName, columnNames);

      console.log('Matches Found:', {
        tableMatch,
        columnMatch,
      });

      return {
        source_column_name: columnName,
        matched_table_name: tableMatch.bestMatch.target,
        matched_column_name: columnMatch.bestMatch.target,
        table_similarity_score: tableMatch.bestMatch.rating,
        column_similarity_score: columnMatch.bestMatch.rating,
        tags: [],
      };
    }).filter(Boolean);

    console.log('Computed Match Results:', results);
    setMatchResults(results);
  }, [sourceData, getClassifiedColumns]);

  // Trigger computation when data changes
  useEffect(() => {
    console.log('Current Source Data:', sourceData);
    
    if (sourceData.resourcePreviewRows && sourceData.ddResourcePreviewRows && sourceData.ddResourceFullData) {
      computeMatches();
    } else {
      console.log('Missing data to compute matches');
    }
  }, [sourceData, computeMatches]);

  // Handle selected tags for each match result
  const handleTagChange = (sourceColumnName, newTags) => {
    setMatchResults((prevResults) =>
      prevResults.map((match) =>
        match.source_column_name === sourceColumnName
          ? { ...match, tags: newTags }
          : match
      )
    );
    console.log(`Updated Tags for ${sourceColumnName}:`, newTags);
  };

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
            onChange={(_, newTags) => handleTagChange(match.source_column_name, newTags)}
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
