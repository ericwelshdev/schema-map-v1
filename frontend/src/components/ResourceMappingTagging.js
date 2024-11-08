import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, TextField, Autocomplete, Chip, Tooltip , IconButton} from '@mui/material';
import { Card,   CardContent,   Grid,   Button } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import stringSimilarity from 'string-similarity';
import {getData, setData } from '../utils/storageUtils';
import PIIIcon from '@mui/icons-material/Security';
import PHIIcon from '@mui/icons-material/HealthAndSafety';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ResourceDataDictionaryColumnMappingCandidateDialog  from './ResourceDataDictionaryColumnMappingCandidateDialog';
import ResourceDataDictionaryTableMappingCandidateDialog from './ResourceDataDictionaryTableMappingCandidateDialog';



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




const ResourceMappingTagging = ({ savedState, onDataChange }) => {
  console.log("savedState:", savedState);
  const standardizedName = String(savedState?.resourceSetup?.standardizedSourceName || '');
  const [selectedDictionaryTable, setSelectedDictionaryTable] = useState(standardizedName);
  const [tableStats, setTableStats] = useState(null);
  const [matchResults, setMatchResults] = useState([]);
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [openTableSelection, setOpenTableSelection] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);

  const [openCandidateDialog, setOpenCandidateDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

const [isEditing, setIsEditing] = useState(false);
const [unsavedChanges, setUnsavedChanges] = useState(false);


  const [sourceData, setSourceData] = useState({
    ddResourceFullData: null,
    ddResourcePreviewRows: null,
    ddResourceSampleData: null,
    resourcePreviewRows: null,
    resourceSampleData: null,
    resourceSetup: null,
    ddResourceMapping: null
  });
  
  useEffect(() => {
    if (matchResults.length > 0) {
      setData('ddResourceMappingRows', matchResults);
    }
  }, [matchResults]);
  



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


  const persistDataDictionaryEntry = useCallback(async (newDictionaryEntry) => {
    try {
      const columnMappings = sourceData.ddResourcePreviewRows.reduce((acc, column) => {
        const classification = column.schemaClassification?.value;
        if (classification) {
          acc[classification] = acc[classification] || [];
          acc[classification].push(column.name);
        }
        return acc;
      }, {});
  
      // Create base entry with operational columns
      const mappedEntry = {
        mapping_state: newDictionaryEntry.sourceType === 'manual' ? 'manual' : newDictionaryEntry.mappingState || 'unaltered',
        source_type: newDictionaryEntry.sourceType || 'source'
      };
  
      // Add dictionary columns
      const allDictionaryColumns = sourceData.ddResourcePreviewRows.map(column => column.name);
      allDictionaryColumns.forEach(columnName => {
        mappedEntry[columnName] = '';
      });
  
      // Map values based on classifications
      Object.entries(columnMappings).forEach(([classification, columnNames]) => {
        columnNames.forEach(columnName => {
          console.log('classification:', classification, 'columnNames:', columnNames);
          let value = '';
          switch(classification) {
            case 'stdiz_abrvd_attr_grp_nm':
              value = newDictionaryEntry.tableName;
              break;
            case 'stdiz_abrvd_attr_nm':
              value = newDictionaryEntry.columnName;
              break;
            case 'dsstrc_attr_grp_nm':
              value = newDictionaryEntry.logicalTableName;
             break;              
            case 'dsstrc_attr_nm':
              value = newDictionaryEntry.logicalColumnName;
              break;
            case 'dsstrc_attr_grp_desc':
              value = newDictionaryEntry.tableDescription;
              break;
            case 'physcl_data_typ_nm':
              value = newDictionaryEntry.dataType;
              break;
            case 'dsstrc_attr_desc':
              value = newDictionaryEntry.columnDescription;
              break;
            case 'len_nbr':
              value = newDictionaryEntry.columnLength;
                break;
            case 'scale_nbr':
              value = newDictionaryEntry.columnScale;
                break;
            case 'mand_ind':
              value = newDictionaryEntry.isNullable ? 'YES' : 'NO';
                break;                      
            case 'pk_ind':
              value = newDictionaryEntry.isPrimaryKey ? 'YES' : 'NO';
              break;
            case 'fk_ind':
              value = newDictionaryEntry.isForeignKey ? 'YES' : 'NO';
              break;
            case 'phi_ind':
              value = newDictionaryEntry.isPHI ? 'YES' : 'NO';
                break;
            case 'pii_ind':
              value = newDictionaryEntry.isPII ? 'YES' : 'NO';
                break;              
            case 'encrypt_ind':
              value = newDictionaryEntry.isEncryptioned ? 'YES' : 'NO';
              break;
            case 'stdiz_abrvd_alt_attr_nm':
              value = newDictionaryEntry.alternativeName;
              break;
            case 'stdiz_abrvd_alt_attr_grp_nm':
              value = newDictionaryEntry.comment;
              break;            
            default:
              value = '';
          }
          mappedEntry[columnName] = value || '';
        });
      });
  
      const currentDictData = await getData('ddResourceFullData') || [];
      const updatedData = [...currentDictData, mappedEntry];
      
      await setData('ddResourceFullData', updatedData);
      
      setSourceData(prev => ({
        ...prev,
        ddResourceFullData: updatedData
      }));
  
      return mappedEntry;
    } catch (error) {
      console.error('Error persisting dictionary entry:', error);
      throw error;
    }
  }, [sourceData, setSourceData]);
  
  
  const calculateTableStats = useCallback((tableName) => {

  // Stats being calculated:
  // 1. matchedColumns: Count of columns with similarity score > 0.6
  // 2. unmatchedColumns: Total source columns minus matched columns
  // 3. averageColumnScore: Total column similarity scores divided by number of columns
  // 4. matchedColumnsConfidence: Average score of mapped columns (excluding "No Map")
  // 5. columnMatchConfidence: Percentage of total columns that are mapped
  // 6. tableNameSimilarity: String similarity between table names
  // 7. confidenceScore: Weighted average (40% table name + 60% column matches)

    if (!tableName || !sourceData.ddResourceFullData) return null;
  
    const tableNameColumns = getClassifiedColumns('stdiz_abrvd_attr_grp_nm') || [];
    const columnNameColumns = getClassifiedColumns('stdiz_abrvd_attr_nm') || [];
    const tableNameField = tableNameColumns[0]?.name;
    const columnNameField = columnNameColumns[0]?.name;

 
  
  // Get all rows for this table
    const tableRows = sourceData.ddResourceFullData?.filter(row => 
    row[tableNameField] === tableName
  );
  
  
  // Count primary and foreign keys
  const pkCount = tableRows.filter(row => 
    getColumnDataByClassification('pk_ind', row) === 'YES'
  ).length;

  const fkCount = tableRows.filter(row => 
    getColumnDataByClassification('fk_id', row) === 'YES'
  ).length;

  const nullableCount = tableRows.filter(row => 
    getColumnDataByClassification('mand_ind', row) === 'NULL'
  ).length;

    const tableColumns = tableRows.map(row => row[columnNameField]);
    console.log('!!sourceData.tableColumns:', tableColumns);
    
    const sourceColumns = sourceData.resourcePreviewRows.filter(col => !col.isDisabled);
    const disabledColumns = sourceData.resourcePreviewRows.filter(col => col.isDisabled);
    const totalActiveColumns = sourceColumns.length;
    const totalDisabledColumns = disabledColumns.length;
  
    let matchCount = 0;
    let totalColumnScore = 0;
    let matchedColumnsScore = 0;
    let totalMappedScore = 0;
    let mappedCount = 0;
    let highQualityMatches = 0;

    // console.log('->>>> tableColumns', tableColumns)
  
    // Calculate match quality
    sourceColumns.forEach(sourceCol => {
    //  console.log('->>>> sourceCol', sourceCol)

      const scores = tableColumns.map(targetCol =>         
        stringSimilarity.compareTwoStrings(sourceCol.name.toLowerCase(), targetCol.toLowerCase())
      );
      const bestScore = Math.max(...scores);
      
      if (bestScore > 0.3) {
        matchCount++;
        if (bestScore > 0.6) {
          highQualityMatches++;
        }
        matchedColumnsScore += bestScore;
      }
      totalColumnScore += bestScore;
    });
  
    // Calculate column match percentage
    const columnMatchConfidence = (matchCount / totalActiveColumns) * 100;
  
    // Calculate match quality (average score of matched columns)
    const matchQuality = matchCount > 0 ? (matchedColumnsScore / matchCount) * 100 : 0;
  
    const tableNameSimilarity = stringSimilarity.compareTwoStrings(
      tableName.toLowerCase(),
      standardizedName.toLowerCase()
    );
  
    // Overall confidence combines table name similarity and column matches
    const confidenceScore = (
      tableNameSimilarity * 0.3 + 
      (columnMatchConfidence / 100) * 0.4 + 
      (matchQuality / 100) * 0.3
    ) * 100;
  
    return {
      tableName,
      matchedColumns: matchCount,
      unmatchedColumns: totalActiveColumns - matchCount,
      disabledColumns: totalDisabledColumns,
      totalColumns: totalActiveColumns + totalDisabledColumns,
      highQualityMatches,
      columnMatchConfidence,
      matchQuality,
      tableNameSimilarity: tableNameSimilarity * 100,
      confidenceScore
    };
  }, [sourceData, getClassifiedColumns, standardizedName]);
  
  

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
    const tableNameColumns = getClassifiedColumns('stdiz_abrvd_attr_grp_nm') || [];
    const columnNameColumns = getClassifiedColumns('stdiz_abrvd_attr_nm') || [];
    
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
        logicalName: getColumnDataByClassification('dsstrc_attr_nm', entry),
        // dataType: getColumnDataByClassification('physcl_data_typ_nm', entry),
        description: getColumnDataByClassification('dsstrc_attr_desc', entry),
        ddRow: entry
      }))
      .filter(col => col.columnName);
  }, [sourceData, getClassifiedColumns, selectedDictionaryTable, getColumnDataByClassification]);

  // Compute matches between source columns and dictionary
  const computeMatches = useCallback(() => {
    if (!sourceData?.resourcePreviewRows?.length || !sourceData?.ddResourceFullData?.length) {
      setMatchResults([]);
      return;
    }
  
    console.log('Computing matches with:', {
      sourceColumns: sourceData.resourcePreviewRows,
      dictionaryData: sourceData.ddResourceFullData,
      selectedTable: selectedDictionaryTable
    });
  
    const tableNameColumns = getClassifiedColumns('stdiz_abrvd_attr_grp_nm') || [];
    const columnNameColumns = getClassifiedColumns('stdiz_abrvd_attr_nm') || [];
    const tableNameField = tableNameColumns[0]?.name;
    const columnNameField = columnNameColumns[0]?.name;
  
    // Get valid columns from selected table
    const validColumnNames = sourceData.ddResourceFullData
      .filter(row => row[tableNameField] === selectedDictionaryTable)
      .map(row => ({
        columnName: String(row[columnNameField] || ''),
        ddRow: row
      }))
      .filter(item => item.columnName);
  
    console.log('Valid columns for matching:', validColumnNames);
  
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
  
        // console.log(`Matches for ${sourceName}:`, allMatches);
        const standardizedTableName = String(savedState?.resourceSetup?.standardizedSourceName || '');        
  
        const bestMatch = allMatches[0];
        return {
          id: index,
          source_table_name: standardizedTableName,
          source_column_name: sourceName,
          sourceDataType: sourceColumn.dataType || 'STRING',
          sourceColumnDescription: sourceColumn.columnDescription || '',
          sourcePrimaryKey: Boolean(sourceColumn.primaryKey || 'false'),
          sourceForeignKey:  Boolean(sourceColumn.foreignKey || 'false'),
          sourceIsNullable:  Boolean(sourceColumn.nullable || 'false'),
          sourceAlternativeColumnName: sourceColumn.alternativeName || '',
          matched_table_name: selectedDictionaryTable,
          matched_column_name: bestMatch?.columnName || '',
          column_similarity_score: bestMatch?.score || 0,
          mappingStatus: bestMatch?.score > 0.3 ? 'mapped' : 'unmapped',
          hasMultipleCandidates: allMatches.length > 1,
          candidateMatches: allMatches,
          logicalTableName: getColumnDataByClassification('dsstrc_attr_grp_nm', bestMatch?.ddRow),
          logicalColumnName: getColumnDataByClassification('dsstrc_attr_nm', bestMatch?.ddRow),
          columnDescription: getColumnDataByClassification('dsstrc_attr_desc', bestMatch?.ddRow),
          columnAlternativeName: getColumnDataByClassification('stdiz_abrvd_alt_attr_nm', bestMatch?.ddRow) || '',
          dataType: getColumnDataByClassification('physcl_data_typ_nm', bestMatch?.ddRow),
          columnLength: getColumnDataByClassification('len_nbr'),
          columnPrecision: getColumnDataByClassification('prec_nbr'),
          columnScale: getColumnDataByClassification('scale_nbr'),
          isNullable: Boolean(getColumnDataByClassification('mand_ind', bestMatch?.ddRow)),
          primaryKey: Boolean(getColumnDataByClassification('pk_ind', bestMatch?.ddRow)),
          foreignKey: Boolean(getColumnDataByClassification('fk_ind', bestMatch?.ddRow)),
          isPII: Boolean(getColumnDataByClassification('pii_ind', bestMatch?.ddRow)),
          isPHI: Boolean(getColumnDataByClassification('phi_ind', bestMatch?.ddRow)),
          isEncrypted: Boolean(getColumnDataByClassification('encrypt_ind', bestMatch?.ddRow)),
          isDisabled: Boolean(sourceColumn.isDisabled),
          
          tags: Array.isArray(sourceColumn.tags) ? sourceColumn.tags : [],
          mappingState: 'unaltered', // Initial state
          sourceType: 'source'  // Default source type
        };
      });
  
    console.log('Final match results:', results);
    setMatchResults(results);
  }, [sourceData, getClassifiedColumns, selectedDictionaryTable, getColumnDataByClassification]);
  
 const standardizedTableName = String(savedState?.resourceSetup?.standardizedSourceName || '');


    useEffect(() => {
      const loadData = async () => {
        const data = {
        ddResourceFullData: await getData('ddResourceFullData'),
        ddResourcePreviewRows: await getData('ddResourcePreviewRows'),
        resourcePreviewRows: await getData('resourcePreviewRows'),
        resourceSampleData: await getData('resourceSampleData'),
        ddResourceMapping: await getData('ddResourceMapping'),
      };
      console.log('Loaded source data:', data);
      setSourceData(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    computeMatches();
  }, [computeMatches]);


// Add persistRows function
const persistRows = useCallback(async (updatedRows) => {
  setMatchResults(updatedRows);
  await setData('ddResourceMappingRows', updatedRows);
  onDataChange?.({
    processedMapping: updatedRows
  });
}, [onDataChange]);


    // Add this new function with the existing ones
    const getAllTableStats = useCallback(() => {
      const tableNameColumns = getClassifiedColumns('stdiz_abrvd_attr_grp_nm') || [];
      const columnNameField = tableNameColumns[0]?.name;
      
      if (!columnNameField || !sourceData.ddResourceFullData) {
        return [];
      }
    
      // Get unique table names from data dictionary
      const uniqueTables = [...new Set(
        sourceData.ddResourceFullData.map(row => row[columnNameField])
      )].filter(Boolean);
    
      console.log('Found unique tables:', uniqueTables);
    
      // Calculate stats for each table
      const tableStats = uniqueTables.map(tableName => {
        const stats = calculateTableStats(tableName);
        // console.log(`Stats for table ${tableName}:`, stats);
        return stats;
      }).filter(stats => stats !== null);
    
      // console.log('Final table stats:', tableStats);
      return tableStats;
    }, [sourceData.ddResourceFullData, getClassifiedColumns, calculateTableStats]);
    
    


  
  const handleOpenCandidateDialog = (row) => {
    console.log('Opening dialog with row:', row);
    const matchResult = matchResults.find(m => m.source_column_name === row.sourceColumn);
    
    const candidates = matchResult?.candidateMatches?.map(match => ({
      tableName: selectedDictionaryTable,
      columnName: match.columnName,
      score: match.score,
      logicalTableName: getColumnDataByClassification('dsstrc_attr_grp_nm', match.ddRow),
      logicalColumnName: getColumnDataByClassification('dsstrc_attr_nm', match.ddRow),
      dataType: getColumnDataByClassification('physcl_data_typ_nm', match.ddRow),
      columnDescription: getColumnDataByClassification('dsstrc_attr_desc', match.ddRow)
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
    const columnNameColumns = getClassifiedColumns('stdiz_abrvd_attr_nm') || [];
    const columnNameField = columnNameColumns[0]?.name;
    const tableNameColumns = getClassifiedColumns('stdiz_abrvd_attr_nm') || [];
    const tableNameField = tableNameColumns[0]?.name;
  
    const updatedRows = matchResults.map(row => {
      if (row.id === rowId) {
        console.log('!!!!handleMatchChange -> stringSimilarity -> row.source_column_name == newValue.columnName:', row.source_column_name, newValue.columnName);
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
          logicalTableName: getColumnDataByClassification('dsstrc_attr_grp_nm', matchedDDRow),
          logicalColumnName: getColumnDataByClassification('dsstrc_attr_nm', matchedDDRow),
          columnDescription: getColumnDataByClassification('dsstrc_attr_desc', matchedDDRow),
          dataType: getColumnDataByClassification('physcl_data_typ_nm', matchedDDRow),
          primaryKey: getColumnDataByClassification('pk_ind', matchedDDRow),
          foreignKey: getColumnDataByClassification('fk_ind', matchedDDRow),
          nullable: getColumnDataByClassification('mand_ind', matchedDDRow),
          isEditing: true,
          isUnsaved: true,
          isChanged: true,
          originalState: row.originalState || { ...row }
        };
      }
      return row;
    });
  
    persistRows(updatedRows);
  }, [getClassifiedColumns, sourceData.ddResourceFullData, getColumnDataByClassification, standardizedTableName, matchResults, persistRows]);
  

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
      isNullable: selectedMapping.isNullable,
      mappingState: 'manual',
      sourceType: 'manual',
      score: 1.0
    };
    
      console.log('New dictionary entry:', newDictionaryEntry);
      // Add to dictionary data
      console.log('handleCandidateSelect -> Received selectedRow.id | formattedMatch data:', selectedRow.id, newMapping);
      // Add new entry and update storage
      await persistDataDictionaryEntry(newDictionaryEntry);
    }
    
    handleMatchChange(selectedRow.id, newMapping);
  }
}, [selectedRow, handleMatchChange, persistDataDictionaryEntry])







