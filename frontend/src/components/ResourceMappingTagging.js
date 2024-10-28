import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, TextField, Autocomplete, Chip, Tooltip , IconButton} from '@mui/material';
import { Dialog,   DialogTitle,   DialogContent,  Card,   CardContent,   Grid,   Button,   List,  ListItem,  ListItemText,  ListItemSecondaryAction} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import stringSimilarity from 'string-similarity';
import { getData } from '../utils/storageUtils';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';

import SearchIcon from '@mui/icons-material/Search';
import ResourceDataDictionaryMappingCandidateDialog from './ResourceDataDictionaryMappingCandidateDialog';


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
  const standardizedName = String(savedState?.resourceSetup?.resourceSetup?.standardizedSourceName || '');
  const [selectedDictionaryTable, setSelectedDictionaryTable] = useState(standardizedName);
  const [tableStats, setTableStats] = useState(null);
  const [matchResults, setMatchResults] = useState([]);
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [openTableSelection, setOpenTableSelection] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);

  const [openCandidateDialog, setOpenCandidateDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);



  
  const handleOpenCandidateDialog = (row) => {
    setSelectedRow(row);
    setOpenCandidateDialog(true);
  };
  
  const handleCandidateSelect = (candidate) => {
    if (selectedRow) {
      handleMatchChange(selectedRow.id, {
        tableName: selectedDictionaryTable,
        columnName: candidate.columnName
      });
    }
  };

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

  const getColumnDataByClassification = useCallback((classificationType, rowData) => {
    const classifiedColumns = getClassifiedColumns(classificationType);
    if (!classifiedColumns?.length || !rowData) return '';
    const columnName = classifiedColumns[0].name;
    return rowData[columnName] || '';
  }, [getClassifiedColumns]);

  const calculateTableStats = useCallback((tableName) => {
    const tableNameColumns = getClassifiedColumns('physical_table_name') || [];
    const columnNameColumns = getClassifiedColumns('physical_column_name') || [];
    const tableNameField = tableNameColumns[0]?.name;
    const columnNameField = columnNameColumns[0]?.name;

    const tableRows = sourceData.ddResourceFullData?.filter(row => 
      row[tableNameField] === tableName
    );

    if (!tableRows?.length) return null;

    const tableColumns = tableRows.map(row => row[columnNameField]);
    const sourceColumns = sourceData.resourcePreviewRows
      .filter(col => !col.isDisabled)
      .map(col => col.name);

    let matchCount = 0;
    let totalScore = 0;
    
    sourceColumns.forEach(sourceCol => {
      const scores = tableColumns.map(targetCol => 
        stringSimilarity.compareTwoStrings(sourceCol.toLowerCase(), targetCol.toLowerCase())
      );
      const bestScore = Math.max(...scores);
      if (bestScore > 0.6) matchCount++;
      totalScore += bestScore;
    });

    return {
      tableName,
      matchedColumns: matchCount,
      unmatchedColumns: sourceColumns.length - matchCount,
      averageColumnScore: totalScore / sourceColumns.length,
      confidenceScore: (matchCount / sourceColumns.length) * 100
    };
  }, [sourceData, getClassifiedColumns]);

  useEffect(() => {
    if (selectedDictionaryTable) {
      const stats = calculateTableStats(selectedDictionaryTable);
      setTableStats(stats);
      
      if (stats?.confidenceScore < 100) {
        // Handle showing warning to user about low confidence match
      }
    }
  }, [selectedDictionaryTable, calculateTableStats]);

  // Rest of the component code with matchResults usage...

  const getDictionaryColumns = useCallback(() => {
    const tableNameColumns = getClassifiedColumns('physical_table_name') || [];
    const columnNameColumns = getClassifiedColumns('physical_column_name') || [];
    
    if (!sourceData.ddResourceFullData || !tableNameColumns.length || !columnNameColumns.length) {
      return [];
    }

    const tableNameField = tableNameColumns[0].name;
    const columnNameField = columnNameColumns[0].name;
    // Filter by selected table first
    return sourceData.ddResourceFullData
      .filter(entry => entry[tableNameField] === selectedDictionaryTable)
      .map(entry => ({
        columnName: entry[columnNameField],
        tableName: entry[tableNameField],
        logicalName: getColumnDataByClassification('logical_column_name', entry),
        dataType: getColumnDataByClassification('data_type', entry),
        description: getColumnDataByClassification('column_description', entry),
        ddRow: entry
      }))
      .filter(col => col.columnName);
  }, [sourceData, getClassifiedColumns, selectedDictionaryTable, getColumnDataByClassification]);

  // Compute matches between source columns and dictionary
  const computeMatches = useCallback(() => {
    if (!sourceData.resourcePreviewRows?.length || !sourceData.ddResourceFullData?.length) {
      setMatchResults([]);
      return;
    }

    const tableNameColumns = getClassifiedColumns('physical_table_name') || [];
    const columnNameColumns = getClassifiedColumns('physical_column_name') || [];
    const tableNameField = tableNameColumns[0]?.name;
    const columnNameField = columnNameColumns[0]?.name;

    // Only get columns from the selected table
    const validColumnNames = sourceData.ddResourceFullData
      .filter(row => row[tableNameField] === selectedDictionaryTable)
      .map(row => ({
        columnName: String(row[columnNameField] || ''),
        ddRow: row
      }))
      .filter(item => item.columnName);

    const results = sourceData.resourcePreviewRows
      .filter(sourceColumn => sourceColumn?.name)
      .map((sourceColumn, index) => {
        const sourceName = String(sourceColumn.name).toLowerCase();
        const allMatches = validColumnNames
          .map(({columnName, ddRow}) => ({
            columnName,
            ddRow,
            score: stringSimilarity.compareTwoStrings(sourceName, columnName.toLowerCase())
          }))
          .filter(match => match.score > 0.3)
          .sort((a, b) => b.score - a.score);

        const bestMatch = allMatches[0];

        return {
          id: index,
          source_column_name: sourceName,
          matched_table_name: selectedDictionaryTable,
          matched_column_name: bestMatch?.columnName || '',
          column_similarity_score: bestMatch?.score || 0,
          mappingStatus: bestMatch?.score > 0.3 ? 'mapped' : 'unmapped',
          hasMultipleCandidates: allMatches.length > 1,
          candidateMatches: allMatches,
          logicalTableName: getColumnDataByClassification('logical_table_name', bestMatch?.ddRow),
          logicalColumnName: getColumnDataByClassification('logical_column_name', bestMatch?.ddRow),
          columnDescription: getColumnDataByClassification('column_description', bestMatch?.ddRow),
          dataType: getColumnDataByClassification('data_type', bestMatch?.ddRow),
          primaryKey: getColumnDataByClassification('primary_key', bestMatch?.ddRow),
          foreignKey: getColumnDataByClassification('foreign_key', bestMatch?.ddRow),
          nullable: getColumnDataByClassification('nullable', bestMatch?.ddRow),
          isPII: Boolean(sourceColumn.isPII),
          isPHI: Boolean(sourceColumn.isPHI),
          isDisabled: Boolean(sourceColumn.isDisabled),
          alternativeName: sourceColumn.alternativeName || '',
          tags: Array.isArray(sourceColumn.tags) ? sourceColumn.tags : []
        };
      });

    setMatchResults(results);
  }, [sourceData, getClassifiedColumns, selectedDictionaryTable, getColumnDataByClassification]);

    const standardizedTableName = String(savedState?.resourceSetup?.resourceSetup?.standardizedSourceName || '');

    const handleMatchChange = useCallback((rowId, newValue) => {
      const columnNameColumns = getClassifiedColumns('physical_column_name') || [];
      const columnNameField = columnNameColumns[0]?.name;
      const tableNameColumns = getClassifiedColumns('physical_table_name') || [];
      const tableNameField = tableNameColumns[0]?.name;

      setMatchResults(prev => prev.map(row => {
        if (row.id === rowId) {
          const matchedDDRow = sourceData.ddResourceFullData.find(
            ddRow => ddRow[columnNameField] === newValue.columnName && 
                 ddRow[tableNameField] === standardizedTableName
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
    }, [getClassifiedColumns, sourceData.ddResourceFullData, getColumnDataByClassification, standardizedTableName]);


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


    // Add this new function with the existing ones
    const getAllTableStats = useCallback(() => {
      const tableNameColumns = getClassifiedColumns('physical_table_name') || [];
      const uniqueTables = [...new Set(sourceData.ddResourceFullData?.map(
        row => row[tableNameColumns[0]?.name]
      ))];
  
      return uniqueTables
        .map(tableName => calculateTableStats(tableName))
        .filter(stats => stats?.confidenceScore >= 60)
        .sort((a, b) => b.confidenceScore - a.confidenceScore);
    }, [sourceData, getClassifiedColumns, calculateTableStats]);



  // Add these component definitions before the main ResourceMappingTagging component
const TableStatsCard = ({ stats, onChangeTable }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="textSecondary">Current Table</Typography>
              <Typography variant="h6">{stats?.tableName}</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" color="textSecondary">Confidence Score</Typography>
              <Typography variant="h6" color={stats?.confidenceScore >= 60 ? 'success.main' : 'error.main'}>
                {stats?.confidenceScore?.toFixed(1)}%
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" color="textSecondary">Matched Columns</Typography>
              <Typography variant="h6">{stats?.matchedColumns}</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" color="textSecondary">Unmatched Columns</Typography>
              <Typography variant="h6">{stats?.unmatchedColumns}</Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" color="textSecondary">Column Score</Typography>
              <Typography variant="h6">{(stats?.averageColumnScore * 100)?.toFixed(1)}%</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={onChangeTable}
            sx={{ minWidth: 200 }}
          >
            Change Table
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);


const TableSelectionDialog = ({ open, onClose, tables, onSelect }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>Select Table</DialogTitle>
    <DialogContent>
      <List>
        {tables.map((table) => (
          <ListItem 
            key={table.tableName} 
            button 
            onClick={() => onSelect(table.tableName)}
            sx={{
              borderRadius: 1,
              mb: 1,
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <ListItemText
              primary={table.tableName}
              secondary={`Matched: ${table.matchedColumns} | Unmatched: ${table.unmatchedColumns}`}
            />
            <ListItemSecondaryAction>
              <Typography 
                variant="body2" 
                color={table.confidenceScore >= 60 ? 'success.main' : 'error.main'}
              >
                {table.confidenceScore.toFixed(1)}%
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </DialogContent>
  </Dialog>
);




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
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
          <Autocomplete
            size="small"
            fullWidth
            options={[
              { tableName: '', columnName: 'No Map' }, 
              ...getDictionaryColumns()
            ]}
            value={params.row.matchScore < 0.4 ? { tableName: '', columnName: 'No Map' } : params.row.matchedColumn}
            onChange={(_, newValue) => handleMatchChange(params.row.id, newValue)}
            getOptionLabel={(option) => option ? 
              option.columnName === 'No Map' ? 'No Map' : 
              `${option.tableName}.${option.columnName}` : ''
            }
            isOptionEqualToValue={(option, value) => option?.columnName === value?.columnName}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
          <IconButton
            size="small"
            onClick={() => handleOpenCandidateDialog(params.row)}
            sx={{ ml: 1 }}
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        </Box>
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
                  '& .MuiChip-label': { fontSize: '0.75rem' }
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} variant="outlined" size="small" placeholder="Add tags" />
          )}
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
      isDisabled: match.isDisabled,
      logicalTableName: match.logicalTableName,
      logicalColumnName: match.logicalColumnName,
      columnDescription: match.columnDescription,
      dataType: match.dataType,
      primaryKey: match.primaryKey,
      foreignKey: match.foreignKey,
      nullable: match.nullable
    })), [matchResults]);
    return (
      <Box>
        <TableStatsCard 
          stats={tableStats}
          onChangeTable={() => {
            setAvailableTables(getAllTableStats());
            setOpenTableSelection(true);
          }}
        />
        <TableSelectionDialog
          open={openTableSelection}
          onClose={() => setOpenTableSelection(false)}
          tables={availableTables}
          onSelect={(tableName) => {
            setSelectedDictionaryTable(tableName);
            setOpenTableSelection(false);
          }}
        />
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
        <ResourceDataDictionaryMappingCandidateDialog
          open={openCandidateDialog}
          onClose={() => setOpenCandidateDialog(false)}
          sourceColumn={selectedRow?.sourceColumn}
          candidates={selectedRow?.candidateMatches || []}
          onSelect={handleCandidateSelect}
        />
        </Box>
      </Box>
    );
  };

  
export default ResourceMappingTagging;

