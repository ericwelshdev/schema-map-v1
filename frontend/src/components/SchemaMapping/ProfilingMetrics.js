import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const ProfilingMetrics = ({ metrics }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <MetricCard>
          <Typography variant="subtitle2" color="textSecondary">
            Row Count
          </Typography>
          <Typography variant="h6">
            {metrics.rowCount?.toLocaleString()}
          </Typography>
        </MetricCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <MetricCard>
          <Typography variant="subtitle2" color="textSecondary">
            Distinct Values
          </Typography>
          <Typography variant="h6">
            {metrics.distinctCount?.toLocaleString()}
          </Typography>
        </MetricCard>
      </Grid>
      {/* Add more metric cards as needed */}
    </Grid>
  );
};

export default ProfilingMetrics;
