import React, { useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Grid,
  IconButton,
  Button,
  Stack,
  TextField,
  Typography,
  Tooltip,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import LinkIcon from '@mui/icons-material/Link';
import SecurityIcon from '@mui/icons-material/Security';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MappingSuggestionsDialog from '../Dialogs/MappingSuggestionsDialog';
import { mockMappingSuggestions } from '../mockData/schemaMappingData';

const ColumnAttributes = ({ column, isEditing }) => (
  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
    {column?.isPrimaryKey && <Chip label="PK" size="small" color="primary" />}
    {column?.isForeignKey && <Chip label="FK" size="small" color="secondary" />}
    {column?.isPII && <Chip label="PII" size="small" color="warning" />}
    {column?.isPHI && <Chip label="PHI" size="small" color="error" />}
    {column?.isNullable && <Chip label="Nullable" size="small" />}
  </Box>
);

const EditableTags = ({ column = {}, isEditing, onAddTag, onDeleteTag }) => {
  const [newTag, setNewTag] = useState('');
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
  const handleAddTag = (tag) => {
    onAddTag(tag);
    setNewTag('');
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>Tags</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {column?.aiTags?.map((tag, index) => (
          <Chip
            key={`ai-${index}`}
            label={tag}
            size="small"
            color="secondary"
          />
        ))}
        {column?.userTags?.map((tag, index) => (
          <Chip
            key={`user-${index}`}
            label={tag}
            size="small"
            color="primary"
            onDelete={isEditing ? () => onDeleteTag(index) : undefined}
          />
        ))}
        {isEditing && (
          <TextField
            size="small"
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newTag.trim()) {
                handleAddTag(newTag);
              }
            }}
            sx={{ width: 100 }}
          />
        )}
      </Box>
    </Box>
  );
};

