import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Box, 
  IconButton, 
  Typography,
  Tooltip,
  Radio,
  Card,
  CardContent,
  Grid,
  Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

const ResourceDataDictionaryColumnMappingCandidateDialog = ({ 
  open, 
  onClose, 
  sourceColumn,
  candidates = [], 
  currentMapping = null,
  onSelect 
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);


  const getScoreColor = (score) => {
    if (score === -1) return '#bbdefb'; // Light blue for manual map
    if (score === 0) return 'grey.300';
    if (score >= 0.9) return 'success.light';
    if (score >= 0.7) return '#fff176';
    if (score >= 0.4) return '#ffb74d';
    return 'error.light';
  };
  

  
  // Set initial selection based on current mapping
  useEffect(() => {
    if (currentMapping) {
      const existingMapping = candidates.find(c => c.columnName === currentMapping.columnName);
      setSelectedCandidate(existingMapping);
    }
  }, [currentMapping, candidates])

  useEffect(() => {
    if (selectedCandidate?.id === 'manual-map') {
      setShowManualForm(true);
    }
  }, [selectedCandidate]);


    // Add No Map option to candidates
    const allCandidates = [
      {
        id: 'manual-map',
        columnName: 'Manual Map',
        score: -1, // Special score for manual mapping
        logicalTableName: '',
        logicalColumnName: '',
        dataType: '',
        columnDescription: 'Create a new dictionary mapping'
      },
      {
        id: 'no-map',
        columnName: 'No Map',
        score: 0,
        logicalTableName: '',
        logicalColumnName: '',
        dataType: '',
        columnDescription: 'Explicitly mark this column as unmapped'
      },     
      ...candidates.map((candidate, index) => ({
        id: index,
        ...candidate
      }))
    ];


    const handleConfirmSelection = () => {
      if (selectedCandidate) {
        onSelect({
          tableName: selectedCandidate.tableName,
          columnName: selectedCandidate.columnName
        });
        onClose();
      }
    };

  const candidateColumns = [
    {
      field: 'select',
      headerName: 'Select',
      width: 70,
      renderCell: (params) => (
        <Radio
          checked={selectedCandidate?.id === params.row.id}
          onChange={() => setSelectedCandidate(params.row)}
          onClick={(e) => e.stopPropagation()}
        />
      )
    },
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
          bgcolor: getScoreColor(params.value),
          p: 0.5,
          borderRadius: 1,
          textAlign: 'center'
        }}>
          {params.value === 0 ? 'No Map' : `${(params.value * 100).toFixed(0)}%`}
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

  // const candidateRows = candidates.map((candidate, index) => ({
  //   id: index,
  //   ...candidate
  // }));

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
        <Box sx={{ height: 400 }}>
        <DataGrid
          rows={allCandidates}
          columns={candidateColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          disableSelectionOnClick
          density="compact"
          onRowClick={(params) => setSelectedCandidate(params.row)}
          isRowSelectable={() => true}
          disableColumnMenu
          disableColumnSelector
          disableColumnFilter
          disableDensitySelector
          editMode="none"
          isCellEditable={() => false}
          sx={{
            '& .MuiDataGrid-row': {
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
        </Box>
        
        {selectedCandidate && (
          <Card sx={{ ml:-2, mt: -1 }}>
            <CardContent>
              <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">Physical Table</Typography>
                  <Typography>{selectedCandidate.tableName}</Typography>
                </Grid>
              <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">Physical Column</Typography>
                  <Typography>{selectedCandidate.tableName}</Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">Logical Table</Typography>
                  <Typography>{selectedCandidate.logicalTableName}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">Logical Column</Typography>
                  <Typography>{selectedCandidate.logicalColumnName}</Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">Data Type</Typography>
                  <Typography>{selectedCandidate.dataType}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                  <Typography>{selectedCandidate.columnDescription}</Typography>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>                  
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleConfirmSelection}
          disabled={!selectedCandidate}
        >
          Confirm Selection
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceDataDictionaryColumnMappingCandidateDialog;
