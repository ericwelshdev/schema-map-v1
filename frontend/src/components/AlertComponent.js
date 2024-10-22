import React, { useState, useEffect, useCallback } from 'react';
import { Alert, LinearProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { alertConfig } from '../config/alertConfig';

const AlertComponent = ({ severity, message, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);
  const config = alertConfig[severity];

  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (config.autoClose && config.duration > 0) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress <= 0) {
            clearInterval(timer);
            handleClose();
            return 0;
          }
          return oldProgress - (100 / (config.duration / 100));
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [config.autoClose, config.duration, handleClose]);

  if (!isVisible) return null;

  return (
    <Alert
      severity={severity}
      action={
        config.allowManualClose && (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        )
      }
      sx={{ position: 'relative', overflow: 'hidden' }}
    >
      {message}
      {config.autoClose && config.duration > 0 && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px' }}
        />
      )}
    </Alert>
  );
};

export default AlertComponent;