// Add these handler functions
const handleSaveAll = () => {
  setMatchResults(prev => prev.map(row => ({ 
    ...row, 
    isUnsaved: false, 
    isEditing: false 
  })));
  setUnsavedChanges(false);
};

const handleCancelAll = () => {
  setMatchResults(prev => prev.map(row => ({ 
    ...row, 
    isChanged: false, 
    isUnsaved: false, 
    isEditing: false 
  })));
  setUnsavedChanges(false);
};

const handleCellChange = (params) => {
  setMatchResults(prev => prev.map(row => {
    if (row.id === params.id) {
      const newValue = params.value !== undefined ? params.value : row[params.field];
      return {
        ...row,
        [params.field]: newValue,
        isEditing: true,
        isUnsaved: true,
        isChanged: true
      };
    }
    return row;
  }));
  setUnsavedChanges(true);
};


// Add these handler functions
const handleSaveClick = (id) => {
  setMatchResults(prev => prev.map(row => {
    if (row.id === id) {
      const currentState = {
        ...row,
        isEditing: false,
        isUnsaved: false
      };
      return {
        ...currentState,
        isChanged: true,
        originalState: { ...currentState }
      };
    }
    return row;
  }));
};

const handleCancelClick = (id) => {
  setMatchResults(prev => prev.map(row => {
    if (row.id === id) {
      return { ...row.originalState, id: row.id, isEditing: false, isChanged: false, isUnsaved: false };
    }
    return row;
  }));
};

