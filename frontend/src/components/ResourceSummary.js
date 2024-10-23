import React from 'react';
import { Box, Typography, Grid, Divider, Paper, Fade, Slide } from '@mui/material';
import AutoDetectIcon from '@mui/icons-material/AutoFixHigh';
import DefaultIcon from '@mui/icons-material/Settings';
import UserSetIcon from '@mui/icons-material/Person';

const ResourceSummary = ({ resourceData, ingestionSettings, fileInfo }) => {
  const renderSettingState = (setting) => {
    if (setting.userSet) return <UserSetIcon color="primary" />;
    if (setting.autoDetected) return <AutoDetectIcon color="secondary" />;
    return <DefaultIcon />;
  };

  return (
    <Paper elevation={3}>
      <Box p={2}>
        <Typography variant="h6">Resource Summary</Typography>
        <Typography variant="subtitle2">
          {fileInfo.name} ({fileInfo.type})
        </Typography>
        <Typography variant="body2">
          Size: {fileInfo.size} bytes | Created: {fileInfo.lastModified} | Rows: {fileInfo.rowCount}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <Typography variant="subtitle1">Ingestion Settings</Typography>
        <Grid container spacing={2}>
          {Object.entries(ingestionSettings).map(([key, value]) => (
            <Grid item xs={4} key={key}>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" mr={1}>{key}:</Typography>
                <Typography variant="body2" fontWeight="bold">{value.toString()}</Typography>
                {renderSettingState(value)}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider />
      <Box p={2}>
        <Typography variant="subtitle1">Additional Notes</Typography>
        <Typography variant="body2">{resourceData.notes || 'No additional notes.'}</Typography>
      </Box>
    </Paper>
  );
};

export default ResourceSummary;