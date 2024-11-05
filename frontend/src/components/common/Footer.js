import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useView } from '../../contexts/ViewContext';

const Footer = ({ taskStatus }) => {
  const { footerAlert } = useView();

  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '32px',
        zIndex: (theme) => theme.zIndex.drawer + 2,
        backgroundColor: (theme) => theme.palette.background.paper,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 8px' }}>
        <Typography variant="caption">
          Task Status: {taskStatus}
        </Typography>
        {footerAlert && (
          <Alert 
            severity={footerAlert.type}
            sx={{ 
              padding: '0 8px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              '& .MuiAlert-message': {
                padding: '0'
              }
            }}
          >
            {footerAlert.message}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default Footer;