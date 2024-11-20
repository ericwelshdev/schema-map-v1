import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

const DataPreviewDialog = ({ open, onClose, columnData }) => {
  const columns = [
    { 
      field: 'value', 
      headerName: 'Sample Values', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          fontSize: '0.875rem'
        }}>
          <Typography variant="body2">{params.value}</Typography>
          <Typography variant="caption" color="textSecondary">
            Type: {typeof params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'frequency', 
      headerName: 'Frequency', 
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}%
        </Typography>
      )
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          Data Preview: {columnData?.name}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <DataGrid
          rows={columnData?.sampleData || []}
          columns={columns}
          autoHeight
          density="compact"
          disableSelectionOnClick
          hideFooterPagination
          sx={{
            '& .MuiDataGrid-cell': {
              fontSize: '0.875rem',
              py: 1
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DataPreviewDialog;
