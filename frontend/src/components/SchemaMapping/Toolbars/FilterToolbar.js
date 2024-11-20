import React from 'react';
import { 
  Box, 
  Chip, 
  IconButton, 
  Tooltip,
  Menu,
  MenuItem,
  Slider,
  Typography 
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';

const FilterToolbar = ({ onFilter }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeFilters, setActiveFilters] = React.useState({
    confidence: [0, 100],
    status: [],
    type: []
  });

  const handleFilterChange = (type, value) => {
    const newFilters = { ...activeFilters, [type]: value };
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title="Filter options">
        <IconButton 
          size="small" 
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <FilterListIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {Object.entries(activeFilters).map(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          return (
            <Chip
              key={key}
              size="small"
              label={`${key}: ${value.join('-')}`}
              onDelete={() => handleFilterChange(key, [])}
            />
          );
        }
        return null;
      })}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>
          <Box sx={{ width: 200 }}>
            <Typography variant="caption">Confidence Range</Typography>
            <Slider
              size="small"
              value={activeFilters.confidence}
              onChange={(_, value) => handleFilterChange('confidence', value)}
              valueLabelDisplay="auto"
            />
          </Box>
        </MenuItem>
      </Menu>

      {Object.values(activeFilters).some(v => 
        Array.isArray(v) ? v.length > 0 : v
      ) && (
        <Tooltip title="Clear all filters">
          <IconButton 
            size="small" 
            onClick={() => {
              setActiveFilters({
                confidence: [0, 100],
                status: [],
                type: []
              });
              onFilter(null);
            }}
          >
            <FilterListOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default FilterToolbar;
