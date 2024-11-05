import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button, Autocomplete, Chip } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import UndoIcon from '@mui/icons-material/Undo';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import KeyIcon from '@mui/icons-material/Key';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import { styled, lighten, darken, maxWidth } from '@mui/system';
import { SquareChartGanttIcon, TablePropertiesIcon, Grid3X3Icon, LetterTextIcon } from "lucide-react";
import { debounce } from 'lodash';
import { initDB,  getData, setData } from '../utils/storageUtils';

const ResourceDataDictionaryDataPreview = ({ schema, resourceData, resourceInfo, sampleData, rawData, onDataChange }) => {
  const [tabValue, setTabValue] = useState(() => {
    const savedTab = localStorage.getItem('previewTabValue');
    return savedTab ? parseInt(savedTab) : 1;
  });
        const [rows, setRows] = useState([]);

        useEffect(() => {
          const loadSavedData = async () => {
            try {
              await initDB();
              const savedRows = await getData('ddResourcePreviewRows');
              console.log('Collected Saved rows:', savedRows);
              if (savedRows) {
                setRows(savedRows);
              } else if (schema) {
                const initialRows = schema.map((col, index) => ({
                  id: index,
                  ...col,
                  order: index + 1,
                  alternativeName: '',
                  comment: '',
                  isPII: false,
                  isPHI: false,
                  isEditing: false,
                  isChanged: false,
                  isDisabled: false,
                  isUnsaved: false,
                  originalState: { id: index, ...col }
                }));
                setRows(initialRows);
          await setData('ddResourcePreviewRows', initialRows);
          console.log('Saved rows:', initialRows);
              }
            } catch (error) {
              console.error('Database operation failed:', error);
            }
          };
    
          loadSavedData();
        }, [schema]);
      // Only update rows from schema if no saved state exists
    // useEffect(() => {
    //   if (schema) {
    //     const initialRows = schema.map((col, index) => ({
    //       id: index,
    //       ...col,
    //       order: index + 1,
    //       alternativeName: '',
    //       comment: '',
    //       schemaClassification: null,
    //       isEditing: false,
    //       isChanged: false,
    //       isDisabled: false,
    //       isUnsaved: false,
    //       originalState: { id: index, ...col }
    //     }));
    //     setRows(initialRows);
    //     // localStorage.setItem('ddResourcePreviewRows', JSON.stringify(initialRows));
    //     setData('ddResourcePreviewRows', initialRows);
    //   }
    // }, [schema]);

      const debouncedDataChange = debounce((data, callback) => {
        callback?.(data);
      }, 500);

    useEffect(() => {
      debouncedDataChange({
        processedSchema: rows,
        sampleData,
        resourceInfo
      }, onDataChange);
    }, [rows, sampleData, resourceInfo, debouncedDataChange, onDataChange]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
      localStorage.setItem('previewTabValue', newValue);
  };

  const persistRows = async (updatedRows) => {
    setRows(updatedRows);
    console.log('persistRows: setData ->ddResourcePreviewRows', updatedRows);

    await setData('ddResourcePreviewRows', updatedRows);
    
    onDataChange?.({
      processedSchema: updatedRows,
      sampleData,
      resourceInfo
    });
    console.log('Saved Updated rows:', updatedRows);
  };

  const handleEditClick = (id) => {
    persistRows(rows.map(row => row.id === id ? { ...row, isEditing: true, isUnsaved: true } : row));
  };

  const handleSaveClick = (id) => {
    // console.log('Saving row with id:', id);
    persistRows(rows.map(row => {
      // console.log('Row id:', row.id,  'Original state:', row.originalState, "Current state:", row);
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
    persistRows(rows.map(row => {
      if (row.id === id) {
        return { ...row.originalState, id: row.id, isEditing: false, isChanged: false, isUnsaved: false };
      }
      return row;
    }));
  };

  const handleDisableClick = (id) => {
    persistRows(rows.map(row => {
      if (row.id === id) {
        const newDisabledState = !row.isDisabled;
        const isChanged = newDisabledState !== row.originalState.isDisabled;
        return { ...row, isDisabled: newDisabledState, isChanged, isUnsaved: true, isEditing: true };
      }
      return row;
    }));
  };

  const handleUndoClick = (id) => {
    persistRows(rows.map(row => {
      if (row.id === id) {
        // Restore from originalState while maintaining row structure
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

  const handleCellChange = (params) => {
    // console.log('Cell change:', params.field, params.value); // Keep this for debugging
    
    persistRows(rows.map(row => {
      if (row.id === params.id) {
        // Ensure we capture the actual value from the cell edit
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
  };
  

  const handleSaveAll = () => {
    persistRows(rows.map(row => ({ ...row, isUnsaved: false, isEditing: false })));
  };

  const handleCancelAll = () => {
    persistRows(rows.map(row => ({ ...row.originalState, id: row.id, isChanged: false, isUnsaved: false, isEditing: false })));
  };


  const renderGeneralInfo = () => (
    <Box sx={{ mt:4, height: 350, width: '100%', overflow: 'auto' }}>
      <Typography variant="h6">File Information</Typography>
      {resourceInfo && (
        <>
          <Typography variant="body2">Name: {resourceInfo.name}</Typography>
          <Typography variant="body2">Type: {resourceInfo.type}</Typography>
          <Typography variant="body2">Size: {resourceInfo.size} bytes</Typography>
          <Typography variant="body2">Last Modified: {resourceInfo.lastModified}</Typography>
        </>
      )}
    </Box>
  );



  const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    fontSize: 12,
    padding: '1px 4px',
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85)
  }));
  
  const GroupItems = styled('ul')({
    padding: 0,
    fontSize: 12    
  });
  
  const schemaClassificationOptions = [
    { 
      group: 'Mandatory',
      options: [
        { value: 'physical_table_name', label: 'Physical Table Name' },
        { value: 'physical_column_name', label: 'Physical Column Name' }
      ]
    },
    {
      group: 'Optional',
      options: [
        { value: 'logical_table_name', label: 'Logical Table Name' },
        { value: 'logical_column_name', label: 'Logical Column Name' },
        { value: 'column_description', label: 'Column Description' },
        { value: 'data_type', label: 'Data Type' },
        { value: 'primary_key', label: 'Primary Key' },
        { value: 'foreign_key', label: 'Foreign Key' },
        { value: 'nullable', label: 'Nullable' }
      ]
    }
  ];

  const schemaColumns = [
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
    { field: 'order', headerName: 'ID',  width:50},
    { 
      field: 'name', 
      headerName: 'Column Name', 
      flex: 1, 
      editable: true,
      cellClassName: (params) => params.row.isDisabled ? 'disabled-cell' : '',
    },
    { 
      field: 'alternativeName', 
      headerName: 'Alternative Name', 
      flex: 1, 
      editable: true,
      cellClassName: (params) => params.row.isDisabled ? 'disabled-cell' : '',
    },
    { 
      field: 'type', 
      headerName: 'Data Type', 
      flex: 1, 
      editable: true,
      cellClassName: (params) => params.row.isDisabled ? 'disabled-cell' : '',
    },
    
    { 
      field: 'comment', 
      headerName: 'Comment', 
      flex: 1, 
      editable: true,
      cellClassName: (params) => params.row.isDisabled ? 'disabled-cell' : '',
    },
    {
      field: 'schemaClassification',
      headerName: 'Schema Classification',
      flex: 1,
      renderCell: (params) => (
        <Autocomplete
          size="small"
          options={schemaClassificationOptions.flatMap(group => group.options)}
          groupBy={(option) => option.value.includes('physical') ? 'Mandatory' : 'Optional'}
          getOptionLabel={(option) => option.label}
          value={params.value || null}
          onChange={(event, newValue) => {
            handleCellChange({
              id: params.id,
              field: 'schemaClassification',
              value: newValue
            });
          }}
          renderGroup={(params) => (
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <GroupItems>{params.children}</GroupItems>
            </li>
          )}
          renderInput={(params) => (
            <TextField 
              {...params} 
              variant="outlined"
              placeholder="No Classification"
              sx={{ 
                '& .MuiInputBase-root': {
                  height: 30
                }
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />
      )
    }    
    ,    
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const row = rows.find(r => r.id === id);
        if (!row) return [];  // Guard clause to prevent undefined errors
        
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
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditClick(id)}
            disabled={row.isDisabled}
          />,
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
          />,
        ];
      },
    },
  ];
  const renderSchema = () => (
    schema && schema.length > 0 ? (
      <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
        <Box sx={{ mb:-1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button startIcon={<SaveIcon/>} onClick={handleSaveAll} disabled={!rows.some(row => row.isUnsaved)}>Save All</Button>
          <Button startIcon={<CancelIcon />} onClick={handleCancelAll} disabled={!rows.some(row => row.isUnsaved)}>Cancel All</Button>
        </Box>
        <Box sx={{ height: 400, width: '100%', overflow: 'auto' }}>
        <DataGrid
          rows={rows}
          columns={schemaColumns}
          autoPageSize
          rowsPerPageOptions={[10, 25, 50]}
          pageSizeOptions={[10, 100, { value: 1000, label: '1,000' }]}
          density="compact"
          editMode="cell"
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
            '& .disabled-cell': {
              backgroundColor: '#f5f5f5',
              cursor: 'not-allowed',
            },
          }}
        />
        </Box>
      </Box>
    ) : (
      <Typography>No schema available</Typography>
    )
  );
  const classificationIcons = {
    mandatory: <KeyIcon sx={{ color: 'primary.main', fontSize: 18 }} />,
    optional: <KeyOffIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
  };

  const isColumnMandatory = (classification) => {
    console.log('isColumnMandatory:', classification);
    return classification?.value?.includes('physical_');
  };
    const renderSampleData = () => (
      sampleData ? (
        <Box sx={{ mt:4, height: '100%', width: '100%', overflow: 'auto' }}>
          <Box sx={{ height: 400, width: '100%', overflow: 'auto' }}>
            <DataGrid
              rows={sampleData.map((row, index) => ({ id: index, ...row }))}
              columns={schema.map(col => ({
                field: col.name,
                headerName: col.name,
                renderHeader: (params) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {col.schemaClassification && 
                      (isColumnMandatory(col.schemaClassification) ? 
                        classificationIcons.mandatory : 
                        classificationIcons.optional)
                    }
                    {col.name}
                  </Box>
                ),
                flex: 1,
                minWidth: 150,
              }))}
              autoPageSize
              rowsPerPageOptions={[10, 25, 50]}
              columnHeaderHeight={40}
              rowHeight={40}
              density="compact"
              disableExtendRowFullWidth={false}
              disableColumnMenu
            />
          </Box>
        </Box>
      ) : (
        <Typography>No sample data available</Typography>
      )
    
  );  
  
  const renderRawData = () => (
    <Box sx={{ mt:4, height: 350, width: '100%', overflow: 'auto' }}>
    <TextField
      multiline
      fullWidth
      rows={15}
      sx={{
        '& .MuiInputBase-input': {
          fontFamily: 'monospace', // Set the font to monotype
        },
      }}
      size="small"
      value={rawData || ''}
      variant="outlined"
      InputProps={{
        readOnly: true,
      }}
    />
    </Box>
  );

  return (
    <Box sx={{mt:-3, ml: -2, overflow: 'auto' }}>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{
          minHeight: '20px', // Reduce overall tab height
          '& .MuiTabs-indicator': {
            bottom: '8px', // Bring the indicator line closer to the text
          },
        }}
      >
        <Tab label="General" icon={<SquareChartGanttIcon/> }  iconPosition="start" />
        <Tab label="Schema"  icon={<TablePropertiesIcon/>}  iconPosition="start" />
        <Tab label="Sample Data"  icon={<Grid3X3Icon/>}  iconPosition="start" />
        <Tab label="Raw Data" icon={<LetterTextIcon/>}  iconPosition="start"/>
      </Tabs>
      <Box sx={{ml:-1, mt:-5, p:2, overflow: 'auto' }}>
        {tabValue === 0 && renderGeneralInfo()}
        {tabValue === 1 && renderSchema()}
        {tabValue === 2 && renderSampleData()}
        {tabValue === 3 && renderRawData()}
      </Box>
    </Box>
  );
};

export default ResourceDataDictionaryDataPreview;