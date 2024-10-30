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
  Button,
  Card,
  CardContent,
  Grid,
  Radio,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AssistantIcon from '@mui/icons-material/Assistant';
import BackHandIcon from '@mui/icons-material/BackHand';



const dataTypeOptions = [
  'STRING',
  'INTEGER',
  'DECIMAL',
  'DATE',
  'DATETIME',
  'BOOLEAN',
  'BINARY',
  'VARCHAR',
  'CHAR'
];


const ResourceDataDictionaryColumnMappingCandidateDialog = ({ 
  open, 
  onClose, 
  sourceColumn,
  candidates: initialCandidates = [],
  currentMapping = null,
  resourceSchema = null,
  onSelect 
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);


  // console.log('candidates form ResourceDataDictionaryColumnMappingCandidateDialog:', candidates);
  // console.log('resourceSchema form ResourceDataDictionaryColumnMappingCandidateDialog:', resourceSchema);

  // console.log('currentMapping form ResourceDataDictionaryColumnMappingCandidateDialog:', currentMapping);
  // console.log('sourceColumn form ResourceDataDictionaryColumnMappingCandidateDialog:', sourceColumn);

  useEffect(() => {
    if (currentMapping) {
      const existingMapping = initialCandidates.find(c => c.columnName === currentMapping.columnName && c.tableName === currentMapping.tableName);  
      console.log('useEffect -> existingMapping:', existingMapping);      
      setSelectedCandidate(existingMapping);
    }
  }, [currentMapping, initialCandidates]);

  const [allMappings, setAllMappings] = useState([]);


  
  useEffect(() => {
    setAllMappings([
      {
        id: 'manual-map',
        columnName: '',
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
      ...initialCandidates.map((candidate, index) => ({
        id: candidate.id || `candidate-${index}`,
        ...candidate
      }))
    ]);
  }, [initialCandidates]);
  
  
  

  const handleManualSubmit = (formData) => {
    console.log('handleManualSubmit-> Manual mapping submitted:', formData);

    const isEditing = selectedCandidate?.id && selectedCandidate.id !== 'manual-map';
    const newMapping = {
      id: isEditing ? selectedCandidate.id : `manual-${Date.now()}`,
      columnName: formData.physicalColumnName,
      tableName: formData.physicalTableName,
      logicalTableName: formData.logicalTableName,
      logicalColumnName: formData.logicalColumnName,
      dataType: formData.dataType,
      columnDescription: formData.description,
      primaryKey: formData.primaryKey,
      foreignKey: formData.foreignKey,
      isPHI: formData.isPHI,
      isPII: formData.isPII,
      isNullable: formData.isNullable,
      score: 1
    };
  
    setAllMappings(prev => {
      if (isEditing) {
        return prev.map(mapping => 
          mapping.id === selectedCandidate.id ? newMapping : mapping
        );
      }
      return [...prev, newMapping];
    });
    
    setSelectedCandidate(null);
    setShowManualForm(false);
  };
  

  const ManualMappingForm = ({ 
    open, 
    onClose, 
    onSubmit,
    sourceColumn,
    resourceSchema,
    selectedCandidate  
  }) => {
    console.log('sourceColumn from ManualMappingForm:', sourceColumn);
    console.log('resourceSchema from ManualMappingForm:', resourceSchema);
    console.log('selectedCandidate from ManualMappingForm:', selectedCandidate);
    const [manualMapping, setManualMapping] = useState({
      physicalTableName: selectedCandidate?.tableName || resourceSchema.matched_table_name || '',
      physicalColumnName: selectedCandidate?.columnName || resourceSchema.source_column_name || '',
      logicalTableName: selectedCandidate?.logicalTableName || resourceSchema.logicalTableName || '',
      logicalColumnName: selectedCandidate?.logicalColumnName || '',
      dataType: selectedCandidate?.dataType || resourceSchema.sourceDataType || 'STRING',
      description: '',
      primaryKey: selectedCandidate?.primaryKey || resourceSchema.sourcePrimaryKey || false,
      foreignKey: selectedCandidate?.foreignKey || resourceSchema.sourceForeignKey || false,
      isPHI: selectedCandidate?.isPHI || resourceSchema.sourcePHI || false,
      isPII: selectedCandidate?.isPII || resourceSchema.sourcePII || false,
      isNullable: selectedCandidate?.isNullable || resourceSchema.sourceNullable || false
    });
  
    const handleChange = (field, value) => {
      setManualMapping(prev => ({
        ...prev,
        [field]: value
      }));
    };
  
    const handleCreateMapping = () => {
      onSubmit({
        ...manualMapping,
        id: selectedCandidate?.id || `manual-${Date.now()}`
      });
    };
    
      
    const isEditMode = selectedCandidate?.id && selectedCandidate.id !== 'manual-map';

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Mapping' : 'Create New Mapping'}</DialogTitle>
      
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Physical Table Name"
                value={manualMapping.physicalTableName}
                onChange={(e) => handleChange('physicalTableName', e.target.value)}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Physical Column Name"
                value={manualMapping.physicalColumnName}
                onChange={(e) => handleChange('physicalColumnName', e.target.value)}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Logical Table Name"
                value={manualMapping.logicalTableName}
                onChange={(e) => handleChange('logicalTableName', e.target.value)}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Logical Column Name"
                value={manualMapping.logicalColumnName}
                onChange={(e) => handleChange('logicalColumnName', e.target.value)}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Data Type</InputLabel>
                <Select
                  value={manualMapping.dataType}
                  onChange={(e) => handleChange('dataType', e.target.value)}
                  label="Data Type"
                >
                  {dataTypeOptions.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormGroup row>
              <FormControlLabel
                  control={
                    <Checkbox 
                      checked={manualMapping.isNullable}
                      onChange={(e) => handleChange('isNullable', e.target.checked)}
                      size="small"
                    />
                  }
                  label="Allow Nulls"
                />                 
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={manualMapping.primaryKey}
                      onChange={(e) => handleChange('primaryKey', e.target.checked)}
                      size="small"
                    />
                  }
                  label="Primary Key"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={manualMapping.foreignKey}
                      onChange={(e) => handleChange('foreignKey', e.target.checked)}
                      size="small"
                    />
                  }
                  label="Foreign Key"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={manualMapping.isPHI}
                      onChange={(e) => handleChange('isPHI', e.target.checked)}
                      size="small"
                    />
                  }
                  label="PHI Indicator"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={manualMapping.isPII}
                      onChange={(e) => handleChange('isPII', e.target.checked)}
                      size="small"
                    />
                  }
                  label="PII Indicator"
                />
             
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={manualMapping.description}
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
          onClick={handleCreateMapping}
          disabled={!manualMapping.physicalTableName || !manualMapping.physicalColumnName}>{isEditMode ? 'Update Mapping' : 'Create Mapping'}
        </Button>
      </DialogActions>
      </Dialog>
    );
  };  