const EditableComments = ({ column = {}, isEditing, onAddComment, onDeleteComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (comment) => {
    onAddComment(comment);
    setNewComment('');
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>Comments</Typography>
      <Stack spacing={1}>
        {column?.aiComments?.map((comment, index) => (
          <Box key={`ai-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyIcon sx={{ color: 'secondary.main', fontSize: '1rem' }} />
            <Typography variant="body2">{comment.text}</Typography>
          </Box>
        ))}
        {column?.userComments?.map((comment, index) => (
          <Box key={`user-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: 'primary.main', fontSize: '1rem' }} />
            <Typography variant="body2">{comment.text}</Typography>
            {isEditing && (
              <IconButton size="small" onClick={() => onDeleteComment(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
        {isEditing && (
          <TextField
            size="small"
            multiline
            rows={2}
            placeholder="Add comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      if (newComment.trim()) {
                        handleAddComment(newComment);
                      }
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        )}
      </Stack>
    </Box>
  );
};
const MappingHeader = ({ mapping, isEditing, onEdit, onMappingChange, onSave, onCancel, onOk }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6">
          {mapping?.sourceTable || ''}.{mapping?.sourceSchema || ''} → {mapping?.targetTable || ''}.{mapping?.targetSchema || ''}
        </Typography>
        <IconButton 
          onClick={() => onMappingChange(mapping)}
          size="small"
          color="primary"
        >
          <LinkIcon />
        </IconButton>
      </Box>
      {isEditing ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={onCancel}>Cancel</Button>
          <Button variant="contained" onClick={onSave}>Save</Button>
        </Box>
      ) : (
        <Button variant="contained" onClick={onOk}>OK</Button>
      )}
    </Box>
  );

  const ColumnDetails = ({ column = {}, type, isEditing }) => (
    <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            {type === 'source' ? 'Source Column' : 'Target Column'}
          </Typography>
          <Typography variant="h6">{column?.name || ''}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            {type === 'source' ? 'Alternative Column Name' : 'Target Column'}
          </Typography>
          <Typography variant="h6">{column?.name || ''}</Typography>
        </Box>

        {/* {type === 'source' && (
          <TextField
            fullWidth
            size="small"
            label="Alternative Name"
            value={column?.alternativeName || ''}
            disabled={!isEditing}
          />
        )} */}

        <Box>
          <Typography variant="subtitle2" gutterBottom>Data Type</Typography>
          <Typography>{column?.dataType || ''}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>Description</Typography>
          <Typography>{column?.description || ''}</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {column?.isPrimaryKey && <Tooltip title="Primary Key"><KeyIcon color="primary" /></Tooltip>}
          {column?.isForeignKey && <Tooltip title="Foreign Key"><LinkIcon color="secondary" /></Tooltip>}
          {column?.isPII && <Tooltip title="PII"><SecurityIcon color="warning" /></Tooltip>}
          {column?.isPHI && <Tooltip title="PHI"><HealthAndSafetyIcon color="error" /></Tooltip>}
          {column?.isNullable && <Tooltip title="Nullable"><RadioButtonUncheckedIcon /></Tooltip>}
        </Box>

        <EditableTags column={column} isEditing={isEditing} />
        <EditableComments column={column} isEditing={isEditing} />
      </Stack>
    </Card>
  );
    const MappingDetails = ({ 
      sourceSchema, 
      targetSchema, 
      mapping,
      ...props 
    }) => {
      console.log('MappingDetails Props:', {
        sourceSchema,
        targetSchema,
        mapping
      });

      const ColumnDetails = ({ column = {}, type, isEditing }) => {
        console.log(`${type} Column Data:`, column);
        return (
          <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {type === 'source' ? 'Source Column' : 'Target Column'}
                </Typography>
                <Typography variant="h6">{column?.name || ''}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {type === 'source' ? 'Alternative Column Name' : 'Target Column'}
                </Typography>
                <Typography variant="h6">{column?.name || ''}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>Data Type</Typography>
                <Typography>{column?.dataType || ''}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>Description</Typography>
                <Typography>{column?.description || ''}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {column?.isPrimaryKey && <Tooltip title="Primary Key"><KeyIcon color="primary" /></Tooltip>}
                {column?.isForeignKey && <Tooltip title="Foreign Key"><LinkIcon color="secondary" /></Tooltip>}
                {column?.isPII && <Tooltip title="PII"><SecurityIcon color="warning" /></Tooltip>}
                {column?.isPHI && <Tooltip title="PHI"><HealthAndSafetyIcon color="error" /></Tooltip>}
                {column?.isNullable && <Tooltip title="Nullable"><RadioButtonUncheckedIcon /></Tooltip>}
              </Box>

              <EditableTags column={column} isEditing={isEditing} />
              <EditableComments column={column} isEditing={isEditing} />
            </Stack>
          </Card>
        );
      };
      const isUnmapped = !targetSchema || mapping?.type === 'unmapped';

      const handleMappingChange = (mapping) => {
        props.setMappingSuggestionsOpen(true);
      };

      const handleMappingSuggestionApply = (newMapping) => {
        props.onMappingChange(newMapping);
        props.setMappingSuggestionsOpen(false);
      };


      return (
        <Box sx={{ p: 2, height: '100%' }}>
          <MappingHeader 
            mapping={mapping}
            isUnmapped={isUnmapped}
            {...props}
          />
      
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ColumnDetails 
                column={sourceSchema}
                type="source"
                {...props}
              />
            </Grid>
            <Grid item xs={6}>
              {isUnmapped ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">No mapping selected</Typography>
                  <Button 
                    startIcon={<LinkIcon />}
                    onClick={() => props.setMappingSuggestionsOpen(true)}
                  >
                    Select Mapping
                  </Button>
                </Box>
              ) : (
              <ColumnDetails 
                column={targetSchema}
                type="target"
                {...props}
              />
              )}
            </Grid>
          </Grid>

          <MappingSuggestionsDialog
            open={props.mappingSuggestionsOpen}
            onClose={() => props.setMappingSuggestionsOpen(false)}
            sourceSchema={sourceSchema}
            targetSchema={targetSchema}
            suggestions={mockMappingSuggestions}
            onApply={handleMappingSuggestionApply}
          />
        </Box>
      );
    };  export default MappingDetails;