const handleDisableClick = (id) => {
  setMatchResults(prev => prev.map(row => {
    if (row.id === id) {
      const newDisabledState = !row.isDisabled;
      const isChanged = newDisabledState !== row.originalState?.isDisabled;
      return { ...row, isDisabled: newDisabledState, isChanged, isUnsaved: true, isEditing: true };
    }
    return row;
  }));
};

const handleUndoClick = (id) => {
  setMatchResults(prev => prev.map(row => {
    if (row.id === id) {
      return {
        ...row.originalState,
        id: row.id,
        isEditing: false,
        isChanged: false,
        isUnsaved: false
      };
    }
    return row;
  }));
};

const handleTagChange = useCallback((rowId, newTags) => {
  const updatedRows = matchResults.map(row => {
    if (row.id === rowId) {
      return {
        ...row,
        tags: newTags,
        isEditing: true,
        isUnsaved: true,
        isChanged: true
      };
    }
    return row;
  });
  persistRows(updatedRows);
}, [matchResults, persistRows]);


useEffect(() => {
  const loadSavedData = async () => {
    try {
      const savedRows = await getData('ddResourceMappingRows');
      if (savedRows) {
        setMatchResults(savedRows);
      }
    } catch (error) {
      console.error('Database operation failed:', error);
    }
  };
  loadSavedData();
}, []);


