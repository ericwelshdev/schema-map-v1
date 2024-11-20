import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Backdrop,
  Stack
} from '@mui/material';
import {
  History as HistoryIcon,
  Settings as SettingsIcon,
  Transform as TransformIcon,
  CheckCircle as ValidationIcon,
  PushPin as PinIcon,
  ChevronRight as CollapseIcon,
  ChevronLeft as ExpandIcon
} from '@mui/icons-material';

// Mock data for demonstration
const mockData = {
  validationResults: [
    { message: "Data type mismatch", severity: "Error", field: "customer_id" },
    { message: "Missing required field", severity: "Warning", field: "email" },
    { message: "Format validation failed", severity: "Error", field: "phone" }
  ],
  mappingHistory: [
    { action: "Mapped customer_id to user_id", timestamp: "2024-01-20 14:30" },
    { action: "Applied email transformation", timestamp: "2024-01-20 14:25" },
    { action: "Created new mapping rule", timestamp: "2024-01-20 14:20" }
  ],
  transformations: [
    { name: "Uppercase", description: "Convert text to uppercase" },
    { name: "Date Format", description: "Convert date to ISO format" },
    { name: "Phone Format", description: "Standardize phone numbers" }
  ],
  mappingSettings: [
    { name: "Auto-mapping", value: "Enabled" },
    { name: "Validation Mode", value: "Strict" },
    { name: "Case Sensitive", value: "True" }
  ]
};
  const SidebarPanel = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isPinned, setIsPinned] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const drawerWidth = isExpanded ? 300 : 60;

    const tabs = [
      { icon: <ValidationIcon />, label: 'Validation', content: mockData.validationResults },
      { icon: <HistoryIcon />, label: 'History', content: mockData.mappingHistory },
      { icon: <TransformIcon />, label: 'Transformations', content: mockData.transformations },
      { icon: <SettingsIcon />, label: 'Settings', content: mockData.mappingSettings }
    ];

    return (
      <>
        <Backdrop
          sx={{ 
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer - 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'fixed',
            right: drawerWidth, // Adjust backdrop to not cover the sidebar
            width: `calc(100% - ${drawerWidth}px)` // Make backdrop cover only the main content
          }}
          open={isExpanded && !isPinned}
        />
        <Box sx={{ 
          position: 'fixed', 
          right: 0, 
          top: 0, 
          height: '100%', 
          display: 'flex',
          zIndex: (theme) => theme.zIndex.drawer + 2 // Ensure sidebar stays above backdrop
        }}>
          {/* Always visible icon bar */}
          <Stack
            sx={{
              width: 60,
              borderLeft: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}
          >
            <IconButton onClick={() => setIsExpanded(!isExpanded)} sx={{ my: 1 }}>
              {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
            </IconButton>
            <IconButton 
              onClick={() => setIsPinned(!isPinned)}
              color={isPinned ? "primary" : "default"}
              sx={{ mb: 1 }}
            >
              <PinIcon />
            </IconButton>
            <Divider />
            {tabs.map((tab, index) => (
              <IconButton
                key={index}
                onClick={() => setActiveTab(index)}
                color={activeTab === index ? "primary" : "default"}
                sx={{ my: 1 }}
              >
                {tab.icon}
              </IconButton>
            ))}
          </Stack>

          {/* Expandable content drawer */}
          {isExpanded && (
            <>
              <Box
                sx={{
                  width: 240,
                  bgcolor: 'background.paper',
                  borderLeft: 1,
                  borderColor: 'divider',
                  overflow: 'auto'
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {tabs[activeTab].label}
                  </Typography>
                  <List>
                    {tabs[activeTab].content.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={item.name || item.message || item.action}
                          secondary={item.description || item.severity || item.timestamp || item.value}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </>
    );
  };
export default SidebarPanel;