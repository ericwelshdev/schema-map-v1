import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  Chip, 
  LinearProgress 
} from '@mui/material';

const TransformationPanel = () => {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      type: 'Case Transformation',
      confidence: 0.95,
      description: 'Convert to uppercase',
      preview: 'JOHN DOE → JOHN DOE',
      applied: false
    },
    {
      id: 2,
      type: 'Date Format',
      confidence: 0.88,
      description: 'Convert to ISO format',
      preview: '01/01/2023 → 2023-01-01',
      applied: true
    }
  ]);

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Suggested Transformations
      </Typography>
      <List>
        {suggestions.map(suggestion => (
          <ListItem 
            key={suggestion.id}
            sx={{ 
              bgcolor: suggestion.applied ? 'action.selected' : 'background.paper',
              borderRadius: 1,
              mb: 1
            }}
          >
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  {suggestion.type}
                  <Chip 
                    label={`${(suggestion.confidence * 100).toFixed(0)}%`}
                    size="small"
                    color={suggestion.confidence > 0.9 ? 'success' : 'warning'}
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2">{suggestion.description}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Preview: {suggestion.preview}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TransformationPanel;
