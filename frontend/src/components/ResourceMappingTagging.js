import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Autocomplete, Chip } from '@mui/material';
import stringSimilarity from 'string-similarity';

// Sample tags
const coreTags = ['PII', 'Sensitive', 'Confidential', 'Business', 'Required'];

const ResourceMappingTagging = ({savedState, schema, dataDictionary, dataDictionarySchema }) => {
  console.log("ResourceMappingTagging-> savedState:", savedState);
  const [selectedTags, setSelectedTags] = useState({});
  const [matches, setMatches] = useState({});

  // Extract classified columns from data dictionary schema
  const getClassifiedColumns = (classificationType) => {
    return dataDictionarySchema.filter(
      (dictField) => dictField.column_schema_classification === classificationType
    );
  };

  // Function to compute similarity matches
  const computeSimilarityMatches = () => {
    const matchResults = {};

    // Get columns classified as containing table and column names
    const tableNameColumns = getClassifiedColumns('physical_table_name');
    const columnNameColumns = getClassifiedColumns('physical_column_name');

    schema.forEach((sourceField) => {
      // Match table name
      const bestTableMatch = stringSimilarity.findBestMatch(
        sourceField.standardizedSourceName, // Standardized source name
        tableNameColumns.map((dictField) => dictField.column_name) // Data dictionary physical table names
      );

      // Match column name (or alternative name)
      const bestColumnMatch = stringSimilarity.findBestMatch(
        sourceField.alternative_column_name || sourceField.column_name, // Source column name or alternative name
        columnNameColumns.map((dictField) => dictField.column_name) // Data dictionary physical column names
      );

      // Store the best match for both table and column
      matchResults[sourceField.name] = {
        bestTableMatch: bestTableMatch.bestMatch.target,
        tableConfidence: bestTableMatch.bestMatch.rating,
        bestColumnMatch: bestColumnMatch.bestMatch.target,
        columnConfidence: bestColumnMatch.bestMatch.rating,
      };
    });

    setMatches(matchResults);
  };

  // Compute matches when component mounts or when data changes
  useEffect(() => {
    if (schema && dataDictionary && dataDictionarySchema) {
      computeSimilarityMatches();
    }
  }, [schema, dataDictionary, dataDictionarySchema]);

  // Handle tag changes
  const handleTagChange = (field, newTags) => {
    setSelectedTags((prevTags) => ({
      ...prevTags,
      [field.name]: newTags,
    }));
  };

  return (
    <Box>
      <Typography variant="h6">Mapping & Tagging</Typography>
      {schema && schema.map((field, index) => (
        <Box key={index} sx={{ marginBottom: '10px' }}>
          <Typography variant="subtitle1">{field.name}</Typography>

          {/* Display matching result for both table and column */}
          <Typography variant="body2" color="textSecondary">
            Best Table Match: {matches[field.name]?.bestTableMatch || 'No Match'} 
            (Confidence: {matches[field.name]?.tableConfidence?.toFixed(2)})
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Best Column Match: {matches[field.name]?.bestColumnMatch || 'No Match'} 
            (Confidence: {matches[field.name]?.columnConfidence?.toFixed(2)})
          </Typography>

          {/* Autocomplete for tagging with custom tags allowed */}
          <Autocomplete
            multiple
            freeSolo
            options={coreTags} // Core predefined tags
            value={selectedTags[field.name] || []}
            onChange={(event, newTags) => handleTagChange(field, newTags)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={index}
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                label="Tags"
                fullWidth
              />
            )}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ResourceMappingTagging;
