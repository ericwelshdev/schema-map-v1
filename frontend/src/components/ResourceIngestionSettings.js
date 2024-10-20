import React from 'react';
import { Grid, Box, Button, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { processFile } from '../utils/fileUtils';

const SmallTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontSize: '0.75rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
  },
});

const ResourceIngestionSettings = ({ ingestionConfig, onConfigChange }) => {
  const handleSettingChange = (field, value) => {
    onConfigChange({
      ingestionAppliedProperties: {
        ...ingestionConfig.ingestionAppliedProperties,
        [field]: value
      }
    });
  };

  const handleApplyChanges = async () => {
    const updatedSettings = {
      ...ingestionConfig.ingestionSettings,
      ...ingestionConfig.ingestionAppliedProperties
    };

    try {
      const result = await processFile(ingestionConfig.fileInfo.file, updatedSettings, false);
      onConfigChange(result);
    } catch (error) {
      onConfigChange({
        uploadStatus: { type: 'error', message: `Error applying changes: ${error.message}` }
      });
    }
  };

  const renderField = (key, fieldConfig) => {
    switch (fieldConfig.uiType) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!ingestionConfig.ingestionAppliedProperties[fieldConfig.uiField]}
                onChange={(e) => handleSettingChange(fieldConfig.uiField, e.target.checked)}
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
            value={ingestionConfig.ingestionAppliedProperties[fieldConfig.uiField] ?? fieldConfig.default}
            onChange={(e) => handleSettingChange(fieldConfig.uiField, e.target.value)}
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
            value={ingestionConfig.ingestionAppliedProperties[fieldConfig.uiField] ?? fieldConfig.default}
            onChange={(e) => handleSettingChange(fieldConfig.uiField, parseFloat(e.target.value))}
          />
        );
      default:
        return (
          <SmallTextField
            fullWidth
            size="small"
            label={fieldConfig.uiDisplayName}
            value={ingestionConfig.ingestionAppliedProperties[fieldConfig.uiField] ?? fieldConfig.default}
            onChange={(e) => handleSettingChange(fieldConfig.uiField, e.target.value)}
          />
        );
    }
  };

  return (
    <Box>
      <Grid container spacing={1}>
        {ingestionConfig.ingestionConfig && Object.entries(ingestionConfig.ingestionConfig)
          .sort((a, b) => a[1].order - b[1].order)
          .map(([key, fieldConfig]) => (
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