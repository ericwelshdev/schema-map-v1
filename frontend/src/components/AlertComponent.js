import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, LinearProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { alertConfig } from '../config/alertConfig';

const AlertComponent = ({ severity, message, onClose }) => {
  const [open, setOpen] = useState(true);
  const [progress, setProgress] = useState(100);
  const config = alertConfig[severity];

  useEffect(() => {
    if (config.autoClose && config.duration > 0) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = oldProgress - (100 / (config.duration / 100));
          if (newProgress <= 0) {
            clearInterval(timer);
            setOpen(false);
            onClose();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [config, onClose]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    onClose();
  };

  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert
        severity={severity}
        action={
          config.allowManualClose && (
            <IconButton size="small" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )
        }
        sx={{ width: '100%', position: 'relative', overflow: 'hidden' }}
      >
        {message}
        {config.autoClose && config.duration > 0 && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: 'transparent',
              '& .MuiLinearProgress-bar': {
                backgroundColor: `${severity}.main`,
              },
            }}
          />
        )}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;