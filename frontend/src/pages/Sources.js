// frontend/src/components/pages/Sources.js

import React, { useState, useMemo } from 'react';
import { 
  Typography, Box, Breadcrumbs, Link, ToggleButtonGroup, ToggleButton,
  Card, CardContent, CardActions, IconButton, Grid, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Switch, FormControlLabel, List, ListItem,
  Tooltip, Container
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ViewModule, ViewList, Edit, FileCopy, Share, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useView } from '../context/ViewContext';

const Sources = () => {
  const [sourcesView, setSourcesView] = useState('card');
  const [filter, setFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [deleteAllDependents, setDeleteAllDependents] = useState(true);
  const navigate = useNavigate();
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setSourcesView(newView);
    }
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleSourceClick = (source) => {
    navigate('/source-detail', { state: { source } });
  };

  const handleEditClick = (source) => {
    navigate(`/source/${source.id}`);
  };

  const handleDeleteClick = (source) => {
    setSelectedSource(source);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Implement delete logic here
    setDeleteDialogOpen(false);
  };

  const sourcesData = [
    { id: 1, name: 'Source 1', type: 'Database', connectionString: 'example1', lastUpdated: '2023-05-10', description: 'This is a sample database source' },
    { id: 2, name: 'Source 2', type: 'API', endpoint: 'https://api.example.com', lastUpdated: '2023-05-09', description: 'This is a sample API source' },
    // Add more sources as needed
  ];

  const columns = [
    { field: 'name', headerName: 'Source Name', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'lastUpdated', headerName: 'Last Updated', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEditClick(params.row)}><Edit /></IconButton>
          <IconButton><FileCopy /></IconButton>
          <IconButton><Share /></IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row)}><Delete /></IconButton>
        </Box>
      ),
    },
  ];

  const DeleteDialog = ({ open, onClose, source }) => {
    const dependentItems = useMemo(() => [
      'Mappings', 'Data Profiles', 'Data Dictionaries'
    ], []);

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete Source</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this source? This action cannot be undone.</Typography>
          <FormControlLabel
            control={
              <Switch 
                checked={deleteAllDependents} 
                onChange={() => setDeleteAllDependents(!deleteAllDependents)}
              />
            }
            label="Delete all dependents"
          />
          <List>
            {dependentItems.map((item) => (
              <ListItem key={item}>
                <FormControlLabel
                  control={<Switch disabled={deleteAllDependents} />}
                  label={item}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ width: '100%', padding: '24px' }}>
        <Box mb={3}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">Home</Link>
            <Typography color="textPrimary">Sources</Typography>
          </Breadcrumbs>
        </Box>

        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={3} 
          width="100%"
        >
          <ToggleButtonGroup 
            value={filter} 
            exclusive 
            onChange={handleFilterChange} 
            aria-label="filter"
          >
            <ToggleButton value="all" aria-label="all sources">All Sources</ToggleButton>
            <ToggleButton value="database" aria-label="database sources">Databases</ToggleButton>
            <ToggleButton value="api" aria-label="api sources">APIs</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup value={sourcesView} exclusive onChange={handleViewChange}>
            <ToggleButton value="card"><ViewModule /></ToggleButton>
            <ToggleButton value="grid"><ViewList /></ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {sourcesView === 'card' ? (
          <Grid container spacing={3}>
            {sourcesData.map((source) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={source.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>{source.name}</Typography>
                    <Tooltip title={source.description} arrow>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }} noWrap>
                        {source.description}
                      </Typography>
                    </Tooltip>
                    <Typography variant="body2">Type: {source.type}</Typography>
                    <Typography variant="body2">Last Updated: {source.lastUpdated}</Typography>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <IconButton onClick={() => handleEditClick(source)}><Edit /></IconButton>
                    <IconButton><FileCopy /></IconButton>
                    <IconButton><Share /></IconButton>
                    <IconButton onClick={() => handleDeleteClick(source)}><Delete /></IconButton>
                  </CardActions>
                </Card>
              </Grid>              
            ))}
          </Grid>
        ) : (
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid 
              rows={sourcesData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              autoHeight
            />
          </Box>
        )}

        <DeleteDialog 
          open={deleteDialogOpen} 
          onClose={() => setDeleteDialogOpen(false)} 
          source={selectedSource} 
        />
      </Box>
    </Container>
  );
};

export default Sources;