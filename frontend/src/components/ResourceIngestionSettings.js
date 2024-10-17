import React from 'react';
import { Grid, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { ingestionConfig } from '../utils/ingestionConfig';

const ResourceIngestionSettings = ({ resourceData, ingestionSettings, onSettingChange }) => {
  const getConfigForResourceType = () => {
    if (resourceData.resourceType === 'file') {
      return ingestionConfig.file[resourceData.fileType] || {};
    }
    return ingestionConfig[resourceData.resourceType] || {};
  };

  const renderField = (key, config) => {
    switch (config.uiType) {
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={ingestionSettings[config.uiField] ?? config.default}
                onChange={(e) => onSettingChange(config.uiField, e.target.checked)}
              />
            }
            label={config.uiDisplayName}
          />
        );
      case 'select':
        return (
          <TextField
            select
            fullWidth
            label={config.uiDisplayName}
            value={ingestionSettings[config.uiField] ?? config.default}
            onChange={(e) => onSettingChange(config.uiField, e.target.value)}
          >
            {config.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      default:
        return (
          <TextField
            fullWidth
            label={config.uiDisplayName}
            value={ingestionSettings[config.uiField] ?? config.default}
            onChange={(e) => onSettingChange(config.uiField, e.target.value)}
          />
        );
    }
  };

  const config = getConfigForResourceType();
  const sortedConfig = Object.entries(config).sort((a, b) => a[1].order - b[1].order);

  return (
    <Grid container spacing={2}>
      {sortedConfig.map(([key, fieldConfig]) => (
        <Grid item xs={6} key={key}>
          {renderField(key, fieldConfig)}
        </Grid>
      ))}
    </Grid>
  );
};

export default ResourceIngestionSettings;
