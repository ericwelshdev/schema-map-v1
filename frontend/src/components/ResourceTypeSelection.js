import React, { useState, useEffect } from 'react';
import { 
  Radio, RadioGroup, FormControlLabel, FormControl, 
  TextField, MenuItem, Typography, Box, 
  Card, CardContent, Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FileText, Database, Globe } from 'lucide-react';

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.spacing(2),
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const ResourceTypeSelection = ({ savedState, onStateChange }) => {
  const [localState, setLocalState] = useState(savedState);

  useEffect(() => {
    const isValid = validateForm();
    onStateChange({ ...localState, isValid });
  }, [localState]);

  const handleInputChange = (field, value) => {
    setLocalState(prevState => ({ ...prevState, [field]: value }));
  };

  const validateForm = () => {
    return !!localState.resourceName && !!localState.resourceType;
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Select Resource Source Type
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth
              label="Source Name" 
              variant="outlined"
              value={localState.resourceName || ''}
              onChange={(e) => handleInputChange('resourceName', e.target.value)}
              placeholder="Enter source name"
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth
              label="Standardized Source Name" 
              variant="outlined"
              value={localState.standardizedSourceName || ''}
              onChange={(e) => handleInputChange('standardizedSourceName', e.target.value)}
              placeholder="Enter standardized source name"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <TextField
                select
                label="Collection"
                value={localState.collection || 'None'}
                onChange={(e) => handleInputChange('collection', e.target.value)}
                variant="outlined"
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Collection1">Collection 1</MenuItem>
                <MenuItem value="Collection2">Collection 2</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Resource Description"
              variant="outlined"
              value={localState.resourceDescription || ''}
              onChange={(e) => handleInputChange('resourceDescription', e.target.value)}
              placeholder="Enter resource description"
            />
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
              <Box display="flex">
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