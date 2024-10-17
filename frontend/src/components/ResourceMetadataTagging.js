import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Chip, IconButton, TextField, Button } from '@mui/material';
import { Edit, Save, Cancel, Block, Security, Psychology } from '@mui/icons-material';

const ResourceMetadataTagging = ({ resourceData }) => {
  const [rows, setRows] = useState(resourceData.schema || []);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    { field: 'columnName', headerName: 'Column Name', width: 150, editable: true },
    { field: 'alternativeName', headerName: 'Alternative Name', width: 150, editable: true },
    { field: 'dataType', headerName: 'Data Type', width: 120, editable: true },
    { field: 'columnOrder', headerName: 'Column Order', width: 120, type: 'number', editable: true },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 200,
      renderCell: (params) => (
        <Box>
          {params.value.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              color={tag.startsWith('AI:') ? 'secondary' : 'primary'}
              style={{ margin: '2px' }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: 'comments',
      headerName: 'Comments',
      width: 200,
      editable: true,
    },
    {
      field: 'flags',
      headerName: 'Flags',
      width: 120,
      renderCell: (params) => (
        <Box>
          {params.row.isPHI && <Security color="error" />}
          {params.row.isPII && <Security color="warning" />}
          {params.row.hasAIExplanation && <Psychology color="info" />}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}><Edit /></IconButton>
          <IconButton onClick={() => handleDisable(params.row)}><Block /></IconButton>
          <IconButton onClick={() => handleAIProcess(params.row)}><Psychology /></IconButton>
          {params.row.isEditing && (
            <>
              <IconButton onClick={() => handleSave(params.row)}><Save /></IconButton>
              <IconButton onClick={() => handleCancel(params.row)}><Cancel /></IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  const handleEdit = (row) => {
    setSelectedRow(row);
  };

  const handleDisable = (row) => {
    // Implement disable logic
  };

  const handleAIProcess = (row) => {
    // Implement AI processing logic
  };

  const handleSave = (row) => {
    // Implement save logic
  };

  const handleCancel = (row) => {
    // Implement cancel logic
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
      {selectedRow && (
        <Box sx={{ mt: 2 }}>
          <TextField label="Column Name" value={selectedRow.columnName} fullWidth margin="normal" />
          <TextField label="Alternative Name" value={selectedRow.alternativeName} fullWidth margin="normal" />
          <TextField label="Data Type" value={selectedRow.dataType} fullWidth margin="normal" />
          <TextField label="Column Order" type="number" value={selectedRow.columnOrder} fullWidth margin="normal" />
          <TextField label="Comments" value={selectedRow.comments} fullWidth margin="normal" multiline rows={3} />
          <Button variant="contained" color="primary" onClick={() => handleSave(selectedRow)} sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ResourceMetadataTagging;
