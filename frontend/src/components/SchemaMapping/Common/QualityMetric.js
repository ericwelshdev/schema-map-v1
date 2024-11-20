import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const QualityMetric = ({ label, value, maxValue = 100, color = 'primary' }) => {
  const normalizedValue = (value / maxValue) * 100;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={normalizedValue}
        color={color}
        size={60}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(normalizedValue)}%`}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: -20,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default QualityMetric;
