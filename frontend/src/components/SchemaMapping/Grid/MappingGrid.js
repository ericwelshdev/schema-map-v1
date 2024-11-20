import React, { useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { 
  Box, 
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
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTable,
  faFont,
  faHashtag,
  faCalendar,
  faClock,
  faPercent,
  faDatabase,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';


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

  const handleShowMappingSuggestions = (row) => {
    setSelectedRow(row);
    setMappingDialogOpen(true);
  };

  const getDataTypeIcon = (dataType) => {
    const baseType = dataType?.split('(')[0]?.toUpperCase();
    const typeMap = {
      // numbers
      'INT': faHashtag,
      'INTEGER': faHashtag,
      'BIGINT': faHashtag,
      'SMALLINT': faHashtag,
      'DECIMAL': faPercent,
      'NUMERIC': faPercent,
      'FLOAT': faPercent,
      'DOUBLE': faPercent,
      'REAL': faPercent,
      'DEC': faPercent,
      'DOUBLE PRECISION': faPercent,
      'FLOAT4': faPercent,
      'FLOAT8': faPercent,
      'LONGVARBINARY': faPercent,

      // strings
      'CHAR': faFont,
      'VARCHAR': faFont,
      'STRING': faFont,
      'TEXT': faFont,
      'NVARCHAR': faFont,
      'NCHAR': faFont,
      'NVARCHAR2': faFont,
      'CLOB': faFont,
      'NCLOB': faFont,

      // dates and times
      'DATE': faCalendar,
      'DATETIME': faClock,
      'TIMESTAMP': faClock,
      'TIME': faClock,

      // binary
      'BINARY': faDatabase,
      'VARBINARY': faDatabase,
      'BLOB': faDatabase,
      'STRUCT': faDatabase,
      'ARRAY': faDatabase,
      'MAP': faDatabase,

      // boolean
      'BOOLEAN': faToggleOn,
      'BOOL': faToggleOn,

      'DEFAULT': faDatabase
    };

    return typeMap[baseType] || typeMap.DEFAULT;
  };

  const columns = [
    {
      field: 'modifiedStatus',
      headerName: '',
      width: 40,
      renderCell: (params) => (
        changedRows.has(params.row.id) && <EditIcon color="primary" fontSize="small" />
      )
    },
    {
      field: 'status',
      headerName: '',
      width: 40,
      renderCell: (params) => (
        <WorkspacePremiumIcon isMapped={params.row.isMapped} />
      )
    },
    { 
      field: 'sourceColumn', 
      headerName: 'Source', 
      flex: 1 
    },
    {
      field: 'sourceType',
      headerName: '',
      width: 40,
      renderCell: (params) => (
        <Tooltip title={params.row.sourceType}>
          <Box>
            <FontAwesomeIcon 
              icon={getDataTypeIcon(params.row.sourceType)} 
              size="sm"
              color={params.row.isMapped ? "#1976d2" : "#666"}
            />
          </Box>
        </Tooltip>
      )
    },
    {
      field: 'targetColumn',
      headerName: 'Target',
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
          <Autocomplete
            size="small"
            options={targetSchema}
            getOptionLabel={(option) => option.name || ''}
            value={pendingChanges[params.row.id]?.targetMapping || params.row.targetMapping || null}
            onChange={(_, newValue) => handleMappingChange(params.row, newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
            sx={{ width: '100%' }}
          />
          <Tooltip title="Show Mapping Suggestions">
            <IconButton size="small" onClick={() => handleShowMappingSuggestions(params.row)}>
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 300,
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
    <Box sx={{ width: '100%', height: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        density="compact"
        sx={{
          '& .MuiDataGrid-root': {
            fontSize: '0.75rem',
          },
          '& .MuiDataGrid-row': {
            minHeight: '40px !important',
            maxHeight: '40px !important',
          }
        }}
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