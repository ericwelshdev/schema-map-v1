import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const ResourceSummary = ({ sourceData }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Summary
        </Typography>
        <Grid container spacing={2}>
          {/* Display summary information */}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ResourceSummary;
