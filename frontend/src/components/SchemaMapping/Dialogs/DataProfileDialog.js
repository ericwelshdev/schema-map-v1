import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StatRow = ({ label, value }) => (
  <TableRow>
    <TableCell component="th" scope="row">
      <Typography variant="caption">{label}</Typography>
    </TableCell>
    <TableCell align="right">
      <Typography variant="body2">{value}</Typography>
    </TableCell>
  </TableRow>
);

const DataProfileDialog = ({ open, onClose, columnProfile = {} }) => {
  const {
    name = '',
    distinctCount = 0,
    nullRate = 0,
    minLength = 0,
    maxLength = 0,
    patternMatchRate = 0,
    distribution = [],
    patterns = []
  } = columnProfile;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Data Profile: {name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Statistics Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Key Statistics</Typography>
              <Table size="small">
                <TableBody>
                  <StatRow label="Distinct Values" value={distinctCount} />
                  <StatRow label="Null Rate" value={`${nullRate}%`} />
                  <StatRow label="Min Length" value={minLength} />
                  <StatRow label="Max Length" value={maxLength} />
                  <StatRow label="Pattern Match" value={`${patternMatchRate}%`} />
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {/* Value Distribution Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: 300 }}>
              <Typography variant="subtitle2" gutterBottom>Value Distribution</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribution}>
                  <XAxis dataKey="value" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Pattern Analysis */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Pattern Analysis</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Pattern</TableCell>
                    <TableCell>Examples</TableCell>
                    <TableCell align="right">Frequency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patterns.map((pattern, index) => (
                    <TableRow key={index}>
                      <TableCell>{pattern.regex}</TableCell>
                      <TableCell>{pattern.examples?.join(', ')}</TableCell>
                      <TableCell align="right">{pattern.frequency}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DataProfileDialog;