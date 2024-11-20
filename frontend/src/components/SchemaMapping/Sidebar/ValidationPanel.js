import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const ValidationRule = ({ rule }) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ListItemIcon sx={{ minWidth: 'auto' }}>
          {rule.passed ? 
            <CheckCircleIcon color="success" /> : 
            <ErrorIcon color="error" />
          }
        </ListItemIcon>
        <Typography>{rule.name}</Typography>
        <Chip 
          size="small"
          label={rule.passed ? 'Passed' : 'Failed'}
          color={rule.passed ? 'success' : 'error'}
        />
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="body2" color="text.secondary">
        {rule.description}
      </Typography>
      {rule.details && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Details:
          </Typography>
          <List dense>
            {rule.details.map((detail, idx) => (
              <ListItem key={idx}>
                <ListItemText 
                  primary={detail.message}
                  secondary={detail.value}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </AccordionDetails>
  </Accordion>
);

const ValidationPanel = () => {
  const [validationResults] = useState({
    progress: 85,
    rules: [
      {
        id: 1,
        name: 'Data Type Compatibility',
        passed: true,
        description: 'Checks if source and target data types are compatible',
        details: [
          { message: 'Source Type', value: 'VARCHAR(50)' },
          { message: 'Target Type', value: 'VARCHAR(100)' }
        ]
      },
      {
        id: 2,
        name: 'Value Range Check',
        passed: false,
        description: 'Validates if values fall within expected range',
        details: [
          { message: 'Expected Range', value: '0-100' },
          { message: 'Found Value', value: '150' }
        ]
      }
    ]
  });

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Validation Results
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Overall Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {validationResults.progress}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={validationResults.progress}
          sx={{ height: 8, borderRadius: 1 }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {validationResults.rules.map(rule => (
          <ValidationRule key={rule.id} rule={rule} />
        ))}
      </Box>
    </Box>
  );
};

export default ValidationPanel;
