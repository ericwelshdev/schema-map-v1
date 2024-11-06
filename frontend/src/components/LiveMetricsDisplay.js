
// frontend/src/components/LiveMetricsDisplay.js
import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useMetricsSocket } from '../hooks/useMetricsSocket';
import MetricsVisualization from './MetricsVisualization';

const LiveMetricsDisplay = () => {
    const metricsData = useMetricsSocket();

    if (!metricsData.current) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <MetricsVisualization 
                metrics={metricsData}
                trends={metricsData.trends}
            />
        </Box>
    );
};

export default LiveMetricsDisplay;
