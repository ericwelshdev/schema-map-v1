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
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
  const CommentsDialog = ({ open, onClose, columnData, onUpdate }) => {
    const [isComposing, setIsComposing] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [pendingChanges, setPendingChanges] = useState(columnData);
    const [viewMode, setViewMode] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [newComment, setNewComment] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

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
        isNew: true,
        isModified: false
      };
  
      setPendingChanges(prev => ({
        ...prev,
        userComments: [...prev.userComments, comment]
      }));
      setHasChanges(true);
      setNewComment('');
      setIsComposing(false);
    };

    const handleEditComment = (comment) => {
      const updatedComment = {
        ...comment,
        isModified: true,
        isNew: false
      };
      setPendingChanges(prev => ({
        ...prev,
        userComments: prev.userComments.map(c => 
          c.id === comment.id ? updatedComment : c
        )
      }));
      setHasChanges(true);
      setEditingComment(updatedComment);
    };

    const handleUndoComment = (commentId) => {
      setPendingChanges(prev => ({
        ...prev,
        userComments: prev.userComments.map(c => 
          c.id === commentId ? columnData.userComments.find(oc => oc.id === commentId) : c
        )
      }));
      setEditingComment(null);
    };

    const handleSaveComment = (comment) => {
      onUpdate({
        ...columnData,
        userComments: columnData.userComments.map(c => 
          c.id === comment.id ? comment : c
        )
      });
      setEditingComment(null);
    };

    const handleDeleteComment = (commentId) => {
      const updatedUserComments = pendingChanges.userComments.filter(c => c.id !== commentId);
      setPendingChanges({
        ...pendingChanges,
        userComments: updatedUserComments
      });
      setHasChanges(true);
    };

    // Action buttons rendering
    const renderActionButtons = (comment) => {
      const isEditing = editingComment?.id === comment.id;
    
      return (
        <Box sx={{ display: 'flex', flexShrink: 0 }}>
          {comment.type === 'user' && (
            <>
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
              {isEditing && (
                <>
                  <IconButton 
                    size="small"
                    onClick={() => handleSaveComment(comment)}
                    color="success"
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => handleUndoComment(comment.id)}
                    color="warning"
                  >
                    <UndoIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </>
          )}
        </Box>
      );
    };

    // New comment section
    const renderNewCommentSection = () => (
      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          size="small"
          placeholder="Type your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          InputProps={{ style: { fontSize: '0.8rem' } }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1 }}>
          <Button 
            size="small" 
            onClick={() => {
              setIsComposing(false);
              setNewComment('');
            }}
          >
            Cancel
          </Button>
          <Button 
            size="small" 
            variant="contained" 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Add Comment
          </Button>
        </Box>
      </Box>
    );

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
              <IconButton 
                size="small" 
                onClick={() => setIsComposing(true)} 
                color="primary"
              >
                <AddCommentIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ height: 400, p: 2 }}>
          {isComposing && renderNewCommentSection()}
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
                {renderActionButtons(comment)}
              </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions sx={{ borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={onClose}>Close</Button>
          {hasChanges && (
            <>
              <Button onClick={() => {
                setPendingChanges(columnData);
                setHasChanges(false);
              }}>
                Cancel Changes
              </Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  onUpdate(pendingChanges);
                  setHasChanges(false);
                  onClose();
                }}
              >
                Save All Changes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  export default CommentsDialog;