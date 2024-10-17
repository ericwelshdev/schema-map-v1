import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField, Select, MenuItem } from '@mui/material';

const ResourceTypeSelection = ({ onComplete, setResourceData }) => {
  const handleSourceTypeChange = (event) => {
    setResourceData(prevData => ({ ...prevData, resourceType: event.target.value }));
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Select Resource Source Type</FormLabel>
      <TextField label="Source Name" onChange={(e) => setResourceData(prevData => ({ ...prevData, resourceName: e.target.value }))} />
      <Select
        label="Collection"
        defaultValue="None"
        onChange={(e) => setResourceData(prevData => ({ ...prevData, collection: e.target.value }))}
      >
        <MenuItem value="None">None</MenuItem>
        {/* Add other collection options here */}
      </Select>
      <RadioGroup aria-label="source type" name="sourceType" onChange={handleSourceTypeChange}>
        <FormControlLabel value="file" control={<Radio />} label="File" />
        <FormControlLabel value="database" control={<Radio />} label="Database Resource" />
        <FormControlLabel value="api" control={<Radio />} label="API" />
      </RadioGroup>
    </FormControl>
  );
};

export default ResourceTypeSelection;