// useEffect(() => {
//   if (selectedDictionaryTable) {
//     const stats = calculateTableStats(selectedDictionaryTable);
//     setTableStats(stats);
//   }
// }, [selectedDictionaryTable, calculateTableStats, matchResults]);





  // Add these component definitions before the main ResourceMappingTagging component
  const TableStatsCard = ({ stats, onChangeTable }) => (
    <Card sx={{ mb: 1 }}>
      <CardContent sx={{pb:2}} >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2.5}>
            <Typography variant="subtitle2" color="textSecondary">Current Table</Typography>
            <Typography variant="h6" noWrap>{stats?.tableName}</Typography>
          </Grid>
          <Grid item xs={1.5}>
            <Typography variant="subtitle2" color="textSecondary">Match Overall</Typography>
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
            <Typography variant="subtitle2" color="textSecondary">Columns Match</Typography>
            <Typography variant="h6" color={stats?.columnMatchConfidence >= 60 ? 'success.main' : 'error.main'}>
              {stats?.columnMatchConfidence?.toFixed(1)}%
            </Typography>
          </Grid>
          <Grid item xs={1.5}>
            <Typography variant="subtitle2" color="textSecondary">Match Quality</Typography>
            <Typography variant="h6" color={stats?.matchQuality >= 60 ? 'success.main' : 'error.main'}>
              {stats?.matchQuality?.toFixed(1)}%
            </Typography>
          </Grid>
          <Grid item xs={1.5}>
            <Typography variant="subtitle2" color="textSecondary">Columns Mapped</Typography>
            <Typography variant="h6">
              {stats?.matchedColumns}/{stats?.totalColumns - stats?.disabledColumns}
              {stats?.disabledColumns > 0 && (
                <Typography component="span" variant="caption" color="text.secondary">
                  {` (${stats?.disabledColumns} disabled)`}
                </Typography>
              )}
            </Typography>
          </Grid>
          <Grid item xs={2}>
          <Button 
          variant="contained" 
          onClick={() => {
            const tables = getAllTableStats();
            setAvailableTables(tables);
            setOpenTableDialog(true);
          }}
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
        field: 'status',
        headerName: '',
        width: 50,
        renderCell: (params) => (
          params.row.isChanged ?
            (params.row.isUnsaved ? <WarningIcon color="warning" /> : <CheckCircleOutlineIcon color="primary" />)
            : null
        ),
      },
    {
      field: 'sourceColumn',
      headerName: 'Source Column',
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2">{params.value}</Typography>
          <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
            {params.row.isPII && <PIIIcon sx={{ fontSize: 16 }} color="primary" />}
            {params.row.isPHI && <PHIIcon sx={{ fontSize: 16 }} color="primary" />}
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
              <TextField 
                {...params} 
                variant="outlined" 
                size="small"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    height: 28,
                    minHeight: 'unset',
                    fontSize: '0.8rem',
                    padding: '0px',
                    '& .MuiAutocomplete-input': {
                      padding: '4px 6px'
                    }
                  }
                }}
              />
            )}
          />
          <IconButton
            size="small"
            onClick={() => handleOpenCandidateDialog(params.row)}
            sx={{ ml: -1, p: 0.5 }}
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
          height: 24,  // Set a smaller height to reduce vertical space
          bgcolor: params.value > 0.7 ? 'success.light' : params.value > 0.4 ? 'warning.light' : 'error.light',
          p: '2px 4px', // Compact padding for a tighter fit
          borderRadius: 1,
          fontSize: '0.75rem',  // Smaller font for a compact look
          textAlign: 'center',
          lineHeight: 1.2, // Adjust line-height for vertical centering within the height
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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
                  height: 15,
                  fontSize: '0.6.5rem',
                  px: 1,
                  '& .MuiChip-label': { px: 0.75 }
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField 
              {...params} 
              variant="outlined" 
              size="small" 
              placeholder="Add tags"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  height: 28,
                  minHeight: 'unset',
                  fontSize: '0.8rem',
                  padding: '0px',
                  '& .MuiAutocomplete-input': {
                    padding: '4px 6px'
                  }
                }
              }}
            />
          )}
        />
      )
    },
    {
      field: 'logicalTableName',
      headerName: 'Logical Table Name',
      flex: 1,
      editable: false,
    },
    {
      field: 'logicalColumnName',
      headerName: 'Logical Column Name',
      flex: 1,
      editable: false,
    },
    {
      field: 'columnDescription',
      headerName: 'Column Description',
      flex: 1.5,
      editable: false,

    },
    {
      field: 'dataType',
      headerName: 'Data Type',
      width: 100,
      // flex: 1,
      editable: false
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: ({ id }) => {
        const row = rows.find(r => r.id === id);
        if (!row) return [];
        
        const isEditing = row.isEditing;
  
        if (isEditing) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={() => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={() => handleCancelClick(id)}
            />
          ];
        }
  
        return [
          <GridActionsCellItem
            icon={<BlockIcon color={row.isDisabled ? "primary" : "disabled"} />}
            label="Disable"
            onClick={() => handleDisableClick(id)}
          />,
          <GridActionsCellItem
            icon={<UndoIcon />}
            label="Undo"
            onClick={() => handleUndoClick(id)}
            disabled={!row.isChanged}
          />
        ];
      }
    }
  ];
  

  const rows = useMemo(() => 
    matchResults.map((match, index) => ({
      id: index,
      sourceColumn: match.source_column_name,
      mappingState: match.mappingState || 'unaltered',
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
      sx={{'& .MuiCard-root': { mb: 0 }}}
      gutterBottom={false}
      stats={tableStats}
      onChangeTable={() => setOpenTableDialog(true)}
    />
    <ResourceDataDictionaryTableMappingCandidateDialog
      open={openTableDialog}  // Verify this state is changing
      onClose={() => {
        console.log('Dialog closing');
        setOpenTableDialog(false);
      }}
      tables={availableTables}
      currentTable={selectedDictionaryTable}
      onSelect={(tableName) => {
        console.log('Selected table:', tableName);
        setSelectedDictionaryTable(tableName);
        setOpenTableDialog(false);
        computeMatches();
      }}
    />

<Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <Box sx={{ mt:-1, mb: -1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          startIcon={<SaveIcon/>} 
          onClick={handleSaveAll} 
          disabled={!unsavedChanges}
        >
          Save All
        </Button>
        <Button 
          startIcon={<CancelIcon />} 
          onClick={handleCancelAll} 
          disabled={!unsavedChanges}
        >
          Cancel All
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%', overflow: 'auto' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={15}
          rowHeight={45}
          rowsPerPageOptions={[15, 30, 50]}
          disableSelectionOnClick
          density="compact"
          editMode="cell"
          getRowHeight={() => 35}
          processRowUpdate={(newRow, oldRow) => {
          handleCellChange({
              id: newRow.id,
              field: Object.keys(newRow).find(key => newRow[key] !== oldRow[key]),
              value: newRow[Object.keys(newRow).find(key => newRow[key] !== oldRow[key])]
            });
            return newRow;
          }}
          isCellEditable={(params) => !params.row.isDisabled}
          components={{
            ColumnUnsortedIcon: CheckCircleOutlineIcon,
          }}
          componentsProps={{
            row: {
              style: (params) => ({
                backgroundColor: params.row.isDisabled ? '#f5f5f5' : 'inherit',
                opacity: params.row.isDisabled ? 0.7 : 1,
              }),
            },
          }}          
          sx={{
            '& .MuiDataGrid-cell': { 
              py: 0.25,
              fontSize: '0.8rem'              
            },
            '& .MuiDataGrid-columnHeader': {
              fontSize: '0.875rem'
            },
            '& .disabled-cell': {
              backgroundColor: '#f5f5f5',
              cursor: 'not-allowed',
            },
            '& .MuiDataGrid-row': {
              minHeight: '30px', // Set row minimum height
              maxHeight: '30px' // Ensure consistent height
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
  </Box>
    );
  };

  
export default ResourceMappingTagging;