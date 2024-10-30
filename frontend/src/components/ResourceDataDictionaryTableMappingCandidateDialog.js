import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  Chip,
  Button,
  Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const ResourceDataDictionaryTableMappingCandidateDialog = ({ 
  open, 
  onClose, 
  tables = [], 
  currentTable,
  onSelect 
}) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const current = tables.find(t => t.tableName === currentTable);
    setSelectedTable(current);
  }, [currentTable, tables]);

  const filteredRows = useMemo(() => {
    return tables.filter(table => 
      table.tableName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tables, searchTerm]);

  const columns = [
    {
      field: 'tableName',
      headerName: 'Table',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>{params.value}</Typography>
      )
    },
    {
      field: 'confidenceScore',
      headerName: 'Overall',
      width: 90,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          color={(params.value || 0) >= 60 ? 'success.main' : 'error.main'}
        >
          {(params.value || 0).toFixed(1)}%
        </Typography>
      )
    },
    {
      field: 'tableNameSimilarity',
      headerName: 'Name Match',
      width: 100,
      renderCell: (params) => (
        <Typography 
          variant="body2"
          color={(params.value || 0) >= 60 ? 'success.main' : 'error.main'}
        >
          {(params.value || 0).toFixed(1)}%
        </Typography>
      )
    },
    {
      field: 'columnMatchConfidence',
      headerName: 'Col Match',
      width: 90,
      renderCell: (params) => (
        <Typography 
          variant="body2"
          color={(params.value || 0) >= 60 ? 'success.main' : 'error.main'}
        >
          {(params.value || 0).toFixed(1)}%
        </Typography>
      )
    },
    {
      field: 'matchQuality',
      headerName: 'Quality',
      width: 90,
      renderCell: (params) => (
        <Typography 
          variant="body2"
          color={(params.value || 0) >= 60 ? 'success.main' : 'error.main'}
        >
          {(params.value || 0).toFixed(1)}%
        </Typography>
      )
    },
    {
      field: 'columnCount',
      headerName: 'Columns',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.matchedColumns}/{params.row.totalColumns - params.row.disabledColumns} 
          {params.row.disabledColumns > 0 && 
            <Typography component="span" color="text.secondary">
              ({params.row.disabledColumns} disabled)
            </Typography>
          }
        </Typography>
      )
    }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Target Table</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search tables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: searchTerm && (
              <IconButton
                size="small"
                onClick={() => setSearchTerm('')}
                edge="end"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
        />
        </Box>
        <Box sx={{ height: 550, width: '100%', overflow: 'auto' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          density="compact"
          autoPageSize
          rowsPerPageOptions={[10, 25, 50]}
          pageSizeOptions={[10, 100, { value: 1000, label: '1,000' }]}
          getRowId={(row) => row.tableName}
          disableMultipleSelection
          selectionModel={selectedTable ? [selectedTable.tableName] : []}
          onRowClick={(params) => setSelectedTable(params.row)}
          initialState={{
            sorting: {
              sortModel: [{ field: 'confidenceScore', sort: 'desc' }],
            },
          }}
          sx={{
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: '#bbdefb !important',
              '&:hover': {
                backgroundColor: '#90caf9 !important',
              }
            },
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
              backgroundColor: '#f5f5f5'
            }
          }}
        />
        </Box>

        {selectedTable && (
          <Card raised={true} sx={{ mt: 1, borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
            <Grid container spacing={1}>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="textSecondary">Physical Name</Typography>
                <Typography variant="body2" noWrap>{selectedTable.tableName}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="textSecondary">Logical Name</Typography>
                <Typography variant="body2" noWrap>{selectedTable.logicalName || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="textSecondary">Total Columns</Typography>
                <Typography variant="body2" noWrap>{selectedTable.totalColumns}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="textSecondary">Keys</Typography>
                <Typography variant="body2" noWrap>
                  PK: {selectedTable.pkCount || 0} / FK: {selectedTable.fkCount || 0}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">Description</Typography>
                <Typography variant="body2" noWrap>{selectedTable.description || 'No description available'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={0.5}>
                  {(selectedTable.tags || []).map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ height: 20 }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => onSelect(selectedTable.tableName)} 
          variant="contained" 
          disabled={!selectedTable}
        >
          Confirm Selection
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceDataDictionaryTableMappingCandidateDialog;
