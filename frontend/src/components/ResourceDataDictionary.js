import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, TextField, Autocomplete, Chip, Tooltip, Skeleton, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import stringSimilarity from 'string-similarity';
import { getData, STORES } from '../utils/storageUtils';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';

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
  const [isLoading, setIsLoading] = useState(true);
  const [matchResults, setMatchResults] = useState([]);
  const [sourceData, setSourceData] = useState({
    ddResourceFullData: null,
    ddResourcePreviewRows: null,
    ddResourceSampleData: null,
    resourcePreviewRows: null,
    resourceSampleData: null,
    resourceSetup: null
  });

  const getClassifiedColumns = useCallback((classificationType) => {
    return sourceData.ddResourcePreviewRows?.filter(
      (column) => column.schemaClassification?.value === classificationType
    );
  }, [sourceData.ddResourcePreviewRows]);

  const getDictionaryColumns = useCallback(() => {
    const tableNameColumns = getClassifiedColumns('physical_table_name');
    const columnNameColumns = getClassifiedColumns('physical_column_name');
    
    if (!sourceData.ddResourceFullData || !tableNameColumns.length || !columnNameColumns.length) {
      return [];
    }

    const tableNameField = tableNameColumns[0].name;
    const columnNameField = columnNameColumns[0].name;

    return sourceData.ddResourceFullData.map(entry => ({
      value: `${entry[tableNameField]}.${entry[columnNameField]}`,
      tableName: entry[tableNameField],
      columnName: entry[columnNameField],
      description: entry.description || ''
    })).filter(col => col.tableName && col.columnName);
  }, [sourceData.ddResourceFullData, getClassifiedColumns]);

  const computeMatches = useCallback(() => {
    if (!sourceData.resourcePreviewRows?.length || !sourceData.ddResourceFullData?.length) {
      setMatchResults([]);
      return;
    }

    const tableNameColumns = getClassifiedColumns('physical_table_name') || [];
    const columnNameColumns = getClassifiedColumns('physical_column_name') || [];
  
    if (!tableNameColumns.length || !columnNameColumns.length) {
      setMatchResults([]);
      return;
    }

    const tableNameField = tableNameColumns[0]?.name || '';
    const columnNameField = columnNameColumns[0]?.name || '';
    

    const validTableNames = [...new Set(sourceData.ddResourceFullData
      .map(row => String(row[tableNameField] || ''))
      .filter(name => name.length > 0))];

    const validColumnNames = sourceData.ddResourceFullData
      .map(row => String(row[columnNameField] || ''))
      .filter(name => name.length > 0);

    if (!validTableNames.length || !validColumnNames.length) {
      setMatchResults([]);
      return;
    }

    const results = sourceData.resourcePreviewRows.map(sourceColumn => {
      const sourceName = String(sourceColumn?.name || '');
    
      const tableMatch = sourceName && validTableNames.length
      ? stringSimilarity.findBestMatch(sourceName, validTableNames)
      : { bestMatch: { target: '', rating: 0 } };
    
     const columnMatch = sourceName && validColumnNames.length
      ? stringSimilarity.findBestMatch(sourceName, validColumnNames)
      : { bestMatch: { target: '', rating: 0 } };
    

      return {
        source_column_name: sourceName,
        matched_table_name: tableMatch.bestMatch.target,
        matched_column_name: columnMatch.bestMatch.target,
        table_similarity_score: tableMatch.bestMatch.rating,
        column_similarity_score: columnMatch.bestMatch.rating,
        isPII: Boolean(sourceColumn?.isPII),
        isPHI: Boolean(sourceColumn?.isPHI),
        isDisabled: Boolean(sourceColumn?.isDisabled),
        alternativeName: sourceColumn?.alternativeName || '',
        tags: Array.isArray(sourceColumn?.tags) ? sourceColumn.tags : []
      };
    });

    setMatchResults(results);
  }, [sourceData, getClassifiedColumns]);
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = {
        ddResourceFullData: await getData(STORES.DD_FULL_DATA),
        ddResourcePreviewRows: await getData(STORES.DD_PREVIEW),
        ddResourceSampleData: await getData(STORES.DD_SAMPLE),
        resourcePreviewRows: await getData(STORES.RESOURCE_PREVIEW),
        resourceSampleData: await getData(STORES.RESOURCE_SAMPLE),
        resourceSetup: await getData(STORES.RESOURCE_SETUP)
      };
      setSourceData(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      computeMatches();
    }
  }, [computeMatches, isLoading]);

  const handleMatchChange = useCallback((rowId, newValue) => {
    setMatchResults(prev => prev.map(row => 
      row.id === rowId ? { ...row, matchedColumn: newValue } : row
    ));
  }, []);

  const handleTagChange = useCallback((rowId, newTags) => {
    setMatchResults(prev => prev.map(row => 
      row.id === rowId ? { ...row, tags: newTags } : row
    ));
  }, []);

  const columns = [
    {
      field: 'sourceColumn',
      headerName: 'Source Column',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2">{params.value}</Typography>
          <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
            {params.row.isPII && <LockPersonIcon sx={{ fontSize: 16 }} color="primary" />}
            {params.row.isPHI && <LocalHospitalIcon sx={{ fontSize: 16 }} color="primary" />}
            {params.row.isDisabled && <BlockIcon sx={{ fontSize: 16 }} color="error" />}
            {params.row.alternativeName && (
              <Tooltip title={`Alternative Name: ${params.row.alternativeName}`}>
                <EditIcon sx={{ fontSize: 16 }} color="info" />
              </Tooltip>
            )}
          </Box>
        </Box>
      )
    },
    {
      field: 'matchedColumn',
      headerName: 'Data Dictionary Match',
      flex: 2,
      renderCell: (params) => (
        <Autocomplete
          size="small"
          fullWidth
          options={getDictionaryColumns()}
          value={params.row.matchedColumn}
          onChange={(_, newValue) => handleMatchChange(params.row.id, newValue)}
          getOptionLabel={(option) => option ? `${option.tableName}.${option.columnName}` : ''}
          isOptionEqualToValue={(option, value) => option?.value === value?.value}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" size="small" />
          )}
        />
      )
    },
    {
      field: 'matchScore',
      headerName: 'Score',
      width: 80,
      renderCell: (params) => (
        <Box sx={{
          width: '100%',
          bgcolor: params.value > 0.7 ? 'success.light' : params.value > 0.4 ? 'warning.light' : 'error.light',
          p: 0.5,
          borderRadius: 1,
          fontSize: '0.75rem',
          textAlign: 'center'
        }}>
          {(params.value * 100).toFixed(0)}%
        </Box>
      )
    },
    {
      field: 'tags',
      headerName: 'Tags',
      flex: 1.5,
      renderCell: (params) => (
        <Autocomplete
          multiple
          size="small"
          freeSolo
          options={coreTags}
          value={params.row.tags}
          onChange={(_, newValue) => handleTagChange(params.row.id, newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                sx={{ 
                  backgroundColor: getTagColor(option),
                  height: '20px',
                  '& .MuiChip-label': {
                    fontSize: '0.75rem'
                  }
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" size="small" />
          )}
        />
      )
    }
  ];

  const rows = useMemo(() => 
    matchResults.map((match, index) => ({
      id: index,
      sourceColumn: match.source_column_name,
      alternativeName: match.alternative_name || '',
      matchedColumn: {
        tableName: match.matched_table_name,
        columnName: match.matched_column_name
      },
      matchScore: match.column_similarity_score,
      tags: match.tags || [],
      isPII: match.isPII,
      isPHI: match.isPHI,
      isDisabled: match.isDisabled
    })), [matchResults]);

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', height: 400 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
        <Skeleton variant="rectangular" height={50} sx={{ mb: 1 }} />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={52} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={15}
        rowsPerPageOptions={[15, 30, 50]}
        disableSelectionOnClick
        density="compact"
        getRowHeight={() => 45}
        sx={{
          '& .MuiDataGrid-cell': { 
            py: 0.5,
            fontSize: '0.875rem'
          },
          '& .MuiDataGrid-columnHeader': {
            fontSize: '0.875rem'
          }
        }}
      />
    </Box>
  );
};

export default ResourceMappingTagging;
