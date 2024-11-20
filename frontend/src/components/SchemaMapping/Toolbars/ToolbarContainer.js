import React from 'react';
import { Box, Paper } from '@mui/material';
import SearchBar from './SearchBar';
import FilterToolbar from './FilterToolbar';
import BatchOperationsPanel from './BatchOperationsPanel';

const ToolbarContainer = ({ onSearch, onFilter, onBatchOperation }) => {
  return (
    <Paper sx={{ p: 1, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
      <SearchBar onSearch={onSearch} />
      <FilterToolbar onFilter={onFilter} />
      <Box sx={{ ml: 'auto' }}>
        <BatchOperationsPanel onOperation={onBatchOperation} />
      </Box>
    </Paper>
  );
};

export default ToolbarContainer;
