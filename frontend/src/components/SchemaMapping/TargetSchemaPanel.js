import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

const PanelContainer = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper
}));

const TargetSchemaPanel = ({ schema, onDrop, activeMappings }) => {
  const columns = [
    {
      field: 'name',
      headerName: 'Column Name',
      flex: 1,
      renderCell: (params) => (
        <Box
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onDrop(params.row);
          }}
          sx={{ 
            width: '100%',
            height: '100%',
            backgroundColor: (theme) => 
              Array.from(activeMappings.values()).includes(params.row.id) 
                ? theme.palette.action.selected 
                : 'transparent'
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
    }
  ];

  return (
    <PanelContainer elevation={2}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Target Schema</Typography>
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

export default TargetSchemaPanel;
