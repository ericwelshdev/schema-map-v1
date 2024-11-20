import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <TextField
      size="small"
      placeholder="Search columns..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: searchTerm && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
        sx: { fontSize: '0.875rem' }
      }}
      sx={{ width: 250 }}
    />
  );
};

export default SearchBar;
