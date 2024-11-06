
// frontend/src/components/MetricsUpdater.js
import React, { useEffect, useCallback } from 'react';
import { useMetricsSocket } from '../hooks/useMetricsSocket';

const MetricsUpdater = ({ onMetricsUpdate }) => {
    const metricsData = useMetricsSocket();

    const handleMetricsUpdate = useCallback((data) => {
        onMetricsUpdate(data);
    }, [onMetricsUpdate]);

    useEffect(() => {
        handleMetricsUpdate(metricsData);
    }, [metricsData, handleMetricsUpdate]);

    return null;
};

export default MetricsUpdater;
