import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const ComparisonView = ({ sourceData, targetData }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <DataPreview 
          title="Source Data"
          data={sourceData}
        />
      </Grid>
      <Grid item xs={6}>
        <DataPreview 
          title="Target Data"
          data={targetData}
        />
      </Grid>
    </Grid>
  );
};

const DataPreview = ({ title, data }) => {
  const columns = Object.keys(data[0] || {}).map(key => ({
    field: key,
    headerName: key,
    flex: 1,
    renderCell: (params) => (
      <Typography variant="body2">
        {params.value}
      </Typography>
    )
  }));

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <DataGrid
        rows={data}
        columns={columns}
        density="compact"
        hideFooter
        autoHeight
        disableSelectionOnClick
      />
    </Paper>
  );
};

export default ComparisonView;
