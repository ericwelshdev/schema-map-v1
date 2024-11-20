import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const ValidationCategories = ({ validationResults }) => {
  return (
    <List>
      {validationResults?.categories?.map((category, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            {category.status === 'success' && <CheckCircleIcon color="success" />}
            {category.status === 'error' && <ErrorIcon color="error" />}
            {category.status === 'warning' && <WarningIcon color="warning" />}
          </ListItemIcon>
          <ListItemText
            primary={category.name}
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={category.score}
                  sx={{ flex: 1, mr: 2 }}
                  color={category.status}
                />
                <Typography variant="caption">
                  {category.score}%
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

const ValidationResultsDialog = ({ open, onClose, validationResults }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Validation Results</Typography>
          <Chip 
            label={`${validationResults?.score}% Valid`}
            color={validationResults?.score > 80 ? 'success' : 'warning'}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <ValidationCategories validationResults={validationResults} />
      </DialogContent>
    </Dialog>
  );
};

export default ValidationResultsDialog;