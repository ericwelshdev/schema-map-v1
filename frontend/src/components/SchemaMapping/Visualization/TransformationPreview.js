import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Chip
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const TransformationPreview = ({ transformations, data }) => {
  return (
    <Paper sx={{ p: 2, overflow: 'auto' }}>
      <Typography variant="subtitle1" gutterBottom>
        Transformation Preview
      </Typography>
      
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Original Value</TableCell>
            <TableCell align="center">Transformations</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography variant="body2">{item.original}</Typography>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {transformations.map((transform, idx) => (
                    <React.Fragment key={idx}>
                      <Chip 
                        label={transform.name} 
                        size="small" 
                        variant="outlined"
                      />
                      {idx < transformations.length - 1 && (
                        <ArrowForwardIcon fontSize="small" color="action" />
                      )}
                    </React.Fragment>
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.transformed}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={item.isValid ? 'Valid' : 'Invalid'}
                  size="small"
                  color={item.isValid ? 'success' : 'error'}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TransformationPreview;
