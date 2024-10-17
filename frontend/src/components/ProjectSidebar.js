import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  List,
  Collapse,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import {
  ExpandLess,
  ExpandMore,
  Folder,
  Description,
  Storage,
  Api,
  Add,
  Save,
  FileCopy,
  Share,
  Delete,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHashtag,
  faFont,
  faCalendar,
  faToggleOn,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';

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
    width: drawerWidth,
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


  const ProjectSidebar = ({
    project = {},
    expandedItems = {},
    toggleExpand = () => {},
    onTabChange = () => {},
    onItemSelect = () => {},
    onItemDoubleClick = () => {},
    collapsed = false,
    onToggleCollapse = () => {}
  }) => {    const theme = useTheme();
    const [open, setOpen] = useState(true); // Start as open
    const [pinState, setPinState] = useState('open'); // Start pinned open
    const navigate = useNavigate();

    const handleTogglePin = () => {
      setOpen(!open);
      setPinState(pinState === 'open' ? 'closed' : 'open'); // Toggle pin state
    };

    const handleItemSelect = (item, type) => {
      if (type === 'files' || type === 'databases' || type === 'apis') {
        navigate(`/source/${item.id}`);
      }
      onItemSelect(item, type);
    };

    const handleTabOpen = (sourceType) => {
      onTabChange(sourceType);
    };
  const renderSourceItem = (item, type, depth = 0) => (
    <React.Fragment key={item.id}>
      <ListItemButton
        onClick={() => onItemSelect(item, type)}
        onDoubleClick={() => onItemDoubleClick(item, type)}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          pl: 2 + depth * 2,
        }}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(item.id);
          }}
        >
          {expandedItems[item.id] ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        </IconButton>
        <ListItemIcon sx={{ minWidth: 30 }}>
          {type === 'file' ? <Description fontSize="small" /> :
            type === 'database' ? <Storage fontSize="small" /> :
              type === 'api' ? <Api fontSize="small" /> :
                <FontAwesomeIcon icon={
                  item.type === 'number' ? faHashtag :
                    item.type === 'string' ? faFont :
                      item.type === 'date' ? faCalendar :
                        item.type === 'boolean' ? faToggleOn :
                          faQuestionCircle
                } size="sm" />}
        </ListItemIcon>
        <ListItemText primary={item.name} primaryTypographyProps={{ fontSize: '0.9rem' }} />
      </ListItemButton>
      <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.columns && item.columns.map(column => renderSourceItem(column, type, depth + 1))}
          {item.tables && item.tables.map(table => renderSourceItem(table, type, depth + 1))}
          {item.endpoints && item.endpoints.map(endpoint => renderSourceItem(endpoint, type, depth + 1))}
        </List>
      </Collapse>
    </React.Fragment>
  );

  const renderTopLevelNode = (nodeType, icon, count) => (
    <ListItemButton
      onClick={() => onItemSelect({ type: nodeType.toLowerCase() }, nodeType.toLowerCase())}
      onDoubleClick={() => toggleExpand(nodeType)}
      sx={{
        minHeight: 48,
        justifyContent: open ? 'initial' : 'center',
        px: 2.5,
      }}
    >
    </ListItemButton>
  );

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        position: 'relative',
        '& .MuiDrawer-paper': {
          position: 'relative',
          zIndex: 1,
          height: '100%',
          overflow: 'hidden',
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleTogglePin}>
          {pinState === 'open' ? (theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />) : (theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />)}
        </IconButton>
      </DrawerHeader>
      <Box sx={{ p: 1, borderBottom: '1px solid #ccc' }}>
        <Typography variant="subtitle1">{project.name}</Typography>
        <Typography variant="caption">Assigned Target: {project.assignedTarget}</Typography>
        <Box sx={{ mt: 0.5 }}>
          <IconButton size="small"><Save fontSize="small" /></IconButton>
          <IconButton size="small"><FileCopy fontSize="small" /></IconButton>
          <IconButton size="small"><Share fontSize="small" /></IconButton>
          <IconButton size="small"><Delete fontSize="small" /></IconButton>
        </Box>
      </Box>
      <List>
        {project.sources && Object.entries(project.sources).map(([sourceType, items]) => (
          <React.Fragment key={sourceType}>
            <ListItemButton
              onClick={() => handleItemSelect({ type: sourceType })}
              onDoubleClick={() => {
                toggleExpand(sourceType);
                handleTabOpen(sourceType);
              }}
              sx={{ marginTop:"-10px", marginBottom:"-10px" }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(sourceType);
                }}
              >
                {expandedItems[sourceType] ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
              <ListItemIcon sx={{ minWidth: 30 }}>
                {sourceType === 'files' ? <Description fontSize="small" /> :
                  sourceType === 'databases' ? <Storage fontSize="small" /> :
                    <Api fontSize="small" />}
              </ListItemIcon>
              <ListItemText
                primary={`${sourceType.charAt(0).toUpperCase() + sourceType.slice(1)} (${items.length})`}
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            </ListItemButton>
            <Collapse in={expandedItems[sourceType]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {items.map(item => renderSourceItem(item, sourceType))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default ProjectSidebar;


