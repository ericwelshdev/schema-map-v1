import React from 'react';
import { 
  Box, 
  Button, 
  ButtonGroup, 
  Tooltip,
  CircularProgress 
} from '@mui/material';
import {
  AutoFixHigh as AutoFixHighIcon,
  PlaylistAddCheck as ValidateIcon,
  Save as SaveIcon,
  Undo as UndoIcon
} from '@mui/icons-material';

const BatchOperationsPanel = ({ 
  onAutoMap, 
  onValidate, 
  onSave, 
  onUndo, 
  selectedCount = 0,
  isProcessing = false 
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <ButtonGroup size="small" variant="outlined">
        <Tooltip title="Auto-map selected columns">
          <Button
            startIcon={isProcessing ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
            onClick={onAutoMap}
            disabled={selectedCount === 0 || isProcessing}
          >
            Auto Map ({selectedCount})
          </Button>
        </Tooltip>
        
        <Tooltip title="Validate mappings">
          <Button
            startIcon={<ValidateIcon />}
            onClick={onValidate}
            disabled={selectedCount === 0}
            color="info"
          >
            Validate
          </Button>
        </Tooltip>

        <Tooltip title="Save changes">
          <Button
            startIcon={<SaveIcon />}
            onClick={onSave}
            color="success"
          >
            Save
          </Button>
        </Tooltip>

        <Tooltip title="Undo changes">
          <Button
            startIcon={<UndoIcon />}
            onClick={onUndo}
            color="warning"
          >
            Undo
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

export default BatchOperationsPanel;
