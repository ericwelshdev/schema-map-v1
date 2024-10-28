import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Box,
  Radio
} from '@mui/material';

const ResourceDataDictionaryTableMappingCandidateDialog = ({ 
  open, 
  onClose, 
  tables = [], 
  onSelect 
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Target Table</DialogTitle>
      <DialogContent>
        <List>
          {tables.map((table) => (
            <ListItem 
              key={table.tableName} 
              button 
              onClick={() => onSelect(table.tableName)}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <Radio
                checked={false}
                onChange={() => onSelect(table.tableName)}
                onClick={(e) => e.stopPropagation()}
              />
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1">{table.tableName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Match Quality: {table.matchedColumnsConfidence.toFixed(1)}%
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                    <Typography variant="body2">
                      Table Similarity: {table.tableNameSimilarity.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2">
                      Columns Matched: {table.matchedColumns}/{table.matchedColumns + table.unmatchedColumns}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Typography 
                  variant="h6" 
                  color={table.confidenceScore >= 60 ? 'success.main' : 'error.main'}
                >
                  {table.confidenceScore.toFixed(1)}%
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDataDictionaryTableMappingCandidateDialog;
