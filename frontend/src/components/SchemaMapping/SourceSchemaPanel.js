import React from 'react';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { styled } from '@mui/material/styles';

const PanelContainer = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper
}));


const handleShowProfiling = (row) => {
  // Add profiling logic here
  console.log('Show profiling for:', row);
};



const SourceSchemaPanel = ({ 
  schema, 
  onDragStart, 
  onShowSuggestions, 
  activeMappings,
  profilingResults 
}) => {
  const columns = [
    {
      field: 'name',
      headerName: 'Column Name',
      flex: 1,
      renderCell: (params) => (
        <Box
          draggable
          onDragStart={(e) => onDragStart(params.row)}
          sx={{ 
            cursor: 'grab',
            width: '100%',
            opacity: activeMappings.has(params.row.id) ? 0.5 : 1
          }}
        >
          {params.value}
        </Box>
      )
    },
    {
      field: 'type',
      headerName: 'Data Type',
      width: 120
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Show mapping suggestions">
            <IconButton
              size="small"
              onClick={() => onShowSuggestions(params.row)}
              disabled={activeMappings.has(params.row.id)}
            >
              <AutoFixHighIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Show profiling results">
            <IconButton
              size="small"
              onClick={() => handleShowProfiling(params.row)}
            >
              <AssessmentIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <PanelContainer elevation={2}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Source Schema</Typography>
      </Box>
      <Box sx={{ flex: 1, width: '100%' }}>
        <DataGrid
          rows={schema}
          columns={columns}
          density="compact"
          disableSelectionOnClick
          hideFooterPagination
        />
      </Box>
    </PanelContainer>
  );
};

export default SourceSchemaPanel;
