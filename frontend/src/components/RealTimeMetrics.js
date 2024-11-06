
// frontend/src/components/RealTimeMetrics.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const MetricCard = ({ title, value, trend, threshold }) => (
    <Card sx={{ mb: 2 }}>
        <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{title}</Typography>
                <Box display="flex" alignItems="center">
                    <Typography variant="h4" color={value > threshold ? 'success.main' : 'error.main'}>
                        {(value * 100).toFixed(1)}%
                    </Typography>
                    {trend > 0 ? 
                        <TrendingUp color="success" /> : 
                        <TrendingDown color="error" />
                    }
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const RealTimeMetrics = ({ metrics }) => (
    <Box>
        <MetricCard 
            title="Mapping Accuracy"
            value={metrics?.accuracy || 0}
            trend={metrics?.accuracyTrend || 0}
            threshold={0.8}
        />
        <MetricCard 
            title="Confidence Score"
            value={metrics?.confidence || 0}
            trend={metrics?.confidenceTrend || 0}
            threshold={0.7}
        />
        <MetricCard 
            title="Feedback Integration"
            value={metrics?.feedbackRate || 0}
            trend={metrics?.feedbackTrend || 0}
            threshold={0.85}
        />
    </Box>
);

export default RealTimeMetrics;
