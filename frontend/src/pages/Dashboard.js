// frontend/src/components/pages/Dashboard.js

import React from 'react';
import { Typography, Container, Box, Grid, Paper, Button, Breadcrumbs, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const metrics = [
    { title: 'Projects', value: 15 },
    { title: 'Sources', value: 50 },
    { title: 'Targets', value: 30 },
    { title: 'Assigned Sources', value: 40 },
    { title: 'Mappings', value: 100 },
    { title: 'Data Profiles', value: 75 },
  ];

  const taskData = {
    labels: ['Running', 'Completed', 'Errored'],
    datasets: [
      {
        data: [12, 80, 8],
        backgroundColor: ['#36A2EB', '#4CAF50', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#4CAF50', '#FF6384'],
      },
    ],
  };

  const recentProjects = [
    { id: 1, name: 'Project A', description: 'Description A', sourceCount: 5, mappingCount: 10, viewCount: 100, lastOpened: '2023-05-01', updated: '2023-05-05' },
    { id: 2, name: 'Project B', description: 'Description B', sourceCount: 3, mappingCount: 7, viewCount: 75, lastOpened: '2023-05-02', updated: '2023-05-06' },
    { id: 3, name: 'Project C', description: 'Description C', sourceCount: 8, mappingCount: 15, viewCount: 150, lastOpened: '2023-05-03', updated: '2023-05-07' },
  ];

  const columns = [
    { field: 'name', headerName: 'Project Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'sourceCount', headerName: 'Source Count', width: 120 },
    { field: 'mappingCount', headerName: 'Mapping Count', width: 140 },
    { field: 'viewCount', headerName: 'View Count', width: 120 },
    { field: 'lastOpened', headerName: 'Last Opened', width: 150 },
    { field: 'updated', headerName: 'Updated', width: 150 },
  ];

  return (
    <Container>
      <Box mt={3} mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
          <Typography color="textPrimary">Dashboard</Typography>
        </Breadcrumbs>
      </Box>
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.title}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6">{metric.title}</Typography>
              <Typography variant="h4">{metric.value}</Typography>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Tasks</Typography>
            <Box sx={{ width: '100%', height: 200 }}>
              <Doughnut data={taskData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={4} mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Recent Projects</Typography>
        <Button sx={{}} variant="outlined" color="primary" href="/projects">
          Show All
        </Button>
      </Box>
      <DataGrid
        rows={recentProjects}
        columns={columns}
        pageSize={5}
        autoHeight
        disableSelectionOnClick
      />
    </Container>
  );
};

export default Dashboard;
