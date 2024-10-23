
import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, TextField, Button } from '@mui/material';
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


const ResourceDataPreview = ({ schema, resourceData, resourceInfo, sampleData, rawData }) => {
  const [tabValue, setTabValue] = useState(0);
  const [rows, setRows] = useState(schema ? schema.map((col, index) => ({ 
    id: index,
    ...col,
    alternativeName: '',
    isPII: false,
    isPHI: false,
    isEditing: false,
    isChanged: false,
    isDisabled: false,
    isUnsaved: false,
    originalState: { id: index, ...col, alternativeName: '', isPII: false, isPHI: false }
  })) : []);


  // Load persisted tab value and row edits on component mount
  useEffect(() => {
    const savedTabValue = localStorage.getItem('resourceTabValue');
    const savedRows = localStorage.getItem('resourceRows');
    if (savedTabValue !== null) setTabValue(Number(savedTabValue));
    if (savedRows) setRows(JSON.parse(savedRows));
  }, []);

  // Save tab value to localStorage
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem('resourceTabValue', newValue);
  };

  // Save rows to localStorage on every row change
  const persistRows = (updatedRows) => {
    setRows(updatedRows);
    localStorage.setItem('resourceRows', JSON.stringify(updatedRows));
  };

  const handleEditClick = (id) => {
    persistRows(rows.map(row => row.id === id ? { ...row, isEditing: true, isUnsaved: true } : row));
  };

  const handleSaveClick = (id) => {
    persistRows(rows.map(row => {
      if (row.id === id) {
        const isChanged = JSON.stringify({ ...row, isEditing: false, isChanged: false, isUnsaved: false }) !== JSON.stringify(row.originalState);
        return { ...row, isEditing: false, isChanged, isUnsaved: false };
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
    persistRows(rows.map(row => row.id === id ? { ...row.originalState, id: row.id, isChanged: false, isUnsaved: false } : row));
  };

  const handleCellChange = (params) => {
    persistRows(rows.map(row => {
      if (row.id === params.id) {
        const updatedRow = { ...row, [params.field]: params.value, isEditing: true, isUnsaved: true };
        const isChanged = JSON.stringify(updatedRow) !== JSON.stringify(row.originalState);
        return { ...updatedRow, isChanged };
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
    { field: 'order', headerName: 'Column Order', flex: 1 },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 1,
      editable: true,
      cellClassName: (params) => params.row.isDisabled ? 'disabled-cell' : '',
    },
    {
      field: 'isPII',
      headerName: 'PII',
      width: 100,
      renderCell: (params) => (
        <GridActionsCellItem
          icon={<LockPersonIcon color={params.row.isPII ? "primary" : "disabled"} />}
          label="Toggle PII"
          onClick={() => !params.row.isDisabled && handleCellChange({ id: params.id, field: 'isPII', value: !params.row.isPII })}
          disabled={params.row.isDisabled}
        />
      )
    },
    {
      field: 'isPHI',
      headerName: 'PHI',
      width: 100,
      renderCell: (params) => (
        <GridActionsCellItem
          icon={<LocalHospitalIcon color={params.row.isPHI ? "primary" : "disabled"} />}
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
        const isEditing = row?.isEditing;

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
            disabled={row?.isDisabled}
          />,
          <GridActionsCellItem
            icon={<BlockIcon />}
            label="Disable"
            onClick={() => handleDisableClick(id)}
          />,
          <GridActionsCellItem
            icon={<UndoIcon />}
            label="Undo"
            onClick={() => handleUndoClick(id)}
            disabled={!row?.isChanged}
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
          editMode="row"
          onCellEditCommit={handleCellChange}
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
          rows={sampleData.map((row, index) => ({ id: index, ...row }))}
          columns={schema.map(col => ({
            field: col.name,
            headerName: col.name,
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
          components={{
            ColumnResizeIcon: () => null,
          }}
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
        <Tab label="General" />
        <Tab label="Schema" />
        <Tab label="Sample Data" />
        <Tab label="Raw Data" />
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