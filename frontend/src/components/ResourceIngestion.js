import React from 'react';
import { Box } from '@mui/material';
import ResourceFileUpload from './ResourceFileIngestionSetup';

const ReourceIngestion = ({ ingestionConfig, onConfigChange }) => {
  const renderSourceInput = () => {
    switch (ingestionConfig.sourceType) {
      case 'file':
        return <ResourceFileUpload ingestionConfig={ingestionConfig} onConfigChange={onConfigChange} />;
      // Add cases for database and API here
      default:
        return null;
    }
  };

  return (
    <Box>
      {renderSourceInput()}
    </Box>
  );
};

export default ReourceIngestion;