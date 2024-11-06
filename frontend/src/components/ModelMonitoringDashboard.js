
// frontend/src/components/ModelMonitoringDashboard.js
import React, { useState, useEffect } from 'react';
import { 
    Box, Grid, Alert, Card, CardContent, 
    Typography, CircularProgress, Snackbar 
} from '@mui/material';
import { ModelPerformanceMonitor } from './ModelPerformanceMonitor';
import { RealTimeMetrics } from './RealTimeMetrics';
import { PerformanceAlerts } from './PerformanceAlerts';

const ModelMonitoringDashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [metrics, setMetrics] = useState(null);
    
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/metrics');
        
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'metrics_update') {
                setMetrics(data.metrics);
            } else if (data.type === 'alert') {
                setAlerts(prev => [...prev, data.alert]);
            }
        };

        return () => socket.close();
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <PerformanceAlerts alerts={alerts} />
            </Grid>
            <Grid item xs={8}>
                <ModelPerformanceMonitor metrics={metrics} />
            </Grid>
            <Grid item xs={4}>
                <RealTimeMetrics metrics={metrics} />
            </Grid>
        </Grid>
    );
};

export default ModelMonitoringDashboard;
