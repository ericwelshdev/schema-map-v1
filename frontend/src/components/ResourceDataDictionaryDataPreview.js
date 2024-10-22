import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import UndoIcon from '@mui/icons-material/Undo';

const ResourceDataPreview = ({ schema, resourceData, sourceInfo, sampleData, rawData }) => {
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
    originalState: { ...col, alternativeName: '', isPII: false, isPHI: false }
  })) : []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = (id) => {
    setRows(rows.map(row => row.id === id ? { ...row, isEditing: true } : row));
  };

  const handleSaveClick = (id) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const isChanged = JSON.stringify({ ...row, isEditing: false, isChanged: false }) !== JSON.stringify(row.originalState);
        return { ...row, isEditing: false, isChanged };
      }
      return row;
    }));
  };

  const handleCancelClick = (id) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const isChanged = JSON.stringify({ ...row.originalState, isEditing: false, isChanged: false }) !== JSON.stringify(row.originalState);
        return { ...row.originalState, isEditing: false, isChanged };
      }
      return row;
    }));
  };

  const handleDisableClick = (id) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const newDisabledState = !row.isDisabled;
        const isChanged = newDisabledState !== row.originalState.isDisabled;
        return { ...row, isDisabled: newDisabledState, isChanged };
      }
      return row;
    }));
  };

  const handleUndoClick = (id) => {
    setRows(rows.map(row => row.id === id ? { ...row.originalState, isChanged: false } : row));
  };

  const handleCellChange = (params) => {
    setRows(rows.map(row => {
      if (row.id === params.id) {
        const updatedRow = { ...row, [params.field]: params.value, isEditing: true };
        const isChanged = JSON.stringify(updatedRow) !== JSON.stringify(row.originalState);
        return { ...updatedRow, isChanged };
      }
      return row;
    }));
  };

  const renderGeneralInfo = () => (
    <Box>
      <Typography variant="h6">File Information</Typography>
      {sourceInfo && (
        <>
          <Typography variant="body2">Name: {sourceInfo.name}</Typography>
          <Typography variant="body2">Type: {sourceInfo.type}</Typography>
          <Typography variant="body2">Size: {sourceInfo.size} bytes</Typography>
          <Typography variant="body2">Last Modified: {sourceInfo.lastModified}</Typography>
        </>
      )}
    </Box>
  );

  const schemaColumns = [
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
      <Box sx={{ height: 400, width: '100%', overflow: 'auto' }}>
        <DataGrid
          rows={rows}
          columns={schemaColumns}
          autoPageSize
          rowsPerPageOptions={[10, 25, 50]}
          density="compact"
          editMode="row"
          onCellEditCommit={handleCellChange}
          isCellEditable={(params) => !params.row.isDisabled}
          components={{
            ColumnUnsortedIcon: ChangeCircleIcon,
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
    ) : (
      <Typography>No schema available</Typography>
    )
  );

  const renderSampleData = () => (
    sampleData ? (
      <Box sx={{ height: 350, width: '100%', overflow: 'auto' }}>
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
    ) : (
      <Typography>No sample data available</Typography>
    )
  );

  const renderRawData = () => (
    <TextField
      multiline
      fullWidth
      rows={15}
      size="small"
      value={rawData || ''}
      variant="outlined"
      InputProps={{
        readOnly: true,
      }}
    />
  );

  return (
    <Box sx={{mt:-3, ml: -2 }}>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="General"  />
        <Tab label="Schema" />
        <Tab label="Sample Data" />
        <Tab label="Raw Data" />
      </Tabs>
      <Box sx={{ml:-1, mt:-1, p: 2 }}>
        {tabValue === 0 && renderGeneralInfo()}
        {tabValue === 1 && renderSchema()}
        {tabValue === 2 && renderSampleData()}
        {tabValue === 3 && renderRawData()}
      </Box>
    </Box>
  );
};

export default ResourceDataPreview;