// In the dialog component's handleConfirmSelection function
// const handleConfirmSelection = () => {
//   console.log('Sending selected candidate:', selectedCandidate);
//   // Create a new object with only the needed properties
//   const mappingData = {
//     tableName: selectedCandidate.tableName,
//     columnName: selectedCandidate.columnName,
//     logicalTableName: selectedCandidate.logicalTableName,
//     logicalColumnName: selectedCandidate.logicalColumnName,
//     dataType: selectedCandidate.dataType,
//     columnDescription: selectedCandidate.columnDescription,
//     score: selectedCandidate.score
//   };
//   // Pass the mapping data directly
//   onSelect(mappingData);
//   onClose();
// };



  const getScoreColor = (score) => {
    if (score === -1) return '#bbdefb'; // Light blue for manual map
    if (score === 0) return 'grey.300';
    if (score >= 0.9) return 'success.light';
    if (score >= 0.7) return '#fff176';
    if (score >= 0.4) return '#ffb74d';
    return 'error.light';
  };

  const dataTypeOptions = [
    'STRING',
    'INTEGER',
    'DECIMAL',
    'DATE',
    'DATETIME',
    'BOOLEAN',
    'BINARY',
    'VARCHAR',
    'CHAR'
  ];


  useEffect(() => {
    if (selectedCandidate?.id === 'manual-map') {
      setShowManualForm(true);
    }
  }, [selectedCandidate]);


  const candidateColumns = [
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => {
        const getTypeInfo = (id) => {
          if (id === 'manual-map') return { label: 'Manual', icon: <BackHandIcon color="primary" /> };
          if (id === 'no-map') return { label: 'No Map', icon: <DoNotTouchIcon  color="error" /> };
          if (id.toString().startsWith('manual-')) return { label: 'Manual', icon: <BackHandIcon color="primary" /> };
          return { label: 'Sourced', icon: <AssistantIcon color="success" /> };
        };
  
        const typeInfo = getTypeInfo(params.row.id);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {typeInfo.icon}
            <Typography variant="body2">{typeInfo.label}</Typography>
          </Box>
        );
      }
    },
    // {
    //   field: 'select',
    //   headerName: '',
    //   width: 25,
    //   renderCell: (params) => (
    //     <Radio
    //       checked={selectedCandidate && 
    //         params.row.columnName === selectedCandidate.columnNamee}
    //       size="small"
    //       readOnly
    //     />
    //   )
    // },
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
    },
    {
      field: 'actions',
      headerName: '',
      width: 50,
      renderCell: (params) => {
        if (params.row.id.toString().startsWith('manual-')) {
          return (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCandidate(params.row);
                setShowManualForm(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          );
        }
        return null;
      }
    }
  ];

  const handleClose = () => {
    onClose(allMappings);
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
            rows={allMappings}
            columns={candidateColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableColumnMenu
            
            disableMultipleSelection={true}
            checkboxSelection
            disableColumnSelector
            disableColumnFilter 
            
           
            density="compact"
            isRowSelectable={(params) => params.row.id !== 'manual-map'}
            onSelectionModelChange={(newSelection) => {
              const selected = allMappings.find(m => m.id === newSelection[0]);
              setSelectedCandidate(selected);
            }}
            selectionModel={selectedCandidate ? [selectedCandidate.id] : []}
            onRowClick={(params) => {
              console.log('DataGrid -> Row clicked with data:', params.row);              
              setSelectedCandidate(params.row);
            }}
            // onCellClick={(params) => {
            //   if (params.field === '__check__' && params.row.id !== 'manual-map') {
            //     setSelectedCandidate(params.row);
            //   }
            // }}                  
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08) !important',
                },
              },
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'score', sort: 'desc' }],
              },
            }}
          />
        </Box>





        
        {selectedCandidate && selectedCandidate.id !== 'no-map' && selectedCandidate.id !== 'manual-map' && (
          <Card raised={true} sx={{ mt: 1 }} variant="outlined">
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
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">Allow Nulls</Typography>
                  <Typography variant="body2" noWrap>{selectedCandidate?.isNullable}</Typography>
                </Grid>                
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">Primary Key</Typography>
                  <Typography variant="body2" noWrap>{selectedCandidate?.primaryKey}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">Foreign Key</Typography>
                  <Typography variant="body2" noWrap>{selectedCandidate?.foreignKey}</Typography>
                </Grid>                
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">PHI Indicator</Typography>
                  <Typography variant="body2" noWrap>{selectedCandidate?.isPHI}</Typography>
                </Grid>  
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">PII Indicator</Typography>
                  <Typography variant="body2" noWrap>{selectedCandidate?.isPII}</Typography>
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
          onClick={() => {
            onSelect(selectedCandidate);
            handleClose();
          }}
          disabled={!selectedCandidate || selectedCandidate.id === 'manual-map'}
        >
          Confirm Selection
        </Button>

      </DialogActions>

      <ManualMappingForm 
        open={showManualForm}
        onClose={() => setShowManualForm(false)}
        onSubmit={handleManualSubmit}
        sourceColumn={sourceColumn}
        resourceSchema={resourceSchema}
        selectedCandidate={selectedCandidate}
      />
    </Dialog>
  );
};

export default ResourceDataDictionaryColumnMappingCandidateDialog;

