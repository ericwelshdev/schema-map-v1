import React from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const HistoricalMappings = () => {
  const patterns = [
    {
      id: 1,
      sourceName: 'customer_id',
      targetName: 'Physical Column Name',
      frequency: 85,
      lastUsed: '2023-10-15',
      projects: ['Project A', 'Project B']
    },
    {
      id: 2,
      sourceName: 'transaction_date',
      targetName: 'Date Format',
      frequency: 72,
      lastUsed: '2023-10-14',
      projects: ['Project C']
    }
  ];

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Historical Mapping Patterns
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Source Pattern</TableCell>
              <TableCell>Target Pattern</TableCell>
              <TableCell align="right">Usage</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patterns.map(pattern => (
              <TableRow key={pattern.id}>
                <TableCell sx={{ fontSize: '0.875rem' }}>{pattern.sourceName}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{pattern.targetName}</TableCell>
                <TableCell align="right">
                  <Tooltip title={`Used in ${pattern.projects.length} projects`}>
                    <Chip 
                      label={`${pattern.frequency}%`}
                      size="small"
                      color="primary"
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <AutoFixHighIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HistoricalMappings;
