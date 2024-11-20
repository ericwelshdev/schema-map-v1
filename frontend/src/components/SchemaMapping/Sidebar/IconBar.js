import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatIcon from '@mui/icons-material/Chat';

const IconBar = ({ onTabClick, activeTab }) => {
  const tabs = [
    { icon: <AutoFixHighIcon />, label: 'Transformations' },
    { icon: <HistoryIcon />, label: 'History' },
    { icon: <CheckCircleIcon />, label: 'Validation' },
    { icon: <ChatIcon />, label: 'AI Chat' }
  ];

  return (
    <Box sx={{ width: '48px', borderRight: 1, borderColor: 'divider', height: '100%' }}>
      {tabs.map((tab, index) => (
        <Tooltip key={index} title={tab.label} placement="left">
          <IconButton
            onClick={() => onTabClick(index)}
            sx={{
              width: '48px',
              height: '48px',
              color: activeTab === index ? 'primary.main' : 'inherit'
            }}
          >
            {tab.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default IconBar;
