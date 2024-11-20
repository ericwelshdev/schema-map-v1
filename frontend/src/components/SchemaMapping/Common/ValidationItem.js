import React from 'react';
import { 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Tooltip, 
  Box, 
  LinearProgress 
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const ValidationItem = ({ validation }) => {
  const getIcon = () => {
    switch (validation.status) {
      case 'success': return <CheckCircleIcon color="success" />;
      case 'error': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      default: return null;
    }
  };

  return (
    <ListItem>
      <ListItemIcon>
        <Tooltip title={validation.status}>
          {getIcon()}
        </Tooltip>
      </ListItemIcon>
      <ListItemText
        primary={validation.message}
        secondary={
          <Box sx={{ width: '100%', mt: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={validation.score} 
              color={validation.status}
            />
          </Box>
        }
      />
    </ListItem>
  );
};

export default ValidationItem;
