import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, TextField, Autocomplete, Chip, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import stringSimilarity from 'string-similarity';
import { getData } from '../utils/storageUtils';
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
    const standardizedName = String(savedState?.resourceSetup?.resourceSetup?.standardizedSourceName);
    const tableNameField = tableNameColumns[0].name;
    const columnNameField = columnNameColumns[0].name;

    return sourceData.ddResourceFullData.map(entry => ({
      value: `${entry[tableNameField]}.${entry[columnNameField]}`,
      tableName: entry[tableNameField],
      columnName: entry[columnNameField],
      description: entry.description || ''
    })).filter(col => col.tableName && col.columnName);
  }, [sourceData.ddResourceFullData, getClassifiedColumns]);
    const getColumnDataByClassification = useCallback((classificationType, rowData) => {
      const classifiedColumns = getClassifiedColumns(classificationType);
      if (!classifiedColumns?.length) return '';
  
      const columnName = classifiedColumns[0].name;
      return rowData[columnName] || '';
    }, [getClassifiedColumns]);

    const computeMatches = useCallback(() => {
      if (!sourceData.resourcePreviewRows?.length || !sourceData.ddResourceFullData?.length) {
        setMatchResults([]);
        return;
      }

      const standardizedTableName = String(savedState?.resourceSetup?.resourceSetup?.standardizedSourceName || '');
      if (!standardizedTableName) {
        setMatchResults([]);
        return;
      }

      const tableNameColumns = getClassifiedColumns('physical_table_name') || [];
      const columnNameColumns = getClassifiedColumns('physical_column_name') || [];

      if (!tableNameColumns.length || !columnNameColumns.length) {
        setMatchResults([]);
        return;
      }

      const tableNameField = tableNameColumns[0]?.name;
      const columnNameField = columnNameColumns[0]?.name;

      const validColumnNames = sourceData.ddResourceFullData
        .map(row => String(row[columnNameField] || ''))
        .filter(Boolean);

      if (!validColumnNames.length) {
        setMatchResults([]);
        return;
      }

      const results = sourceData.resourcePreviewRows.map(sourceColumn => {
        const sourceName = String(sourceColumn?.name || '');
        const columnMatch = validColumnNames.length ? 
          stringSimilarity.findBestMatch(sourceName, validColumnNames) :
          { bestMatch: { target: '', rating: 0 } };

        // Get the matched row data from data dictionary
        const matchedDDRow = sourceData.ddResourceFullData.find(
          row => row[columnNameField] === columnMatch.bestMatch.target
        );

        return {
          source_column_name: sourceName,
          matched_table_name: standardizedTableName,
          matched_column_name: columnMatch.bestMatch.target,
          column_similarity_score: columnMatch.bestMatch.rating,
          logicalTableName: getColumnDataByClassification('logical_table_name', matchedDDRow),
          logicalColumnName: getColumnDataByClassification('logical_column_name', matchedDDRow),
          columnDescription: getColumnDataByClassification('column_description', matchedDDRow),
          dataType: getColumnDataByClassification('data_type', matchedDDRow),
          primaryKey: getColumnDataByClassification('primary_key', matchedDDRow),
          foreignKey: getColumnDataByClassification('foreign_key', matchedDDRow),
          nullable: getColumnDataByClassification('nullable', matchedDDRow),
          isPII: Boolean(sourceColumn.isPII),
          isPHI: Boolean(sourceColumn.isPHI),
          isDisabled: Boolean(sourceColumn.isDisabled),
          alternativeName: sourceColumn.alternativeName || '',
          tags: Array.isArray(sourceColumn.tags) ? sourceColumn.tags : []
        };
      });

      setMatchResults(results);
    }, [sourceData, getClassifiedColumns, getColumnDataByClassification, savedState]);

    const handleMatchChange = useCallback((rowId, newValue) => {
      const columnNameColumns = getClassifiedColumns('physical_column_name') || [];
      const columnNameField = columnNameColumns[0]?.name;

      setMatchResults(prev => prev.map(row => {
        if (row.id === rowId) {
          const matchedDDRow = sourceData.ddResourceFullData.find(
            ddRow => ddRow[columnNameField] === newValue.columnName
          );

          return {
            ...row,
            matchedColumn: newValue,
            logicalTableName: getColumnDataByClassification('logical_table_name', matchedDDRow),
            logicalColumnName: getColumnDataByClassification('logical_column_name', matchedDDRow),
            columnDescription: getColumnDataByClassification('column_description', matchedDDRow),
            dataType: getColumnDataByClassification('data_type', matchedDDRow),
            primaryKey: getColumnDataByClassification('primary_key', matchedDDRow),
            foreignKey: getColumnDataByClassification('foreign_key', matchedDDRow),
            nullable: getColumnDataByClassification('nullable', matchedDDRow)
          };
        }
        return row;
      }));
    }, [sourceData, getColumnDataByClassification, getClassifiedColumns]);
    useEffect(() => {
      const loadData = async () => {
        const data = {
          ddResourceFullData: await getData('ddResourceFullData'),
        ddResourcePreviewRows: await getData('ddResourcePreviewRows'),
        resourcePreviewRows: await getData('resourcePreviewRows'),
        resourceSampleData: await getData('resourceSampleData'),
      };
      setSourceData(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    computeMatches();
  }, [computeMatches]);

  // const handleMatchChange = useCallback((rowId, newValue) => {
  //   setMatchResults(prev => prev.map(row => 
  //     row.id === rowId ? { ...row, matchedColumn: newValue } : row
  //   ));
  // }, []);

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
   limitTags={2}
   freeSolo  // Allows adding new custom tags
   options={coreTags} 
   value={params.row.tags}
   onChange={(_, newTags) => handleTagChange(params.row.id, newTags)}
   renderInput={(params) => <TextField {...params} label="Tags" placeholder="Add Tag" />}
   renderTags={(value, getTagProps) =>
     value.map((option, index) => (
       <Chip 
         variant="outlined" 
         label={option} 
         {...getTagProps({ index })} 
         style={{ backgroundColor: getTagColor(option) }} 
       />
     ))
   }
/>

      )
    },
    {
      field: 'logicalTableName',
      headerName: 'Logical Table Name',
      flex: 1,
      editable: true
    },
    {
      field: 'logicalColumnName',
      headerName: 'Logical Column Name',
      flex: 1,
      editable: true
    },
    {
      field: 'columnDescription',
      headerName: 'Column Description',
      flex: 1.5,
      editable: true
    },
    {
      field: 'dataType',
      headerName: 'Data Type',
      flex: 1,
      editable: true
    },
    {
      field: 'primaryKey',
      headerName: 'Primary Key',
      width: 100,
      type: 'boolean',
      editable: true
    },
    {
      field: 'foreignKey',
      headerName: 'Foreign Key',
      width: 100,
      type: 'boolean',
      editable: true
    },
    {
      field: 'nullable',
      headerName: 'Nullable',
      width: 100,
      type: 'boolean',
      editable: true
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
