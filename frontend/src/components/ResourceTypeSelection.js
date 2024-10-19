import React, { useState, useEffect } from 'react';
import { 
  Radio, RadioGroup, FormControlLabel, FormControl, 
  TextField, Select, MenuItem, Typography, Box, 
  Card, CardContent, Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FileText, Database, Globe } from 'lucide-react';

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.spacing(2),
  // transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    // transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const ResourceTypeSelection = ({ savedState, onStateChange }) => {
  const [localState, setLocalState] = useState(savedState);

  useEffect(() => {
    onStateChange(localState);
  }, [localState, onStateChange]);

  const handleInputChange = (field, value) => {
    setLocalState(prevState => ({ ...prevState, [field]: value }));
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Select Resource Source Type
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth
              label="Source Name" 
              variant="outlined"
              value={localState.resourceName || ''}
              onChange={(e) => handleInputChange('resourceName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Select
                label="Collection"
                value={localState.collection || 'None'}
                onChange={(e) => handleInputChange('collection', e.target.value)}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Collection1">Collection 1</MenuItem>
                <MenuItem value="Collection2">Collection 2</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Choose Resource Type:
            </Typography>
            <RadioGroup 
              aria-label="source type" 
              name="sourceType" 
              value={localState.resourceType || ''}
              onChange={(e) => handleInputChange('resourceType', e.target.value)}
            >
              <Box display="flex" justifyContent="space-between">
                <FormControlLabel 
                  value="file" 
                  control={<Radio />} 
                  label={
                    <Box display="flex" alignItems="center">
                      <FileText style={{ marginRight: '8px' }} />
                      File
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="database" 
                  control={<Radio />} 
                  label={
                    <Box display="flex" alignItems="center">
                      <Database style={{ marginRight: '8px' }} />
                      Database Resource
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="api" 
                  control={<Radio />} 
                  label={
                    <Box display="flex" alignItems="center">
                      <Globe style={{ marginRight: '8px' }} />
                      API
                    </Box>
                  } 
                />
              </Box>
            </RadioGroup>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

export default ResourceTypeSelection;