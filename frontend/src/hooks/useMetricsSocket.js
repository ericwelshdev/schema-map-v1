

// frontend/src/hooks/useMetricsSocket.js
import { useState, useEffect } from 'react';

export const useMetricsSocket = () => {
    const [metricsData, setMetricsData] = useState({
        current: {},
        history: [],
        trends: {}
    });

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/metrics');
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMetricsData(prevData => ({
                current: data.current,
                history: [...prevData.history, data.current].slice(-100),
                trends: data.trends
            }));
        };

        return () => ws.close();
    }, []);

    return metricsData;
};
