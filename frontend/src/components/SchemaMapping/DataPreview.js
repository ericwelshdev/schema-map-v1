import React from 'react';
import { 
  Box, Paper, Typography, Table, 
  TableBody, TableCell, TableHead, 
  TableRow 
} from '@mui/material';
import { styled } from '@mui/material/styles';

const PreviewContainer = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2),
  overflow: 'auto',
  maxHeight: 300
}));

const DataPreview = ({ data, columnName }) => {
  const sampleData = data.slice(0, 10);

  return (
    <PreviewContainer>
      <Box p={2}>
        <Typography variant="subtitle1" gutterBottom>
          Sample Data: {columnName}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData.map((value, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{String(value)}</TableCell>
                <TableCell>{typeof value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </PreviewContainer>
  );
};

export default DataPreview;
