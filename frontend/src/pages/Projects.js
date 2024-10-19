// frontend/src/components/pages/Projects.js
import React, { useState, useEffect, useMemo } from 'react';
import { getProjects, deleteProject } from '../services/projectService';
import { 
  Typography, Box, Breadcrumbs, Link, ToggleButtonGroup, ToggleButton,
  Card, CardContent, CardActions, IconButton, Grid, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Switch, FormControlLabel, List, ListItem,
  Tooltip, Container
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ViewModule, ViewList, Edit, FileCopy, Share, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useView } from '../contexts/ViewContext';

const Projects = () => {
  const { projectsView, setProjectsView } = useView();
  const [filter, setFilter] = useState('created');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteAllDependents, setDeleteAllDependents] = useState(true);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects in Projects component');
      const data = await getProjects();
      console.log('Projects received in Projects component:', data);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setProjectsView(newView);
    }
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleProjectClick = (project) => {
    navigate('/workspace', { state: { project } });
  };

  const handleEditClick = (project) => {
      navigate('/workspace', { state: { project } });
  };
  const handleDeleteClick = (project) => {
    setSelectedProject(project);
      setDeleteDialogOpen(true);
    };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(selectedProject.proj_id);
      setDeleteDialogOpen(false);
      fetchProjects(); // Refresh the project list
    } catch (error) {
      console.error('Error deleting project:', error);
      // Handle error (e.g., show error message to user)
    }
  };

    const columns = [
      { field: 'proj_nm', headerName: 'Project Name', flex: 1 },
      { field: 'proj_desc', headerName: 'Description', flex: 1 },
      { field: 'sourceCount', headerName: 'Source Count', flex: 1 },
      { field: 'mappingCount', headerName: 'Mapping Count', flex: 1 },
      { field: 'dataDictionaryCount', headerName: 'Data Dictionary Count', flex: 1 },
      { field: 'viewCount', headerName: 'View Count', flex: 1 },
      { field: 'lastOpened', headerName: 'Last Opened', flex: 1 },
      { field: 'updated', headerName: 'Updated', flex: 1 },
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

    const DeleteDialog = ({ open, onClose, project }) => {
      const dependentItems = useMemo(() => [
        'Sources', 'Mappings', 'Data Profiles', 'Data Dictionaries'
      ], []);

      return (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this project? This action cannot be undone.</Typography>
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
              <Typography color="textPrimary">Projects</Typography>
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
              <ToggleButton value="created" aria-label="created by me">Created by me</ToggleButton>
              <ToggleButton value="shared" aria-label="shared with me">Shared with me</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup value={projectsView} exclusive onChange={handleViewChange}>
              <ToggleButton value="card"><ViewModule /></ToggleButton>
              <ToggleButton value="grid"><ViewList /></ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {projectsView === 'card' ? (
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={project.proj_id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>{project.proj_nm}</Typography>
                      <Tooltip title={project.description} arrow>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }} noWrap>
                          {project.proj_desc}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2">Sources: {project.sourceCount}</Typography>
                      <Typography variant="body2">Mappings: {project.mappingCount}</Typography>
                      <Typography variant="body2">Data Dictionaries: {project.dataDictionaryCount}</Typography>
                      <Typography variant="body2">Views: {project.viewCount}</Typography>
                      <Typography variant="body2">Last Viewed: {project.lastOpened}</Typography>
                      <Typography variant="body2">Updated: {project.updated}</Typography>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <IconButton onClick={() => handleEditClick(project)}><Edit /></IconButton>
                      <IconButton><FileCopy /></IconButton>
                      <IconButton><Share /></IconButton>
                      <IconButton onClick={() => handleDeleteClick(project)}><Delete /></IconButton>
                    </CardActions>
                  </Card>
                </Grid>              
              ))}
            </Grid>
          ) : (
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid 
                                rows={projects}
                                columns={columns}
                                getRowId={(row) => row.proj_id}
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
            project={selectedProject} 
          />
        </Box>
      </Container>
    );
  };
export default Projects;
