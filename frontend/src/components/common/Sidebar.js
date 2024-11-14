// src\components\common\Sidebar.js
import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PushPinIcon from '@mui/icons-material/PushPin';
import HubIcon from '@mui/icons-material/Hub';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Folder as FolderIcon,
  Storage as StorageIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import { userConfig } from '../../config/userConfig';
import { BookKeyIcon, BookAIcon } from 'lucide-react'


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [open, setOpen] = useState(!userConfig.sidebar.defaultCollapsed);
  const [pinState, setPinState] = useState(userConfig.sidebar.defaultCollapsed ? 'closed' : 'open');


  const handleDrawerOpen = () => {
    if (pinState !== 'closed') {
      setOpen(true);
    }
  };

  const handleDrawerClose = () => {
    if (pinState !== 'open') {
      setOpen(false);
    }
  };

  const togglePin = () => {
    if (pinState === 'default') {
      setPinState('open');
      setOpen(true);
    } else if (pinState === 'open') {
      setPinState('closed');
      setOpen(false);
    } else {
      setPinState('default');
      setOpen(false);
    }
  };

  const handleItemClick = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);


  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Workspace', icon: <WorkIcon />, path: '/workspace' },
    { text: 'Projects', icon: <AccountTreeIcon />, path: '/projects' },
    { text: 'Sources', icon: <BookKeyIcon />, path: '/sources' },
    { text: 'Targets', icon: <AdsClickIcon />, path: '/targets' },
    { text: 'Data Dictionaries', icon: <BookAIcon />, path: '/data-dictionaries' },
    { text: 'Mapping', icon: <HubIcon />, path: '/mappings' },
    { text: 'Admin', icon: <AdminIcon />, path: '/admin' },
  ];

  return (
    <Drawer 
      variant="permanent" 
      open={open}
      onMouseEnter={handleDrawerOpen}
      onMouseLeave={handleDrawerClose}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            width: 4,
            marginLeft:"-15px",
            height: 48,
            backgroundColor: theme.palette.primary.main,
            transition: theme.transitions.create('top', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
            top: menuItems.findIndex(item => item.path === activeItem) * 48,
          }}
        />
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
              }}
              onClick={() => handleItemClick(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <IconButton
        onClick={togglePin}
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 8,
          transform: pinState === 'open' ? 'rotate(45deg)' : pinState === 'closed' ? 'rotate(90deg)' : 'none',
        }}
      >
        <PushPinIcon fontSize='small' />
      </IconButton>
    </Drawer>
  );
};

export default Sidebar;
