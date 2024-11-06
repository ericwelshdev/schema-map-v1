
// frontend/src/components/MetricsVisualization.js
import React from 'react';
import { Box, Grid } from '@mui/material';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';
import MetricsCard from './MetricsCard';

const MetricsVisualization = ({ metrics, trends }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics.history}>
                        <Line 
                            type="monotone" 
                            dataKey="accuracy" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="confidence" 
                            stroke="#82ca9d" 
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Grid>
            <Grid item xs={4}>
                <MetricsCard 
                    title="Accuracy"
                    value={metrics.current.accuracy}
                    trend={trends.accuracy_trend}
                    color="#8884d8"
                />
            </Grid>
            <Grid item xs={4}>
                <MetricsCard 
                    title="Confidence"
                    value={metrics.current.confidence}
                    trend={trends.confidence_trend}
                    color="#82ca9d"
                />
            </Grid>
            <Grid item xs={4}>
                <MetricsCard 
                    title="Feedback Rate"
                    value={metrics.current.feedback_rate}
                    trend={trends.feedback_trend}
                    color="#ffc658"
                />
            </Grid>
        </Grid>
    );
};

export default MetricsVisualization;
