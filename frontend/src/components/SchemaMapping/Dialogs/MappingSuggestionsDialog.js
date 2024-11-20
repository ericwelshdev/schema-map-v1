import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  TextField,
  Box,
  Button,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const MappingSuggestionsDialog = ({ 
  open, 
  onClose, 
  sourceColumn = {}, 
  suggestions = [], 
  onApply 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMapping, setSelectedMapping] = useState(null);

  const {
    name = '',
    table = '',
    type = '',
    isPrimaryKey = false,
    isForeignKey = false,
    isPII = false,
    isPHI = false,
    currentMapping = null
  } = sourceColumn;

  const columns = [
    { 
      field: 'targetColumn', 
      headerName: 'Target Column', 
      flex: 1,
      valueGetter: (params) => params.row.name,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.row.name}</Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.table}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'confidence', 
      headerName: 'Confidence', 
      width: 120,
      renderCell: (params) => (
        <Chip
          label={`${(params.row.confidence * 100).toFixed()}%`}
          color={params.row.confidence > 0.7 ? 'success' : 'warning'}
          size="small"
        />
      )
    },
    { 
      field: 'matchReason', 
      headerName: 'Match Reason', 
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            {params.row.matchReason?.type}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Score: {params.row.matchReason?.score}%
          </Typography>
        </Box>
      )
    }
  ];

  const filteredSuggestions = suggestions.filter(suggestion => 
    suggestion.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.table?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Column Mapping Suggestions</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle1" gutterBottom>Source Column</Typography>
                <Typography variant="h6">{name}</Typography>
                <Typography color="textSecondary">{table}</Typography>
                <Typography variant="caption" display="block">Type: {type}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1" gutterBottom>Properties</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {isPrimaryKey && <Chip label="Primary Key" size="small" />}
                  {isForeignKey && <Chip label="Foreign Key" size="small" />}
                  {isPII && <Chip label="PII" size="small" color="warning" />}
                  {isPHI && <Chip label="PHI" size="small" color="error" />}
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1" gutterBottom>Current Mapping</Typography>
                {currentMapping ? (
                  <Box>
                    <Typography>{currentMapping.targetColumn}</Typography>
                    <Chip 
                      label={`${(currentMapping.confidence * 100).toFixed()}% Confidence`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                ) : (
                  <Typography color="textSecondary">No current mapping</Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search target columns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />
          }}
          sx={{ mb: 2 }}
        />

        <DataGrid
          rows={filteredSuggestions}
          columns={columns}
          autoHeight
          density="comfortable"
          getRowId={(row) => row.id || row.name}
          getRowClassName={(params) => 
            params.row.confidence > 0.7 ? 'top-suggestion' : ''
          }
          sx={{
            '& .top-suggestion': {
              backgroundColor: 'action.hover'
            }
          }}
          onRowClick={(params) => setSelectedMapping(params.row)}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={!selectedMapping}
            onClick={() => {
              onApply(selectedMapping);
              onClose();
            }}
            sx={{ ml: 2 }}
          >
            Apply Mapping
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MappingSuggestionsDialog;