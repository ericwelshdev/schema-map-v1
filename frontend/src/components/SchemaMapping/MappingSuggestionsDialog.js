import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, TextField, Box, 
  List, ListItem, ListItemText, Chip, Typography, IconButton 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const ConfidenceChip = styled(Chip)(({ theme, confidence }) => ({
  backgroundColor: confidence > 0.8 
    ? theme.palette.success.light 
    : confidence > 0.6 
      ? theme.palette.warning.light 
      : theme.palette.error.light
}));

const MappingSuggestionsDialog = ({ 
  open, 
  onClose, 
  suggestions, 
  sourceItem, 
  onSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuggestions = suggestions.filter(suggestion => 
    suggestion.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    suggestion.classification_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topSuggestions = filteredSuggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  const otherSuggestions = filteredSuggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(5);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Mapping Suggestions for: {sourceItem?.name}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box mb={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search suggestions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
          />
        </Box>

        <Typography variant="subtitle1" color="primary" gutterBottom>
          Top Suggestions
        </Typography>
        <List>
          {topSuggestions.map((suggestion) => (
            <ListItem 
              key={suggestion.value}
              button
              onClick={() => onSelect(suggestion)}
              sx={{ 
                bgcolor: 'primary.light',
                mb: 1,
                borderRadius: 1
              }}
            >
              <ListItemText
                primary={suggestion.label}
                secondary={suggestion.classification_description}
              />
              <ConfidenceChip
                label={`${(suggestion.confidence * 100).toFixed(1)}%`}
                confidence={suggestion.confidence}
                size="small"
              />
            </ListItem>
          ))}
        </List>

        {otherSuggestions.length > 0 && (
          <>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Other Matches
            </Typography>
            <List>
              {otherSuggestions.map((suggestion) => (
                <ListItem 
                  key={suggestion.value}
                  button
                  onClick={() => onSelect(suggestion)}
                >
                  <ListItemText
                    primary={suggestion.label}
                    secondary={suggestion.classification_description}
                  />
                  <ConfidenceChip
                    label={`${(suggestion.confidence * 100).toFixed(1)}%`}
                    confidence={suggestion.confidence}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MappingSuggestionsDialog;
