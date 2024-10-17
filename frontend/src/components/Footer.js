import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = ({ taskStatus }) => {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        padding: 1,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Task Status: {taskStatus}
      </Typography>
    </Box>
  );
};

export default Footer;