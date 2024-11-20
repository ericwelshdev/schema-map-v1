import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Grid,
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const ComparisonDialog = ({ open, onClose, sourceColumn, targetColumn }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Column Comparison</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <ComparisonSection title="Source" data={sourceColumn} />
          </Grid>
          <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CompareArrowsIcon color="primary" sx={{ fontSize: 40 }} />
          </Grid>
          <Grid item xs={5}>
            <ComparisonSection title="Target" data={targetColumn} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const ComparisonSection = ({ title, data }) => (
  <Box>
    <Typography variant="subtitle1" gutterBottom>{title}</Typography>
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <ComparisonItem label="Name" value={data?.name} />
      <ComparisonItem label="Type" value={data?.type} />
      <ComparisonItem label="Length" value={data?.length} />
      <ComparisonItem label="Nullable" value={data?.nullable ? 'Yes' : 'No'} />
    </Box>
  </Box>
);

const ComparisonItem = ({ label, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography variant="caption" color="textSecondary">{label}</Typography>
    <Typography variant="body2">{value}</Typography>
    <Divider sx={{ mt: 1 }} />
  </Box>
);

export default ComparisonDialog;
