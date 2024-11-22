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
import VisibilityIcon from '@mui/icons-material/Visibility';
import MappingSuggestionsDialog from '../Dialogs/MappingSuggestionsDialog';
import MappingDetails from '../Details/MappingDetails';
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
  persistentMappings = {},
  onAutoMap = () => {},
  onPreviewData = () => {},
  onCompare = () => {},
  onShowProfile = () => {},
  onMappingUpdate = () => {},
  onRowSelect = () => {},
  onUndo = () => {},
  onShowSuggestions = () => {},
  onMappingChange = () => {},
  changedRows,
  savedRows,
  pendingChanges,
  onSaveMapping,
  onUndoChanges
}) => {
  
  console.log('MappingGrid Props:', {
    sourceSchema,
    targetSchema,
    mappings,
    persistentMappings
  });

  const rows = (sourceSchema || []).map((source, index) => {
    const mapping = mappings?.find(m => m.sourceId === source.dsstrc_attr_id);
    const target = mapping ? (targetSchema || []).find(t => t.dsstrc_attr_id === mapping.targetId) : null;

    return {
      id: index,
      sourceId: source.dsstrc_attr_id,
      sourceTable: source.stdiz_abrvd_attr_grp_nm,
      sourceColumn: source.stdiz_abrvd_attr_nm,
      sourceColumnOrder: source.dsstrc_attr_seq_nbr,
      sourceType: source.physcl_data_typ_nm,
      targetTable: target?.stdiz_abrvd_attr_grp_nm || '-',
      targetColumn: target?.stdiz_abrvd_attr_nm || '-',
      targetType: target?.physcl_data_typ_nm || '-',
      confidence: mapping?.confidence || 0,
      mapping: mapping,
      aiComments: source?.comments?.ai || [],
      userComments: source?.comments?.user || [],
      isMapped: !!mapping,
      isModified: source.isModified,
      isSaved: source.isSaved,
      attributes: {
        isPrimaryKey: source.pk_ind === 'Y',
        isForeignKey: source.fk_ind === 'Y',
        isPII: source.pii_ind === 'Y',
        isPHI: source.phi_ind === 'Y',
        isNullable: source.mand_ind !== 'Y',
        isEncrypted: source.encrypt_ind === 'Y'
      },
      tags: {
        user: source.usr_tag_cmplx ? JSON.parse(source.usr_tag_cmplx) : [],
        ai: source.ai_tag_cmplx ? JSON.parse(source.ai_tag_cmplx) : [],
        meta: source.meta_tag_cmplx ? JSON.parse(source.meta_tag_cmplx) : []
      }
    };
  });        
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [commentType, setCommentType] = useState(null);

const handleMappingChange = (row, newValue) => {
  const newMapping = {
    sourceId: row.sourceId,
    targetId: newValue.dsstrc_attr_id,
    confidence: 1.0,
    targetColumn: newValue.stdiz_abrvd_attr_nm,
    targetTable: newValue.stdiz_abrvd_attr_grp_nm
  };
  onMappingChange(row, newMapping);
};  

  const handleShowSuggestions = (row) => {
    console.log('Opening suggestions dialog with row:', row);
    console.log('Current targetSchema:', targetSchema);
    setSelectedRow(row);
    setMappingDialogOpen(true);
    if (onShowSuggestions) {
      onShowSuggestions(row);
    }
  };

  const handleEdit = (row) => {
    setIsEditingDetails(true);  
    onRowSelect(row); 
  };

  const handleView = (row) => {
    setIsViewingDetails(true);  
    onRowSelect(row); 
  };

  const handleSaveMapping = (row) => {
    onSaveMapping(row);
  };

  const handleUndoChanges = (row) => {
    onUndoChanges(row);
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
      editable: false,
      width: 20,
      renderCell: (params) => {
        if (!changedRows.has(params.row.id)) return null;
        return savedRows.has(params.row.id) ? 
          <CheckCircleIcon color="success" fontSize="small" /> :
          <WarningIcon color="warning" fontSize="small" />;
      }
    },
    {
      field: 'sourceColumnOrder',
      headerName: '#',
      editable: false,
      width: 5,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.7rem',
              color: '#666',
            }}
          >
            {params.row.sourceColumnOrder}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'sourceColumn',
      headerName: 'Source',
      editable: false,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <FontAwesomeIcon 
            icon={getDataTypeIcon(params.row.sourceType)} 
            style={{ fontSize: '0.8rem', color: '#666' }}
          />
          <Typography sx={{ fontSize: '0.7rem' }}>
            {params.row.sourceColumn}
          </Typography>
        </Box>
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
            options={targetSchema || []}
            getOptionLabel={(option) => 
              option ? `${option.dsstrc_attr_nm} (${option.stdiz_abrvd_attr_grp_nm}.${option.stdiz_abrvd_attr_nm})` : ''
            }
            value={
            pendingChanges?.[params.row.id] ? 
            (targetSchema || [])?.find(t => t.dsstrc_attr_id === pendingChanges[params.row.id].targetId) :
            (targetSchema || [])?.find(t => t.dsstrc_attr_id === params.row.mapping?.targetId) || null
            }            
            onChange={(_, newValue) => handleMappingChange(params.row, newValue)}
            renderOption={(props, option) => (
              <li {...props} style={{ fontSize: '0.7rem' }}>
                <strong>{option.dsstrc_attr_nm}</strong> : ({option.stdiz_abrvd_attr_grp_nm}.{option.stdiz_abrvd_attr_nm})
              </li>
            )}
            renderInput={(params) => (
              <TextField 
                {...params} 
                variant="outlined" 
                size="small"
                placeholder="Select target column"
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '0.7rem',
                    padding: '4px 8px !important',
                    height: '18px'
                  },
                  '& .MuiOutlinedInput-root': {
                    padding: '0px 4px !important'
                  }
                }}
              />
            )}
            sx={{ 
              width: '100%',
              '& .MuiAutocomplete-listbox': {
                fontSize: '0.7rem'
              }
            }}
          />
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              handleShowSuggestions(params.row);
            }}
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </Box>
      )
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
      field: 'actions',
      type: 'actions',
      width: 300,
      align: 'right',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={() => handleView(params.row)}
        />,
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

  return (
    <Box sx={{ height: 'calc(100vh - 180px)', width: '100%', bgcolor: 'background.paper' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        density="compact"
        autoPageSize
        autoHeight={false}
        initialState={{
          ...rows.initialState,
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        rowsPerPageOptions={[10, 25, 50]}
        pageSizeOptions={[10, 100, { value: 1000, label: '1,000' }]}
        disableSelectionOnClick
        sx={{
          height: '100%',
          '& .MuiDataGrid-root': { fontSize: '0.7rem' },
          '& .MuiDataGrid-row': {
            minHeight: '35px !important',
            maxHeight: '35px !important',
          },
          '& .MuiDataGrid-columnHeaders': {
            minHeight: '35px !important',
            maxHeight: '35px !important',
            borderBottom: '2px solid rgba(224, 224, 224, 1)',
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
          },                    
          '& .MuiDataGrid-cell': {
            padding: '8px',
          }
        }}
      />
      {selectedMapping && (
        <MappingDetails
          sourceColumn={selectedMapping}
          targetColumn={targetSchema.find(t => t.id === selectedMapping.mapping?.targetId)}
          mapping={selectedMapping.mapping}
          isEditing={isEditingDetails}
          onEdit={() => setIsEditingDetails(true)}
          onUpdate={onMappingUpdate}
        />
      )}

      <CommentsDialog
        open={commentsDialogOpen}
        onClose={() => setCommentsDialogOpen(false)}
        columnData={selectedColumn}
        onUpdate={handleCommentUpdate}
      />
    </Box>
  );
};

export default MappingGrid;
