import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ValidationIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import TransformIcon from '@mui/icons-material/Transform';
import SettingsIcon from '@mui/icons-material/Settings';

const SidebarPanel = ({ schema, selected, onSelect, transformations, validationResults, position }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const drawerWidth = isExpanded ? 600 : 60;

  const tabs = [
    { icon: <ValidationIcon />, label: 'Validation', content: validationResults },
    { icon: <HistoryIcon />, label: 'History', content: [] },
    { icon: <TransformIcon />, label: 'Transformations', content: transformations },
    { icon: <SettingsIcon />, label: 'Settings', content: [] }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        top: 64,
        height: 'calc(100vh - 64px)',
        width: drawerWidth,
        display: 'flex',
        transition: 'width 0.3s ease',
        bgcolor: 'background.default',
        borderLeft: 1,
        borderColor: 'divider',
        zIndex: 2,
      }}
    >
      {/* Icon Bar */}
      <Stack
        sx={{
          width: 60,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <IconButton onClick={() => setIsExpanded(!isExpanded)} sx={{ my: 1 }}>
          {isExpanded ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        <Divider />
        {tabs.map((tab, index) => (
          <Tooltip key={index} title={tab.label} placement="left">
            <IconButton
              onClick={() => setActiveTab(index)}
              color={activeTab === index ? "primary" : "default"}
              sx={{ my: 1 }}
            >
              {tab.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>

      {/* Expanded Content */}
      {isExpanded && (
        <Box
          sx={{
            width: 540,
            bgcolor: 'background.paper',
            overflow: 'auto',
            boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h6" sx={{ p: 2 }}>
            {tabs[activeTab].label}
          </Typography>
          <List>
            {tabs[activeTab].content?.map((item, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={item.message || item.name || item.action}
                  secondary={item.description || item.severity || item.timestamp}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default SidebarPanel;