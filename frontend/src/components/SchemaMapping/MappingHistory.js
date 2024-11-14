import React from 'react';
import { 
  Box, Paper, List, ListItem, ListItemText, 
  IconButton, Typography, Tooltip 
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import { styled } from '@mui/material/styles';

const HistoryPanel = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(2),
  top: theme.spacing(8),
  width: 300,
  maxHeight: '60vh',
  overflow: 'auto',
  zIndex: 1000
}));

const MappingHistory = ({ history, onUndoMapping }) => {
  return (
    <HistoryPanel elevation={3}>
      <Box p={2}>
        <Typography variant="h6">Mapping History</Typography>
        <List dense>
          {history.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <Tooltip title="Undo this mapping">
                  <IconButton 
                    edge="end" 
                    size="small"
                    onClick={() => onUndoMapping(item)}
                  >
                    <UndoIcon />
                  </IconButton>
                </Tooltip>
              }
            >
              <ListItemText
                primary={`${item.sourceName} → ${item.targetName}`}
                secondary={`Confidence: ${(item.confidence * 100).toFixed(1)}%`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </HistoryPanel>
  );
};

export default MappingHistory;
