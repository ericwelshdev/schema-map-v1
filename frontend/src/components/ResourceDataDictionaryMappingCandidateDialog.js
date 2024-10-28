// frontend\src\components\ResourceDataDictionaryMappingCandidateDialog.js
import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Box, 
  IconButton, 
  Typography,
  Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

const ResourceDataDictionaryMappingCandidateDialog = ({ 
  open, 
  onClose, 
  sourceColumn,
  candidates, 
  onSelect 
}) => {
  const candidateColumns = [
    { 
      field: 'columnName', 
      headerName: 'Column Name', 
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      )
    },
    { 
      field: 'score', 
      headerName: 'Match Score', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{
          width: '100%',
          bgcolor: params.value > 0.7 ? 'success.light' : 'warning.light',
          p: 0.5,
          borderRadius: 1,
          textAlign: 'center'
        }}>
          {(params.value * 100).toFixed(0)}%
        </Box>
      )
    },
    { 
      field: 'logicalTableName', 
      headerName: 'Logical Table', 
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    { 
      field: 'logicalColumnName', 
      headerName: 'Logical Column', 
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    { 
      field: 'dataType', 
      headerName: 'Data Type', 
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      )
    },
    { 
      field: 'columnDescription', 
      headerName: 'Description', 
      flex: 2,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Tooltip>
      )
    }
  ];

  const rows = candidates.map((candidate, index) => ({
    id: index,
    ...candidate
  }));

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: 800
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Box>
          <Typography variant="h6">Available Mapping Candidates</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Source Column: {sourceColumn}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <DataGrid
          rows={rows}
          columns={candidateColumns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          autoHeight
          density="compact"
          onRowClick={(params) => {
            onSelect(params.row);
            onClose();
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              cursor: 'pointer'
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover'
            }
          }}
          initialState={{
            sorting: {
              sortModel: [{ field: 'score', sort: 'desc' }],
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDataDictionaryMappingCandidateDialog;
