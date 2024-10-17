// frontend/src/components/pages/Sources.js

import React, { useState, useEffect, useMemo } from 'react';
import { getSources, deleteSource } from '../services/sourceService';
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
  const { projectsView, setProjectsView } = useView();
  const [sourcesView, setSourcesView] = useState('card');
  const [filter, setFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [deleteAllDependents, setDeleteAllDependents] = useState(true);
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const data = await getSources();
      setSources(data);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

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

  const handleEditClick = (source) => {
    navigate('/workspace', { state: { source } });
  };

  const handleDeleteClick = (source) => {
    setSelectedSource(source);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSource(selectedSource.ds_id);
      setDeleteDialogOpen(false);
      fetchSources();
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  const columns = [
    { field: 'dsstrc_attr_grp_id', headerName: 'Source ID', flex: 1 },
    { field: 'dsstrc_attr_grp_nm', headerName: 'Source Name', flex: 1 },
    { field: 'dsstrc_attr_grp_shrt_nm', headerName: 'Source Short Name', flex: 1 },
    { field: 'dsstrc_attr_grp_desc', headerName: 'Description', flex: 1 },
    { field: 'physcl_data_typ_nm', headerName: 'Data Type', flex: 1 },
    { field: 'updt_ts', headerName: 'Last Updated', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
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
            <ToggleButton value="active" aria-label="active sources">Active</ToggleButton>
            <ToggleButton value="inactive" aria-label="inactive sources">Inactive</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup value={sourcesView} exclusive onChange={handleViewChange}>
            <ToggleButton value="card"><ViewModule /></ToggleButton>
            <ToggleButton value="grid"><ViewList /></ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {sourcesView === 'card' ? (
          <Grid container spacing={3}>
            {sources.map((source) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={source.dsstrc_attr_grp_id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>{source.dsstrc_attr_grp_nm}</Typography>
                    <Tooltip title={source.dsstrc_attr_desc} arrow>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }} noWrap>
                        {source.dsstrc_attr_desc}
                      </Typography>
                    </Tooltip>
                    <Typography variant="body2">Short Name: {source.dsstrc_attr_grp_shrt_nm}</Typography>
                    <Typography variant="body2">Description: {source.dsstrc_attr_grp_shrt_nm}</Typography>
                    <Typography variant="body2">Data Type: {source.dsstrc_attr_grp_desc}</Typography>
                    <Typography variant="body2">Last Updated: {source.updt_ts}</Typography>
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
              rows={sources}
              columns={columns}
              getRowId={(row) => row.dsstrc_attr_grp_id}
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