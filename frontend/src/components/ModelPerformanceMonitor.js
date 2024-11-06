
// frontend/src/components/ModelPerformanceMonitor.js
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ModelPerformanceMonitor = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [trends, setTrends] = useState(null);

    useEffect(() => {
        const fetchPerformanceData = async () => {
            const response = await axios.get(`${API_URL}/ai/performance-metrics`);
            setPerformanceData(response.data.metrics_history);
            setTrends(response.data.trends);
        };

        fetchPerformanceData();
        const interval = setInterval(fetchPerformanceData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box>
            <Card>
                <CardContent>
                    <Typography variant="h6">Model Performance Trends</Typography>
                    <LineChart width={600} height={300} data={performanceData}>
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="accuracy" stroke="#8884d8" />
                        <Line type="monotone" dataKey="confidence" stroke="#82ca9d" />
                    </LineChart>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ModelPerformanceMonitor;
