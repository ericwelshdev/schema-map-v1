import React, { useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { 
  Box, 
  Chip, 
  IconButton, 
  Tooltip, 
  Autocomplete,
  TextField
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PreviewIcon from '@mui/icons-material/Preview';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LinkIcon from '@mui/icons-material/Link';
import AssessmentIcon from '@mui/icons-material/Assessment';
import UndoIcon from '@mui/icons-material/Undo';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import MappingSuggestionsDialog from '../Dialogs/MappingSuggestionsDialog';

const MappingGrid = ({ 
  sourceSchema = [], 
  targetSchema = [], 
  mappings = [],
  onAutoMap = () => {},
  onPreviewData = () => {},
  onCompare = () => {},
  onShowProfile = () => {},
  onMappingUpdate = () => {},
  onUndo = () => {}
}) => {
  const [changedRows, setChangedRows] = useState(new Set());
  const [pendingChanges, setPendingChanges] = useState({});
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMappingChange = (row, newTarget) => {
    setChangedRows(prev => new Set(prev).add(row.id));
    setPendingChanges(prev => ({
      ...prev,
      [row.id]: { ...row, targetMapping: newTarget }
    }));
  };

  const handleSaveMapping = (row) => {
    onMappingUpdate(pendingChanges[row.id]);
  };

  const handleUndoChanges = (row) => {
    setChangedRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(row.id);
      return newSet;
    });
    setPendingChanges(prev => {
      const newChanges = { ...prev };
      delete newChanges[row.id];
      return newChanges;
    });
    onUndo(row);
  };

  const columns = [
    {
      field: 'modifiedStatus',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        changedRows.has(params.row.id) && (
          <Tooltip title="Modified">
            <EditIcon color="primary" fontSize="small" />
          </Tooltip>
        )
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.isMapped ? 'Mapped' : 'Unmapped'}
          color={params.row.isMapped ? 'success' : 'default'}
          variant="outlined"
        />
      )
    },
    { field: 'sourceColumn', headerName: 'Source Column', flex: 1 },
    { field: 'sourceType', headerName: 'Source Type', width: 120 },
    {
      field: 'targetColumn',
      headerName: 'Target Column',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
          <Autocomplete
            size="small"
            options={targetSchema}
            getOptionLabel={(option) => option.name || ''}
            value={pendingChanges[params.row.id]?.targetMapping || params.row.targetMapping || null}
            onChange={(_, newValue) => handleMappingChange(params.row, newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
            sx={{ minWidth: 200 }}
          />
          <Tooltip title="Show Mapping Suggestions">
            <IconButton 
              size="small" 
              onClick={() => {
                setSelectedRow(params.row);
                setMappingDialogOpen(true);
              }}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    { field: 'targetType', headerName: 'Target Type', width: 120 },
    {
      field: 'confidence',
      headerName: 'Confidence',
      width: 120,
      renderCell: (params) => params.row.isMapped && (
        <Chip
          size="small"
          label={`${(params.row.confidence * 100).toFixed()}%`}
          color={params.row.confidence > 0.7 ? 'success' : 'warning'}
        />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 250,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<AutoFixHighIcon />}
          label="Auto Map"
          onClick={() => onAutoMap(params.row)}
        />,
        <GridActionsCellItem
          icon={<CompareArrowsIcon />}
          label="Compare"
          onClick={() => onCompare(params.row)}
        />,
        <GridActionsCellItem
          icon={<PreviewIcon />}
          label="Preview Data"
          onClick={() => onPreviewData(params.row)}
        />,
        <GridActionsCellItem
          icon={<AssessmentIcon />}
          label="Show Profile"
          onClick={() => onShowProfile(params.row)}
        />,
        ...(changedRows.has(params.row.id) ? [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save Changes"
            onClick={() => handleSaveMapping(params.row)}
          />,
          <GridActionsCellItem
            icon={<UndoIcon />}
            label="Undo Changes"
            onClick={() => handleUndoChanges(params.row)}
          />
        ] : [])
      ]
    }
  ];

  const rows = sourceSchema.map((source, index) => {
    const mapping = mappings.find(m => m.sourceId === source.id);
    const target = mapping ? targetSchema.find(t => t.id === mapping.targetId) : null;

    return {
      id: index,
      sourceId: source.id,
      sourceColumn: source.name,
      sourceType: source.type,
      targetColumn: target?.name || '-',
      targetType: target?.type || '-',
      isMapped: !!mapping,
      confidence: mapping?.confidence || 0,
      mapping: mapping
    };
  });

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        checkboxSelection
        disableSelectionOnClick
        density="compact"
      />
      <MappingSuggestionsDialog 
        open={mappingDialogOpen}
        onClose={() => setMappingDialogOpen(false)}
        suggestions={mappings.filter(m => m.sourceId === selectedRow?.sourceId)}
        onApply={handleMappingChange}
      />
    </Box>
  );
};

export default MappingGrid;