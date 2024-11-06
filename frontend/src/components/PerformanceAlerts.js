
// frontend/src/components/PerformanceAlerts.js
import React from 'react';
import { Alert, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const PerformanceAlerts = ({ alerts, onDismiss }) => (
    <Box>
        {alerts.map((alert, index) => (
            <Alert
                key={alert.id}
                severity={alert.severity}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => onDismiss(alert.id)}
                    >
                        <Close fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 1 }}
            >
                {alert.message}
            </Alert>
        ))}
    </Box>
);

export default PerformanceAlerts;
