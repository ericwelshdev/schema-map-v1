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
  Button,
  TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

const ManualMappingForm = ({ open, onClose, onSubmit, sourceColumn }) => {
  const [formData, setFormData] = useState({
    physicalTableName: '',
    physicalColumnName: sourceColumn || '', // Pre-fill with source column
    logicalTableName: '',
    logicalColumnName: '',
    dataType: '',
    description: ''
  });
  console.log('Manual form data:', formData);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Manual Mapping</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Physical Table Name"
              value={formData.physicalTableName}
              defaultValue={sourceColumn}
              onChange={(e) => handleChange('physicalTableName', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Physical Column Name"
              value={formData.physicalColumnName}
              onChange={(e) => handleChange('physicalColumnName', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Logical Table Name"
              value={formData.logicalTableName}
              onChange={(e) => handleChange('logicalTableName', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Logical Column Name"
              value={formData.logicalColumnName}
              onChange={(e) => handleChange('logicalColumnName', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Data Type"
              value={formData.dataType}
              onChange={(e) => handleChange('dataType', e.target.value)}
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              size="small"
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={() => onSubmit(formData)}
          disabled={!formData.physicalTableName || !formData.physicalColumnName}
        >
          Create Mapping
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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

  useEffect(() => {
    if (currentMapping) {
      const existingMapping = candidates.find(c => c.columnName === currentMapping.columnName);      
      setSelectedCandidate(existingMapping);
    }
  }, [currentMapping, candidates]);

  const handleRowClick = (params) => {
    console.log('Row clicked:', params.row);
    setSelectedCandidate(params.row);
    if (params.row.id === 'manual-map') {
      setShowManualForm(true);
    }
  };

  const handleManualSubmit = (formData) => {
    console.log('Manual mapping submitted:', formData);
    const newMapping = {
      tableName: formData.physicalTableName,
      columnName: formData.physicalColumnName,
      logicalTableName: formData.logicalTableName,
      logicalColumnName: formData.logicalColumnName,
      dataType: formData.dataType,
      columnDescription: formData.description,
      score: -1
    };
    console.log('New mapping created:', newMapping);
    onSelect(formatMappingForParent({...formData, score: -1}));
    setShowManualForm(false);
    onClose();
  };

  // const handleConfirmSelection = () => {
  //   console.log('Confirming selection:', selectedCandidate);
  //   if (selectedCandidate) {
  //     const mappingData = {
  //       tableName: selectedCandidate.tableName,
  //       columnName: selectedCandidate.columnName,
  //       score: selectedCandidate.score
  //     };
  //     console.log('Mapping data being sent:', mappingData);
  //     onSelect(formatMappingForParent(selectedCandidate));
  //     onClose();
  //   }
  // };


  const handleConfirmSelection = () => {
    console.log('Confirming selection:', selectedCandidate);
    if (selectedCandidate) {
      const mappingData = {
        tableName: selectedCandidate.tableName,
        columnName: selectedCandidate.columnName,
        logicalTableName: selectedCandidate.logicalTableName,
        logicalColumnName: selectedCandidate.logicalColumnName,
        dataType: selectedCandidate.dataType,
        columnDescription: selectedCandidate.columnDescription,
        score: selectedCandidate.score
      };
      console.log('Mapping data being sent:', mappingData);
      onSelect(mappingData);
      onClose();
    }
  };
  

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
      const existingMapping = candidates.find(c => 
        `${c.tableName}.${c.columnName}` === `${currentMapping.tableName}.${currentMapping.columnName}`
      );
      setSelectedCandidate(existingMapping);
    }
  }, [currentMapping, candidates]);

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
      score: -1,
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

  const candidateColumns = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        <Radio
          checked={selectedCandidate?.id === params.row.id}
          size="small"
          readOnly
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
      headerName: 'Score', 
      width: 90,
      renderCell: (params) => (
        <Box sx={{
          width: '100%',
          bgcolor: getScoreColor(params.value),
          p: 0,
          borderRadius: 1,
          fontSize: '0.75rem',
          textAlign: 'center'
        }}>
          {params.value === -1 ? 'Manual' : params.value === 0 ? 'No Map' : `${(params.value * 100).toFixed(0)}%`}
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

  const formatMappingForParent = (data) => {
    console.log('Formatting mapping data:', data);
    return {
      tableName: data.tableName || data.physicalTableName,
      columnName: data.columnName || data.physicalColumnName,
      logicalTableName: data.logicalTableName,
      logicalColumnName: data.logicalColumnName,
      dataType: data.dataType,
      columnDescription: data.description || data.columnDescription,
      score: data.score
    };
  };  

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          height: '70vh',
          maxHeight: 800
        }
      }}
    >
      <DialogTitle sx={{ 
        py: 1,
        px: 2,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Box>
          <Typography variant="subtitle1">Available Mapping Candidates</Typography>
          <Typography variant="caption" color="textSecondary">
            Source Column: {sourceColumn}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 1 }}>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={allCandidates}
            columns={candidateColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableColumnMenu
            disableSelectionOnClick
            disableColumnSelector
            disableColumnFilter
            hideFooterSelectedRowCount
            density="compact"
            onRowClick={handleRowClick}
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer'
              }
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'score', sort: 'desc' }],
              },
            }}
          />
        </Box>
        
        {selectedCandidate && selectedCandidate.id !== 'no-map' && selectedCandidate.id !== 'manual-map' && (
          <Card sx={{ mt: 1 }} variant="outlined">
            <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
              <Grid container spacing={1}>
              <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">Logical Table</Typography>
                  <Typography variant="body2" noWrap>{selectedCandidate.logicalTableName}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">Logical Column</Typography>
                  <Typography variant="body2" noWrap>{selectedCandidate.logicalColumnName}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="caption" color="textSecondary">Data Type</Typography>
                  <Typography variant="body2" noWrap>{selectedCandidate.dataType}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">Description</Typography>
                  <Typography variant="body2" noWrap>{selectedCandidate.columnDescription}</Typography>
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

      <ManualMappingForm 
        open={showManualForm}
        onClose={() => setShowManualForm(false)}
        onSubmit={handleManualSubmit}
        sourceColumn={sourceColumn}
      />
    </Dialog>
  );
};

export default ResourceDataDictionaryColumnMappingCandidateDialog;

