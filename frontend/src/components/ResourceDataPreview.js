
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button , Chip, Autocomplete  } from '@mui/material';
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
import KeyIcon from '@mui/icons-material/Key';
import LinkIcon from '@mui/icons-material/Link';
import PIIIcon from '@mui/icons-material/Security';
import PHIIcon from '@mui/icons-material/HealthAndSafety';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { SquareChartGanttIcon, TablePropertiesIcon, Grid3X3Icon, LetterTextIcon } from "lucide-react";
import { debounce } from 'lodash';
import { initDB,  getData, setData } from '../utils/storageUtils';

    const ResourceDataPreview = ({ schema, resourceData, resourceInfo, sampleData, rawData, onDataChange }) => {
      const [tabValue, setTabValue] = useState(() => {
        const savedTab = localStorage.getItem('previewTabValue');
        return savedTab ? parseInt(savedTab) : 1;
      });
        const [rows, setRows] = useState([]);

        useEffect(() => {
          const loadSavedData = async () => {
            try {
              await initDB();
              const savedRows = await getData('resourcePreviewRows');
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
          isPrimaryKey: false,
          isForeignKey: false,
          user_tag_cmplx: [],
          ai_tag_cmplx: [],
          isEditing: false,
          isChanged: false,
          isDisabled: false,
          isUnsaved: false,
          originalState: { id: index, ...col }
          }));
          setRows(initialRows);
          await setData('resourcePreviewRows', initialRows);
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
      //       isPII: false,
      //       isPHI: false,
      //       isEditing: false,
      //       isChanged: false,
      //       isDisabled: false,
      //       isUnsaved: false,
      //       originalState: { id: index, ...col }
      //     }));
      //     setRows(initialRows);
      //   // localStorage.setItem('ddResourcePreviewRows', JSON.stringify(initialRows));
      //   setData('resourcePreviewRows', initialRows);
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

    const persistRows = useCallback(async (updatedRows) => {
      setRows(updatedRows);
      await setData('resourcePreviewRows', updatedRows);
      onDataChange?.({
        processedSchema: updatedRows,
        sampleData,
        resourceInfo
      });
    }, [onDataChange, sampleData, resourceInfo]);

    const handleEditClick = useCallback((id) => {
      persistRows(rows.map(row => row.id === id ? { ...row, isEditing: true, isUnsaved: true } : row));
    }, [persistRows, rows]);



const coreTags = ['PII', 'Sensitive', 'Confidential', 'Business', 'Required'];


const [tagDictionary, setTagDictionary] = useState([]);

const handleCellChange = useCallback((params) => {
  persistRows(rows.map(row => {
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
}, [persistRows, rows]);


// Update tag handling
const handleTagChange = useCallback((id, newTags) => {
  setTagDictionary(prevDict => [...new Set([...prevDict, ...newTags])]);
  persistRows(rows.map(row => 
    row.id === id 
      ? {
          ...row,
          user_tag_cmplx: JSON.stringify(newTags),
          isEditing: true,
          isUnsaved: true,
          isChanged: true
        }
      : row
  ));
}, [rows, persistRows]);

  
const handleTagDelete = useCallback((id, tagToDelete, tagType) => {
  const row = rows.find(r => r.id === id);
  const currentTags = JSON.parse(row[`${tagType}_tag_cmplx`] || '[]');
  const newTags = currentTags.filter(tag => tag !== tagToDelete);
  handleCellChange({
    id,
    field: `${tagType}_tag_cmplx`,
    value: JSON.stringify(newTags)
  });
}, [rows, handleCellChange]);


const handleSaveClick = useCallback((id) => {
  persistRows(rows.map(row => {
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
}, [persistRows, rows]);
  

const handleCancelClick = useCallback((id) => {
  persistRows(rows.map(row => {
    if (row.id === id) {
      return { ...row.originalState, id: row.id, isEditing: false, isChanged: false, isUnsaved: false };
    }
    return row;
  }));
}, [persistRows, rows]);

const handleDisableClick = useCallback((id) => {
  persistRows(rows.map(row => {
    if (row.id === id) {
      const newDisabledState = !row.isDisabled;
      const isChanged = newDisabledState !== row.originalState.isDisabled;
      return { ...row, isDisabled: newDisabledState, isChanged, isUnsaved: true, isEditing: true };
    }
    return row;
  }));
}, [persistRows, rows]);


const handleUndoClick = useCallback((id) => {
  persistRows(rows.map(row => {
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
}, [persistRows, rows]);




  

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

  const memoizedColumns = useMemo(() => [


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
      width:150,
      editable: true,
      cellClassName: (params) => params.row.isDisabled ? 'disabled-cell' : '',
    },
    {
      field: 'type',
      headerName: 'Data Type',
      width:100,
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
      field: 'tags',
      headerName: 'Tags',
      flex: 1,
      renderCell: (params) => (
        <Autocomplete
        multiple
        options={coreTags}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip variant="outlined" label={option} key={key} {...tagProps}
                size="small"
                sx={{ 
                  height: 25,
                  fontSize: '0.6.5rem',
                  color: 'primary.main',
                  px: 1,
                  '& .MuiChip-label': { px: 0.75 }
                }}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField 
              {...params} 
              variant="outlined" 
              size="small" 
              placeholder="Add tags"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  height: 35,
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
      field: 'isPrimaryKey',
      headerName: 'PK',
      width: 50,
      renderCell: (params) => (
        <GridActionsCellItem
          icon={<KeyIcon color={params.row.pk_ind ? "primary" : "disabled"} />}
          label="Toggle Primary Key"
          onClick={() => !params.row.isDisabled && handleCellChange({ id: params.id, field: 'pk_ind', value: !params.row.pk_ind })}
          disabled={params.row.isDisabled}
        />
      )
    },
    {
      field: 'isForeignKey',
      headerName: 'FK',
      width: 50,
      renderCell: (params) => (
        <GridActionsCellItem
          icon={<LinkIcon color={params.row.fk_ind ? "primary" : "disabled"} />}
          label="Toggle Foreign Key"
          onClick={() => !params.row.isDisabled && handleCellChange({ id: params.id, field: 'fk_ind', value: !params.row.fk_ind })}
          disabled={params.row.isDisabled}
        />
      )
    },
    {
      field: 'isPII',
      headerName: 'PII',
      width: 50,
      renderCell: (params) => (
        <GridActionsCellItem
          icon={<PIIIcon  color={params.row.isPII ? "primary" : "disabled"} />}
          label="Toggle PII"
          onClick={() => !params.row.isDisabled && handleCellChange({ id: params.id, field: 'isPII', value: !params.row.isPII })}
          disabled={params.row.isDisabled}
        />
      )
    },
    {
      field: 'isPHI',
      headerName: 'PHI',
      width: 50,
      renderCell: (params) => (
        <GridActionsCellItem
          icon={<PHIIcon color={params.row.isPHI ? "primary" : "disabled"} />}
          label="Toggle PHI"
          onClick={() => !params.row.isDisabled && handleCellChange({ id: params.id, field: 'isPHI', value: !params.row.isPHI })}
          disabled={params.row.isDisabled}
        />
      )
    },
   
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
  ], [
    handleCancelClick,
    handleCellChange,
    handleDisableClick,
    handleEditClick,
    handleSaveClick,
    handleTagChange,
    handleTagDelete,
    handleUndoClick,
    rows,
    tagDictionary
  ]);
  


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
          columns={memoizedColumns}        
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
    const renderSampleData = () => (
      sampleData ? (
        <Box sx={{ mt:4 , height: '100%', width: '100%', overflow: 'auto' }}>
          <Box sx={{ height: 400, width: '100%', overflow: 'auto' }}>
          <DataGrid
            rows={sampleData.map((row, rowIndex) => {
              // Convert array data to object with placeholder column names if needed
              const processedRow = resourceInfo?.hasHeader ? row : 
                Object.values(row).reduce((acc, value, index) => {
                  acc[`col_${index + 1}`] = value;
                  return acc;
                }, {});
              return { id: rowIndex, ...processedRow };
            })}
            columns={rows.map(schemaCol => ({
              field: schemaCol.name,
              headerName: schemaCol.alternativeName || schemaCol.name,
              flex: 1,
              minWidth: 150,
              disabled: schemaCol.isDisabled,
              renderHeader: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {params.colDef.headerName}
                  {schemaCol.isPHI && <PHIIcon color="primary" sx={{ fontSize: 16 }} />}
                  {schemaCol.isPII && <PIIIcon color="primary" sx={{ fontSize: 16 }} />}
                  {schemaCol.isDisabled && <VisibilityOffOutlinedIcon color="primary" sx={{ fontSize: 16 }} />}
                </Box>
              ),
              cellClassName: schemaCol.isDisabled ? 'disabled-cell' : '',
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

export default ResourceDataPreview;