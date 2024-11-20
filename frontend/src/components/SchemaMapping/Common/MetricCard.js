import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

const MetricCard = ({ title, value, icon, trend, loading = false }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {icon}
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Typography variant="h6">{value}</Typography>
        )}
      </Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      {trend && (
        <Typography 
          variant="caption" 
          color={trend > 0 ? 'success.main' : 'error.main'}
        >
          {trend > 0 ? '+' : ''}{trend}% from previous
        </Typography>
      )}
    </Paper>
  );
};

export default MetricCard;
