import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const CanvasContainer = styled(Box)(({ theme }) => ({
  flex: 2,
  position: 'relative',
  margin: theme.spacing(0, 2),
  backgroundColor: theme.palette.background.default
}));

const MappingCanvas = ({ mappings, sourceSchema, targetSchema }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    if (!ctx.current) return;
    
    const drawMappings = () => {
      const canvas = canvasRef.current;
      ctx.current.clearRect(0, 0, canvas.width, canvas.height);
      
      mappings.forEach(([sourceId, targetId]) => {
        const sourceElement = document.querySelector(`[data-id="${sourceId}"]`);
        const targetElement = document.querySelector(`[data-id="${targetId}"]`);
        
        if (sourceElement && targetElement) {
          const sourceRect = sourceElement.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();
          
          ctx.current.beginPath();
          ctx.current.moveTo(
            0,
            sourceRect.top + sourceRect.height/2 - canvasRect.top
          );
          ctx.current.bezierCurveTo(
            canvas.width/2, sourceRect.top + sourceRect.height/2 - canvasRect.top,
            canvas.width/2, targetRect.top + targetRect.height/2 - canvasRect.top,
            canvas.width, targetRect.top + targetRect.height/2 - canvasRect.top
          );
          ctx.current.strokeStyle = '#2196f3';
          ctx.current.lineWidth = 2;
          ctx.current.stroke();
        }
      });
    };
    
    drawMappings();
    window.addEventListener('scroll', drawMappings);
    
    return () => window.removeEventListener('scroll', drawMappings);
  }, [mappings]);

  return (
    <CanvasContainer>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </CanvasContainer>
  );
};

export default MappingCanvas;
