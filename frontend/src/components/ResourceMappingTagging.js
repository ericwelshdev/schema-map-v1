import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, TextField, Autocomplete, Chip, Tooltip , IconButton} from '@mui/material';
import { Card,   CardContent,   Grid,   Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import stringSimilarity from 'string-similarity';
import { getData, setData } from '../utils/storageUtils';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';

import SearchIcon from '@mui/icons-material/Search';
import ResourceDataDictionaryColumnMappingCandidateDialog  from './ResourceDataDictionaryColumnMappingCandidateDialog';
import ResourceDataDictionaryTableSelectionDialog from './ResourceDataDictionaryTableSelectionDialog';



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


  const persistDataDictionaryEntry = async (newDictionaryEntry) => {
    // Get all columns and their classifications from preview rows
    const columnMappings = sourceData.ddResourcePreviewRows.reduce((acc, column) => {
      if (column.schemaClassification?.value) {
        // Multiple columns can have the same classification
        if (!acc[column.schemaClassification.value]) {
          acc[column.schemaClassification.value] = [];
        }
        acc[column.schemaClassification.value].push(column.name);
      }
      return acc;
    }, {});
  
    // Initialize all dictionary columns with empty strings
    const allDictionaryColumns = sourceData.ddResourcePreviewRows.map(column => column.name);
    const mappedEntry = allDictionaryColumns.reduce((acc, columnName) => {
      acc[columnName] = '';
      return acc;
    }, {});
  
    // Map values based on classifications
    Object.entries(columnMappings).forEach(([classification, columnNames]) => {
      // For each column with this classification, set the appropriate value
      columnNames.forEach(columnName => {
        let value = '';
        switch(classification) {
          case 'physical_table_name':
            value = newDictionaryEntry.tableName;
            break;
          case 'physical_column_name':
            value = newDictionaryEntry.columnName;
            break;
          case 'logical_table_name':
            value = newDictionaryEntry.logicalTableName;
            break;
          case 'logical_column_name':
            value = newDictionaryEntry.logicalColumnName;
            break;
          case 'data_type':
            value = newDictionaryEntry.dataType;
            break;
          case 'column_description':
            value = newDictionaryEntry.columnDescription;
            break;
          case 'primary_key':
            value = newDictionaryEntry.primaryKey ? 'YES' : 'NO';
            break;
          case 'foreign_key':
            value = newDictionaryEntry.foreignKey ? 'YES' : 'NO';
            break;
          case 'nullable':
            value = newDictionaryEntry.isNullable ? 'NULL' : 'NOT NULL';
            break;
        }
        mappedEntry[columnName] = value || '';
      });
    });
  
    const currentDictData = await getData('ddResourceFullData');
    await setData('ddResourceFullData', [...currentDictData, mappedEntry]);
    
    setSourceData(prev => ({
      ...prev,
      ddResourceFullData: [...prev.ddResourceFullData, mappedEntry]
    }));
  };
  
  

  const calculateTableStats = useCallback((tableName) => {
    if (!tableName || !sourceData.ddResourceFullData) return null;
  
    const tableNameColumns = getClassifiedColumns('physical_table_name') || [];
    const columnNameColumns = getClassifiedColumns('physical_column_name') || [];
    const tableNameField = tableNameColumns[0]?.name;
    const columnNameField = columnNameColumns[0]?.name;
  
    if (!tableNameField || !columnNameField) return null;

    const tableRows = sourceData.ddResourceFullData?.filter(row => 
      row[tableNameField] === tableName
    );

    if (!tableRows?.length) return null;

    const tableColumns = tableRows.map(row => row[columnNameField]);
    const sourceColumns = sourceData.resourcePreviewRows
      .filter(col => !col.isDisabled)
      .map(col => col.name);

    let matchCount = 0;
    let totalColumnScore = 0;
    let matchedColumnsScore = 0;
    let totalMappedScore = 0;
    let mappedCount = 0;
    const totalColumns = sourceColumns.length;

    
    matchResults.forEach(match => {
      // Only include columns that are mapped (not set to "No Map")
      if (match.matched_column_name !== 'No Map' && match.matched_column_name !== '') {
        totalMappedScore += match.column_similarity_score;
        mappedCount++;
      }
    });

    sourceColumns.forEach(sourceCol => {
      const scores = tableColumns.map(targetCol => 
        stringSimilarity.compareTwoStrings(sourceCol.toLowerCase(), targetCol.toLowerCase())
      );
      const bestScore = Math.max(...scores);
      
      if (bestScore > 0.6) {
        matchCount++;
        matchedColumnsScore += bestScore;
      }
      totalColumnScore += bestScore;
    });

    const tableNameSimilarity = stringSimilarity.compareTwoStrings(
      tableName.toLowerCase(),
      standardizedName.toLowerCase()
    );

    return {
      tableName,
      matchedColumns: matchCount,
      unmatchedColumns: sourceColumns.length - matchCount,
      averageColumnScore: totalColumnScore / sourceColumns.length,
      matchedColumnsConfidence: mappedCount > 0 ? (totalMappedScore / mappedCount) * 100 : 0,
      columnMatchConfidence: (mappedCount / totalColumns) * 100,
      tableNameSimilarity: tableNameSimilarity * 100,
      confidenceScore: (tableNameSimilarity * 0.4 + (matchCount / sourceColumns.length) * 0.6) * 100
    };
  }, [sourceData, getClassifiedColumns, standardizedName, matchResults]);

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
        // console.log('!!! -> sourceColumn', sourceColumn);
        return {
          id: index,
          source_column_name: sourceName,
          sourceDataType: sourceColumn.dataType || 'STRING',
          sourceColumnDescription: sourceColumn.columnDescription || '',
          sourcePrimaryKey: Boolean(sourceColumn.primaryKey || 'false'),
          sourceForeignKey:  Boolean(sourceColumn.foreignKey || 'false'),
          sourceIsNullable:  Boolean(sourceColumn.nullable || 'false'),
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
          primaryKey: Boolean(getColumnDataByClassification('primary_key', bestMatch?.ddRow)),
          foreignKey: Boolean(getColumnDataByClassification('foreign_key', bestMatch?.ddRow)),
          isNullable: Boolean(getColumnDataByClassification('nullable', bestMatch?.ddRow)),
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


  
  const handleOpenCandidateDialog = (row) => {
    console.log('Opening dialog with row:', row);
    const matchResult = matchResults.find(m => m.source_column_name === row.sourceColumn);
    
    const candidates = matchResult?.candidateMatches?.map(match => ({
      tableName: selectedDictionaryTable,
      columnName: match.columnName,
      score: match.score,
      logicalTableName: getColumnDataByClassification('logical_table_name', match.ddRow),
      logicalColumnName: getColumnDataByClassification('logical_column_name', match.ddRow),
      dataType: getColumnDataByClassification('data_type', match.ddRow),
      columnDescription: getColumnDataByClassification('column_description', match.ddRow)
    }));
  
    setSelectedRow({
      id: row.id,
      sourceColumn: row.sourceColumn,
      matchedColumn: matchResult,
      candidateMatches: candidates,
      resourceSchema: matchResult
    });
    console.log('Opening dialog with resourceSchema:', matchResult);
    setOpenCandidateDialog(true);
  };
  
  const handleMatchChange = useCallback((rowId, newValue, score) => {
    console.log('!!handleMatchChange -> called with rowId:', rowId, 'newValue:', newValue, 'score:', score);
    const columnNameColumns = getClassifiedColumns('physical_column_name') || [];
    const columnNameField = columnNameColumns[0]?.name;
    const tableNameColumns = getClassifiedColumns('physical_table_name') || [];
    const tableNameField = tableNameColumns[0]?.name;
  
    setMatchResults(prev => prev.map(row => {
      if (row.id === rowId) {
        // Calculate similarity score for new mapping
        console.log('!!!!handleMatchChange -> stringSimilarity -> row.source_column_name == newValue.columnName:', row.source_column_name,  newValue.columnName);
        const newScore = newValue.columnName === 'No Map' ? 0 : 
          stringSimilarity.compareTwoStrings(
            row.source_column_name.toLowerCase(),
            newValue.columnName.toLowerCase()
          );
  
        const matchedDDRow = sourceData.ddResourceFullData.find(
          ddRow => ddRow[columnNameField] === newValue.columnName && 
                ddRow[tableNameField] === standardizedTableName
        );
  
        return {
          ...row,
          matchedColumn: `${newValue.tableName}.${newValue.columnName}`,
          matched_column_name: newValue.columnName,
          matched_table_name: newValue.tableName,
          column_similarity_score: newScore,
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

  const handleCandidateSelect = useCallback(async (selectedMapping) => {
  console.log('!!!! -handleCandidateSelect -> called!');
  console.log('handleCandidateSelect -> Received selectedMapping mapping data:', selectedMapping);
  console.log('handleCandidateSelect -> Received selectedRow mapping data:', selectedRow);
  if (selectedRow) {
// 1. Update matchColumn with table.column format

  // 2. Apply the score
  const score = selectedMapping.score;

  const newMapping = {
    id: selectedMapping.id,
    tableName: selectedMapping.tableName,
    columnName: selectedMapping.columnName,
    logicalTableName: selectedMapping.logicalTableName,
    logicalColumnName: selectedMapping.logicalColumnName,
    dataType: selectedMapping.dataType,
    columnDescription: selectedMapping.columnDescription,
    primaryKey: selectedMapping.primaryKey,
    foreignKey: selectedMapping.foreignKey,
    isPHI: selectedMapping.isPHI,
    isPII: selectedMapping.isPII,
    isNullable: selectedMapping.isNullable,
    score: score
  };

  // 3. Add manual mapping to data dictionary if it's a manual mapping
  if (selectedMapping.id.toString().startsWith('manual-')) {
    const newDictionaryEntry = {
      tableName: selectedMapping.tableName,
      columnName: selectedMapping.columnName,
      logicalTableName: selectedMapping.logicalTableName,
      logicalColumnName: selectedMapping.logicalColumnName,
      dataType: selectedMapping.dataType,
      columnDescription: selectedMapping.columnDescription,
      primaryKey: selectedMapping.primaryKey,
      foreignKey: selectedMapping.foreignKey,
      isPHI: selectedMapping.isPHI,
      isPII: selectedMapping.isPII,
      isNullable: selectedMapping.isNullable
    };
    
      console.log('New dictionary entry:', newDictionaryEntry);
      // Add to dictionary data
      console.log('handleCandidateSelect -> Received selectedRow.id | formattedMatch data:', selectedRow.id, newMapping);
      // Add new entry and update storage
      await persistDataDictionaryEntry(newDictionaryEntry);
    }
    
    handleMatchChange(selectedRow.id, newMapping);
  }
}, [selectedRow, handleMatchChange])





  // Add these component definitions before the main ResourceMappingTagging component
  const TableStatsCard = ({ stats, onChangeTable }) => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2.5}>
            <Typography variant="subtitle2" color="textSecondary">Current Table</Typography>
            <Typography variant="h6" noWrap>{stats?.tableName}</Typography>
          </Grid>
          <Grid item xs={1.5}>
            <Typography variant="subtitle2" color="textSecondary">Overall</Typography>
            <Typography variant="h6" color={stats?.confidenceScore >= 60 ? 'success.main' : 'error.main'}>
              {stats?.confidenceScore?.toFixed(1)}%
            </Typography>
          </Grid>
          <Grid item xs={1.5}>
            <Typography variant="subtitle2" color="textSecondary">Table Match</Typography>
            <Typography variant="h6" color={stats?.tableNameSimilarity >= 60 ? 'success.main' : 'error.main'}>
              {stats?.tableNameSimilarity?.toFixed(1)}%
            </Typography>
          </Grid>
          <Grid item xs={1.5}>
            <Typography variant="subtitle2" color="textSecondary">Column Match</Typography>
            <Typography variant="h6" color={stats?.columnMatchConfidence >= 60 ? 'success.main' : 'error.main'}>
              {stats?.columnMatchConfidence?.toFixed(1)}%
            </Typography>
          </Grid>
          <Grid item xs={1.5}>
            <Typography variant="subtitle2" color="textSecondary">Match Quality</Typography>
            <Typography variant="h6" color={stats?.matchedColumnsConfidence >= 60 ? 'success.main' : 'error.main'}>
              {stats?.matchedColumnsConfidence?.toFixed(1)}%
            </Typography>
          </Grid>
          <Grid item xs={1.5}>
            <Typography variant="subtitle2" color="textSecondary">Columns</Typography>
            <Typography variant="h6">{stats?.matchedColumns}/{stats?.matchedColumns + stats?.unmatchedColumns}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button 
              variant="contained" 
              onClick={onChangeTable} 
              fullWidth
            >
              Change Table
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
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
          p: 0,
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
    // {
    //   field: 'primaryKey',
    //   headerName: 'Primary Key',
    //   width: 100,
    //   type: 'boolean',
    //   editable: true
    // },
    // {
    //   field: 'foreignKey',
    //   headerName: 'Foreign Key',
    //   width: 100,
    //   type: 'boolean',
    //   editable: true
    // },
    // {
    //   field: 'nullable',
    //   headerName: 'Nullable',
    //   width: 100,
    //   type: 'boolean',
    //   editable: true
    // }
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
        const availableTables = getAllTableStats();
        setAvailableTables(availableTables.filter(t => t?.confidenceScore >= 60));
        setOpenTableSelection(true);
      }}
    />
    <ResourceDataDictionaryTableSelectionDialog
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
        <ResourceDataDictionaryColumnMappingCandidateDialog
          open={openCandidateDialog}
          onClose={() => setOpenCandidateDialog(false)}
          sourceColumn={selectedRow?.sourceColumn}
          candidates={selectedRow?.candidateMatches || []}
          currentMapping={selectedRow?.matchedColumn}
          resourceSchema={selectedRow?.resourceSchema}
          onSelect={handleCandidateSelect}
        />



        </Box>
      </Box>
    );
  };

  
export default ResourceMappingTagging;


