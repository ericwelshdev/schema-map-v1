import React from 'react';
import { Box } from '@mui/material';
import Xarrow from 'react-xarrows';

const MappingCanvas = ({ layout = { nodes: [], edges: [] }, onMappingUpdate }) => {
  return (
    <Box sx={{ position: 'relative', height: '100%', minHeight: 400 }}>
      {layout.nodes?.map(node => (
        <Box
          key={node.id}
          sx={{
            position: 'absolute',
            left: node.position.x,
            top: node.position.y,
            padding: 1,
            border: '1px solid',
            borderRadius: 1,
            cursor: 'pointer'
          }}
          onClick={() => onMappingUpdate?.(node.id)}
        >
          {node.data.label}
        </Box>
      ))}
      
      {layout.edges?.map(edge => (
        <Xarrow
          key={edge.id}
          start={edge.source}
          end={edge.target}
          strokeWidth={2}
          {...edge.style}
        />
      ))}
    </Box>
  );
};

export default MappingCanvas;