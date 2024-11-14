import React from 'react';
import { 
  Box, Paper, Button, LinearProgress, 
  Typography, IconButton, Tooltip 
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { styled } from '@mui/material/styles';

const StatusBarContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: theme.zIndex.drawer + 1,
  borderRadius: 0
}));

const TaskItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
  minWidth: 200
}));

const TaskStatusBar = ({ tasks, onAutoMapAll }) => {
  const activeTasks = tasks.filter(task => 
    task.status === 'running' || task.status === 'paused'
  );

  return (
    <StatusBarContainer elevation={3}>
      <Box display="flex" alignItems="center">
        {activeTasks.map(task => (
          <TaskItem key={task.id}>
            <Box flex={1} mr={1}>
              <Typography variant="body2" noWrap>
                {task.description}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={task.progress} 
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
            <Box>
              <Tooltip title={task.status === 'paused' ? 'Resume' : 'Pause'}>
                <IconButton size="small">
                  {task.status === 'paused' ? <PlayArrowIcon /> : <PauseIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton size="small">
                  <StopIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </TaskItem>
        ))}
      </Box>
      <Button
        variant="contained"
        startIcon={<AutoFixHighIcon />}
        onClick={onAutoMapAll}
      >
        Auto Map All
      </Button>
    </StatusBarContainer>
  );
};

export default TaskStatusBar;