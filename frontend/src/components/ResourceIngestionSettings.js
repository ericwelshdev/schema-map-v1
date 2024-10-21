import React, { useState, useEffect } from 'react';
import { Grid, Box, Button, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

const SmallTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontSize: '0.75rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
  },
});

const ResourceIngestionSettings = ({ ingestionConfig, onConfigChange, onApplyChanges }) => {
  const [localConfig, setLocalConfig] = useState(ingestionConfig.ingestionAppliedProperties || {});

  useEffect(() => {
    setLocalConfig(ingestionConfig.ingestionAppliedProperties || {});
  }, [ingestionConfig]);

  const handleSettingChange = (field, value) => {
    setLocalConfig(prevConfig => ({
      ...prevConfig,
      [field]: value
    }));
  };

  const handleApplyChanges = () => {
    const updatedConfig = {
      ...ingestionConfig,
      ingestionAppliedProperties: localConfig
    };
    onConfigChange(updatedConfig);
    onApplyChanges(updatedConfig);
    console.log('Updated Config:', updatedConfig);
  };

  const renderField = (key, fieldConfig) => {
    const value = localConfig[fieldConfig.callArgField] ?? fieldConfig.default;

    switch (fieldConfig.uiType) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => handleSettingChange(fieldConfig.callArgField, e.target.checked)}
                size="small"
              />
            }
            label={fieldConfig.uiDisplayName}
          />
        );
      case 'select':
        return (
          <SmallTextField
            select
            fullWidth
            size="small"
            label={fieldConfig.uiDisplayName}
            value={value}
            onChange={(e) => handleSettingChange(fieldConfig.callArgField, e.target.value)}
          >
            {fieldConfig.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </SmallTextField>
        );
      case 'number':
        return (
          <SmallTextField
            fullWidth
            size="small"
            type="number"
            label={fieldConfig.uiDisplayName}
            value={value}
            onChange={(e) => handleSettingChange(fieldConfig.callArgField, parseFloat(e.target.value))}
          />
        );
      default:
        return (
          <SmallTextField
            fullWidth
            size="small"
            label={fieldConfig.uiDisplayName}
            value={value}
            onChange={(e) => handleSettingChange(fieldConfig.callArgField, e.target.value)}
          />
        );
    }
  };

  return (
    <Box>
      <Grid container spacing={1}>
        {Object.entries(ingestionConfig.ingestionConfig || {}).map(([key, fieldConfig]) => (
          <Grid item xs={4} key={key}>
            {renderField(key, fieldConfig)}
          </Grid>
        ))}
      </Grid>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleApplyChanges} 
        sx={{ mt: 2 }}
      >
        Apply Changes
      </Button>
    </Box>
  );
};

export default ResourceIngestionSettings;