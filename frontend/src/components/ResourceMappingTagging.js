import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Autocomplete, TextField, Box, Typography, Chip } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import stringSimilarity from 'string-similarity';
import { getData, STORES } from '../utils/storageUtils';

const coreTags = ['PII', 'Sensitive', 'Confidential', 'Business', 'Required'];

const getTagColor = (tag) => {
  const colors = {
    PII: '#ffcdd2',
    Sensitive: '#fff9c4',
    Confidential: '#ffccbc',
    Business: '#c8e6c9',
    Required: '#bbdefb'
  };
  return colors[tag] || '#e0e0e0';
};

const ResourceMappingTagging = ({ savedState }) => {
  const [matchResults, setMatchResults] = useState([]);
  const [sourceData, setSourceData] = useState({
    ddResourceFullData: null,
    ddResourcePreviewRows: null,
    ddResourceSampleData: null,
    resourcePreviewRows: null,
    resourceSampleData: null,
    resourceSetup: null
  });

  const getDictionaryColumns = useCallback(() => {
    return sourceData.ddResourcePreviewRows?.map(col => ({
      value: col.name,
      label: col.name,
      description: col.description
    })) || [];
  }, [sourceData.ddResourcePreviewRows]);

  const handleMatchChange = useCallback((rowId, newValue) => {
    setMatchResults(prev => prev.map(row => 
      row.id === rowId 
        ? { ...row, matched_column_name: newValue.value }
        : row
    ));
  }, []);

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
  }, [sourceData, getClassifiedColumns, savedState?.resourceSetup?.resourceSetup?.standardizedSourceName]);

  // Trigger computation when data changes
  useEffect(() => {
    console.log('Current Source Data:', sourceData);
    
    if (sourceData.resourcePreviewRows && sourceData.ddResourcePreviewRows && sourceData.ddResourceFullData) {
      computeMatches();
    } else {
      console.log('Missing data to compute matches');
    }
  }, [sourceData, computeMatches]);

  const columns = [
    {
      field: 'sourceColumn',
      headerName: 'Source Column',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>{params.value}</Typography>
          {params.row.isPII && <LockPersonIcon color="primary" />}
          {params.row.isPHI && <LocalHospitalIcon color="primary" />}
        </Box>
      )
    },
    {
      field: 'alternativeName',
      headerName: 'Alternative Name',
      flex: 1,
      editable: true
    },
    {
      field: 'matchedColumn',
      headerName: 'Matched Data Dictionary Column',
      flex: 2,
      renderCell: (params) => (
        <Autocomplete
          fullWidth
          size="small"
          options={params.row.possibleMatches}
          value={params.value}
          onChange={(_, newValue) => handleMatchChange(params.row.id, newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
      )
    },
    {
      field: 'matchScore',
      headerName: 'Match Score',
      width: 130,
      renderCell: (params) => (
        <Box sx={{
          width: '100%',
          bgcolor: params.value > 0.7 ? 'success.light' : params.value > 0.4 ? 'warning.light' : 'error.light',
          p: 1,
          borderRadius: 1
        }}>
          {(params.value * 100).toFixed(1)}%
        </Box>
      )
    },
    {
      field: 'tags',
      headerName: 'Tags',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {params.value.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ backgroundColor: getTagColor(tag) }}
            />
          ))}
        </Box>
      )
    }
  ];

  const rows = matchResults.map((match, index) => ({
    id: index,
    sourceColumn: match.source_column_name,
    alternativeName: match.alternative_name,
    matchedColumn: match.matched_column_name,
    possibleMatches: getDictionaryColumns(),
    matchScore: match.column_similarity_score,
    tags: match.tags,
    isPII: match.isPII,
    isPHI: match.isPHI,
    isEnabled: match.isEnabled
  }));

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        checkboxSelection
        disableSelectionOnClick
        density="comfortable"
        // Performance optimizations
        rowBuffer={10}
        rowThreshold={100}
        columnBuffer={5}
        scrollbarSize={17}
        getRowHeight={() => 'auto'}
        // Disable expensive features
        disableColumnMenu
        disableColumnFilter
        disableVirtualization={false}
        // Cache row height
        cacheRowHeight
        // Optimize components
        components={{
          // BaseCheckbox: React.memo(Checkbox),
          BaseTextField: React.memo(TextField)
        }}
        sx={{
          '& .MuiDataGrid-cell': { 
            py: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          },
          '& .match-high': { bgcolor: 'success.lighter' },
          '& .match-medium': { bgcolor: 'warning.lighter' },
          '& .match-low': { bgcolor: 'error.lighter' }
        }}
      />
    </Box>  );
};

export default ResourceMappingTagging;
