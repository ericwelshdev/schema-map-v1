
// frontend/src/contexts/MetricsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const MetricsContext = createContext();

export const MetricsProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/metrics');
        
        ws.onopen = () => {
            console.log('WebSocket Connected');
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'metrics') {
                setMetrics(data.payload);
            } else if (data.type === 'alert') {
                setAlerts(prev => [...prev, data.payload]);
            }
        };

        return () => {
            if (ws) ws.close();
        };
    }, []);

    return (
        <MetricsContext.Provider value={{ metrics, alerts, socket }}>
            {children}
        </MetricsContext.Provider>
    );
};
