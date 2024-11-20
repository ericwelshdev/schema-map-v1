import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Box,
  Typography,
  ListItemIcon,
  Button,
  ButtonGroup,
  DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const CommentsDialog = ({ open, onClose, columnData, onUpdate }) => {
  const [viewMode, setViewMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [pendingChanges, setPendingChanges] = useState(columnData);

  const allComments = [
    ...(pendingChanges?.aiComments || []),
    ...(pendingChanges?.userComments || [])
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filteredComments = allComments.filter(comment => 
    (viewMode === 'all' || comment.type === viewMode) &&
    comment.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment,
      timestamp: new Date().toISOString(),
      type: 'user',
      isNew: true
    };
    
    const updatedUserComments = [...(pendingChanges?.userComments || []), comment];
    setPendingChanges({
      ...pendingChanges,
      userComments: updatedUserComments
    });
    setNewComment('');
  };

  const handleEditComment = (comment) => {
    if (editingComment?.id === comment.id) {
      const updatedUserComments = pendingChanges.userComments.map(c => 
        c.id === comment.id ? editingComment : c
      );
      setPendingChanges({
        ...pendingChanges,
        userComments: updatedUserComments
      });
      setEditingComment(null);
    } else {
      setEditingComment(comment);
    }
  };

  const handleDeleteComment = (commentId) => {
    const updatedUserComments = pendingChanges.userComments.filter(c => c.id !== commentId);
    setPendingChanges({
      ...pendingChanges,
      userComments: updatedUserComments
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontSize: '0.9rem' }}>
            Comments for {columnData?.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
          <ButtonGroup size="small">
          <Button 
            variant={viewMode === 'all' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('all')}
            startIcon={<ForumIcon sx={{ fontSize: '1rem' }} />}
          >
            All ({allComments.length})
          </Button>
          <Button 
            variant={viewMode === 'ai' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('ai')}
            startIcon={<SmartToyIcon sx={{ fontSize: '1rem', color: '#e91e63' }} />}
          >
            AI ({columnData?.aiComments?.length || 0})
          </Button>
          <Button 
            variant={viewMode === 'user' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('user')}
            startIcon={<AccountCircleIcon sx={{ fontSize: '1rem', color: '#1976d2' }} />}
          >
            User ({columnData?.userComments?.length || 0})
          </Button>
        </ButtonGroup>
            <IconButton size="small" onClick={handleAddComment} color="primary">
              <AddCommentIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ height: 400, p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search comments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            style: { fontSize: '0.8rem' },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        <List sx={{ maxHeight: 320, overflow: 'auto' }}>
          {filteredComments.map((comment) => (
            <ListItem
              key={comment.id}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                mb: 1,
                boxShadow: 1,
                pr: 1
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mr: 2,
                width: 40,
                height: 60,
                justifyContent: 'center'
              }}>
                {comment.type === 'ai' ? 
                  <SmartToyIcon sx={{ color: '#e91e63', fontSize: '1.2rem' }} /> : 
                  <AccountCircleIcon sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
                }
                {comment.isNew && (
                  <Chip 
                    label="New" 
                    size="small" 
                    color={comment.type === 'ai' ? 'secondary' : 'primary'}
                    sx={{ height: 16, fontSize: '0.65rem', mt: 0.5 }}
                  />
                )}
              </Box>
              <ListItemText
                primary={
                  editingComment?.id === comment.id ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={editingComment.text}
                      onChange={(e) => setEditingComment({
                        ...editingComment,
                        text: e.target.value
                      })}
                      sx={{ mt: 1 }}
                    />
                  ) : (
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.timestamp).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {comment.text}
                      </Typography>
                    </Box>
                  )
                }
              />
              {comment.type === 'user' && (
                <Box sx={{ display: 'flex', flexShrink: 0 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditComment(comment)}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => handleDeleteComment(comment.id)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            onUpdate(pendingChanges);
            onClose();
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};export default CommentsDialog;