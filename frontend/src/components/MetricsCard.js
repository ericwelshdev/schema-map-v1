
// frontend/src/components/MetricsCard.js
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const MetricsCard = ({ title, value, trend, color, history }) => {
    const trendIcon = trend >= 0 ? 
        <TrendingUp style={{ color: 'green' }} /> : 
        <TrendingDown style={{ color: 'red' }} />;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h4" style={{ color }}>
                        {(value * 100).toFixed(1)}%
                    </Typography>
                    {trendIcon}
                </Box>
                <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={history}>
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke={color} 
                            fill={color} 
                            fillOpacity={0.2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default MetricsCard;
