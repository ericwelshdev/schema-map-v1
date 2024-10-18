import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

const ResourceMappingTagging = ({ schema, dataDictionary }) => {
  return (
    <Box>
      <Typography variant="h6">Mapping & Tagging</Typography>
      {schema && schema.map((field, index) => (
        <Box key={index} sx={{ marginBottom: '10px' }}>
          <Typography variant="subtitle1">{field.name}</Typography>
          <TextField
            label="Tag"
            variant="outlined"
            size="small"
            fullWidth
          />
        </Box>
      ))}
    </Box>
  );
};

export default ResourceMappingTagging;
