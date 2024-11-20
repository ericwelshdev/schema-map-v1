import React, { useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Autocomplete,
  TextField,
  Typography
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
import CommentsDialog from '../Dialogs/CommentsDialog';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFont,
  faHashtag,
  faCalendar,
  faClock,
  faPercent,
  faDatabase,
  faToggleOn,
} from '@fortawesome/free-solid-svg-icons';
import CommentIcon from '@mui/icons-material/Comment';
import ChatIcon from '@mui/icons-material/Chat';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import Badge from '@mui/material/Badge';
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
    const [savedRows, setSavedRows] = useState(new Set());
    const [pendingChanges, setPendingChanges] = useState({});
    const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [commentType, setCommentType] = useState(null);

    const handleMappingChange = (row, newTarget) => {
      setChangedRows(prev => new Set(prev).add(row.id));
      setPendingChanges(prev => ({
        ...prev,
        [row.id]: { ...row, targetMapping: newTarget }
      }));
    };

    const handleSaveMapping = (row) => {
      setSavedRows(prev => new Set(prev).add(row.id));
      onMappingUpdate(row);
    };

    const handleUndoChanges = (row) => {
      setChangedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(row.id);
        return newSet;
      });
      setSavedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(row.id);
        return newSet;
      });
      onUndo(row);
    };

    const handleShowMappingSuggestions = (row) => {
      setSelectedRow(row);
      setMappingDialogOpen(true);
    };

    const handleEdit = (row) => {
      setChangedRows(prev => new Set(prev).add(row.id));
    };

    const handleOpenComments = (row, type) => {
      setSelectedColumn(row);
      setCommentType(type);
      setCommentsDialogOpen(true);
    };

    const handleCommentUpdate = (updatedColumnData) => {
      const updatedRows = rows.map(row => 
        row.id === updatedColumnData.id ? updatedColumnData : row
      );
      onMappingUpdate(updatedRows);
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
          width: 20,
          renderCell: (params) => {
            if (!changedRows.has(params.row.id)) return null;
            return savedRows.has(params.row.id) ? 
              <CheckCircleIcon color="success" fontSize="small" /> :
              <WarningIcon color="warning" fontSize="small" />;
          }
        },
        {
          field: 'comments',
          headerName: '',
          width: 80,
          align: 'center',
          renderCell: (params) => {
            const aiComments = params.row.aiComments || []
            const userComments = params.row.userComments || []
            
            return (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={`${aiComments.filter(c => c.isNew).length} new AI comments`}>
                  <Badge 
                    badgeContent={aiComments.length} 
                    color="secondary"
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        height: '14px',
                        minWidth: '14px',
                        fontSize: '0.6rem',
                        padding: '0 4px',
                        mt: '4px',
                        backgroundColor: '#e91e63'
                      }
                    }}
                  >
                    <IconButton size="small" onClick={() => handleOpenComments(params.row, 'ai')}>
                      <ChatIcon sx={{ 
                        fontSize: '0.9rem',
                        mt:'3px',
                        color: aiComments.length ? '#e91e63' : 'grey.400'
                      }} />
                    </IconButton>
                  </Badge>
                </Tooltip>
                <Tooltip title={`${userComments.filter(c => c.isNew).length} new user comments`}>
                  <Badge 
                    badgeContent={userComments.length} 
                    color="primary"
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        height: '14px',
                        minWidth: '14px',
                        fontSize: '0.6rem',
                        padding: '0 4px',
                        mt: '4px',
                        backgroundColor: '#1976d2'
                      }
                    }}
                  >
                    <IconButton size="small" onClick={() => handleOpenComments(params.row, 'user')}>
                      <CommentIcon sx={{ 
                        fontSize: '0.9rem',
                        mt:'3px',
                        color: userComments.length ? '#1976d2' : 'grey.400'
                      }} />
                    </IconButton>
                  </Badge>
                </Tooltip>
              </Box>
            )
          }
        },
        {
          field: 'sourceColumn',
          headerName: 'Source',
          flex: 1,
          renderCell: (params) => (
            <Typography sx={{ fontSize: '0.7rem' }}>
              {params.row.sourceColumn}
            </Typography>
          )
        },
        {
          field: 'mappedStatus',
          headerName: '',
          width: 40,
          renderCell: (params) => (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <WorkspacePremiumIcon 
                sx={{ 
                  color: params.row.isMapped ? 
                    (params.row.mappedByAI ? '#e91e63' : '#1976d2') : 
                    'grey.400'
                }} 
              />
              <VerifiedIcon 
                sx={{ 
                  color: params.row.isValidated ? 
                    (params.row.validatedByAI ? '#e91e63' : '#1976d2') : 
                    'grey.400'
                }} 
              />
            </Box>
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
          width: 300,
          align: 'right',
          getActions: (params) => [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => handleEdit(params.row)}
            />,
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
              ...(!savedRows.has(params.row.id) ? [
                <GridActionsCellItem
                  icon={<SaveIcon />}
                  label="Save Changes"
                  onClick={() => handleSaveMapping(params.row)}
                />
              ] : []),
              <GridActionsCellItem
                icon={<UndoIcon color="primary" />}
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
        targetColumn: source.targetColumn || '-',
        targetType: source.targetType || '-',
        isMapped: source.isMapped,
        confidence: source.confidence || 0,
        aiComments: source.aiComments || [],
        userComments: source.userComments || [],
        isModified: source.isModified,
        isSaved: source.isSaved
      };
    });

    return (
      <Box sx={{ height: 'calc(100vh - 64px)', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          density="compact"
          sx={{
            '& .MuiDataGrid-root': {
              fontSize: '0.7rem',
            },
            '& .MuiDataGrid-row': {
              minHeight: '35px !important',
              maxHeight: '35px !important',
            },
            '& .MuiDataGrid-cell': {
              py: 0.5,
            },
            '& .MuiAutocomplete-root': {
              '& .MuiInputBase-root': {
                fontSize: '0.7rem',
                py: 0.25,
              }
            },
            '& .MuiChip-root': {
              height: '20px',
              fontSize: '0.65rem',
            },
            '& .MuiIconButton-root': {
              padding: '4px',
            },
            '& .MuiSvgIcon-root': {
              fontSize: '1rem',
            }
          }}
        />
        {selectedColumn && (
          <CommentsDialog
          open={commentsDialogOpen}
          onClose={() => setCommentsDialogOpen(false)}
          columnData={selectedColumn}
          onUpdate={handleCommentUpdate}
        />
        )}
      </Box>
    );
  };

export default MappingGrid;