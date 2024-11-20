import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Button, 
  Chip, 
  IconButton, 
  Tooltip,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  Autocomplete, 
  LinearProgress,
  Stack,
  Slider,
  Checkbox

} from '@mui/material';
import { 
  DragDropContext, 
  Droppable, 
  Draggable 
} from 'react-beautiful-dnd';
import { 
  DataGrid, 
  GridToolbar 
} from '@mui/x-data-grid';

import { 
  Timeline, 
  TimelineItem, 
  TimelineContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector 
} from '@mui/lab';

import {
  AutoFixHigh as AutoFixHighIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon,
  Preview as PreviewIcon,
  CompareIcon as CompareIcon,
  ChevronRightIcon,
  FilterListOff as FilterListOffIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
  Edit as EditIcon,
  Rule as RuleIcon,
  Assessment,
  Compare,
  Transform as TransformIcon,
  Fingerprint  as FingerprintIcon,
  Block as BlockIcon,
  Pattern as PatternIcon

} from '@mui/icons-material';

import MappingCanvas from '../components/SchemaMapping/MappingCanvas';

  // Add MetricCard component
  const MetricCard = ({ title, value, icon }) => (
    <Grid item xs={4}>
      <Paper sx={{ p: 1, textAlign: 'center' }}>
        {icon}
        <Typography variant="h6">{value}</Typography>
        <Typography variant="caption">{title}</Typography>
      </Paper>
    </Grid>
  );

  // Add ValidationItem component
  const ValidationItem = ({ title, status, message }) => (
    <ListItem>
      <ListItemIcon>
        {status ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
      </ListItemIcon>
      <ListItemText primary={title} secondary={message} />
    </ListItem>
  );

  // Add column profiling service
  const getColumnProfiling = async (column) => {
    // Implementation for column profiling
    return {
      distinctCount: 100,
      nullRate: 5,
      patternMatchRate: 95
    };
  };

const MappingDetails = ({ mapping }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Mapping Details</Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <ProfilingMetrics sourceColumn={mapping.sourceColumn} />
        <ValidationResults mapping={mapping} />
        <TransformationRules mapping={mapping} />
      </Box>
    </Box>
  );
};

const MultiSelect = ({ label, options, value, onChange }) => {
  return (
    <Autocomplete
      multiple
      size="small"
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
    />
  );
};


const targetColumns = [
  { id: 'stdiz_abrvd_attr_nm', label: 'Physical Column Name' },
  { id: 'dsstrc_attr_nm', label: 'Logical Column Name' },
  { id: 'physcl_data_typ_nm', label: 'Data Type' }
  // Add more target columns as needed
];
// Add mock data
const mockMappingRows = [
  {
    id: 1,
    sourceName: 'customer_id',
    sourceType: 'VARCHAR',
    mappingStatus: 'mapped',
    confidence: 0.95,
    targetColumn: { id: 'stdiz_abrvd_attr_nm', label: 'Physical Column Name' },
    tasks: [
      { id: 't1', type: 'profiling', status: 'completed' },
      { id: 't2', type: 'validation', status: 'running' }
    ],
    sampleData: ['CUS001', 'CUS002', 'CUS003'],
    aiSuggestion: true
  },
  {
    id: 2,
    sourceName: 'transaction_date',
    sourceType: 'TIMESTAMP',
    mappingStatus: 'pending',
    confidence: 0.75,
    targetColumn: null,
    tasks: [
      { id: 't3', type: 'profiling', status: 'completed' }
    ],
    sampleData: ['2023-01-01', '2023-01-02', '2023-01-03'],
    aiSuggestion: true
  },
  {
    id: 3,
    sourceName: 'amount',
    sourceType: 'DECIMAL',
    mappingStatus: 'error',
    confidence: 0.45,
    targetColumn: null,
    tasks: [
      { id: 't4', type: 'validation', status: 'failed' }
    ],
    sampleData: ['100.50', '200.75', '350.25'],
    aiSuggestion: true
  },
  {
    id: 4,
    sourceName: 'customer_name',
    sourceType: 'VARCHAR',
    mappingStatus: 'mapped',
    confidence: 0.88,
    targetColumn: { id: 'dsstrc_attr_nm', label: 'Logical Column Name' },
    tasks: [
      { id: 't5', type: 'profiling', status: 'completed' },
      { id: 't6', type: 'validation', status: 'completed' }
    ],
    sampleData: ['John Doe', 'Jane Smith', 'Bob Johnson'],
    aiSuggestion: true
  },
  {
    id: 5,
    sourceName: 'is_active',
    sourceType: 'BOOLEAN',
    mappingStatus: 'in-progress',
    confidence: 0.82,
    targetColumn: null,
    tasks: [
      { id: 't7', type: 'profiling', status: 'running' }
    ],
    sampleData: ['true', 'false', 'true'],
    aiSuggestion: true
  }
];





const ProfilingMetrics = ({ sourceColumn }) => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      // Fetch profiling metrics
      const results = await getColumnProfiling(sourceColumn);
      setMetrics(results);
    };
    fetchMetrics();
  }, [sourceColumn]);

  return (
    <Box sx={{ minWidth: 300 }}>
      <Typography variant="subtitle1">Profiling Metrics</Typography>
      {metrics && (
        <Grid container spacing={1}>
          <MetricCard 
            title="Distinct Values" 
            value={metrics.distinctCount}
            icon={<FingerprintIcon />}
          />
          <MetricCard 
            title="Null Rate" 
            value={`${metrics.nullRate}%`}
            icon={<BlockIcon />}
          />
          <MetricCard 
            title="Pattern Match" 
            value={`${metrics.patternMatchRate}%`}
            icon={<PatternIcon />}
          />
        </Grid>
      )}
    </Box>
  );
};

// Add QualityMetric component
const QualityMetric = ({ title, value, icon }) => (
  <Grid item xs={4}>
    <Paper sx={{ p: 1, textAlign: 'center' }}>
      {icon}
      <Typography variant="h6">{value}%</Typography>
      <Typography variant="caption">{title}</Typography>
    </Paper>
  </Grid>
);

// Add RuleEditor component
const RuleEditor = ({ rule, onUpdate }) => (
  <Box sx={{ width: '100%' }}>
    <TextField
      fullWidth
      size="small"
      value={rule.name}
      onChange={(e) => onUpdate(rule.id, { ...rule, name: e.target.value })}
    />
  </Box>
);

// Add TransformationStatus component
const TransformationStatus = ({ status }) => (
  <Chip
    size="small"
    label={status}
    color={status === 'success' ? 'success' : 'error'}
  />
);


const ValidationResults = ({ mapping }) => {
  return (
    <Box sx={{ minWidth: 300 }}>
      <Typography variant="subtitle1">Validation</Typography>
      <List>
        <ValidationItem 
          title="Type Compatibility"
          status={mapping.typeCompatible}
          message={mapping.typeValidation}
        />
        <ValidationItem 
          title="Format Match"
          status={mapping.formatValid}
          message={mapping.formatValidation}
        />
        <ValidationItem 
          title="Range Check"
          status={mapping.rangeValid}
          message={mapping.rangeValidation}
        />
      </List>
    </Box>
  );
};

const TransformationRules = ({ mapping }) => {
  return (
    <Box sx={{ minWidth: 300 }}>
      <Typography variant="subtitle1">Transformations</Typography>
      <List>
        {mapping.transformations.map((transform, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <TransformIcon />
            </ListItemIcon>
            <ListItemText 
              primary={transform.type}
              secondary={transform.description}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const TimelineStatusDot = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'pending': return 'grey';
      case 'failed': return 'error';
      default: return 'grey';
    }
  };

  return (
    <TimelineSeparator>
      <TimelineDot color={getStatusColor()} />
      <TimelineConnector />
    </TimelineSeparator>
  );
};

const getMappingStatusColor = (status) => {
  const statusColors = {
    'mapped': 'success',
    'pending': 'warning',
    'error': 'error',
    'in-progress': 'info'
  };
  return statusColors[status] || 'default';
};

const getConfidenceColor = (confidence) => {
  if (confidence >= 0.8) return 'success.main';
  if (confidence >= 0.6) return 'warning.main';
  return 'error.main';
};

const getTaskStatusColor = (status) => {
  const taskColors = {
    'completed': 'success',
    'running': 'info',
    'failed': 'error',
    'pending': 'warning',
    'paused': 'default'
  };
  return taskColors[status] || 'default';
};

const SchemaMapping = () => {
  const PatternIcon = () => <span>🔍</span>; // Custom icon for Pattern Match

  const [activeMappings, setActiveMappings] = useState(new Map());
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarTab, setSidebarTab] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mappingRows, setMappingRows] = useState(mockMappingRows);
  const [suggestions, setSuggestions] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filterModel, setFilterModel] = useState({
    status: [],
    confidence: [0, 100],
    type: []
  });

  const handleSearch = (searchTerm) => {
    // Implementation for search functionality
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilterModel(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  const handleClearFilters = () => {
    setFilterModel({
      status: [],
      confidence: [0, 100],
      type: []
    });
  };
  
  const handleBatchAutoMap = async () => {
    // Implementation for batch auto mapping
  };
  
  const handleBatchValidate = () => {
    // Implementation for batch validation
  };
  
  const handleRuleToggle = (ruleId, enabled) => {
    // Implementation for rule toggling
  };
  
  const handleEditRule = (ruleId) => {
    // Implementation for rule editing
  };
  
  const handleApplyTransformation = (transformationId) => {
    // Implementation for applying transformations
  };
  

  const handleApplyPattern = (patternId) => {
    const pattern = patterns.find(p => p.id === patternId);
    if (!pattern) return;
    // Implementation
  };
  const handleApplyGroupMapping = (group) => {
    // Implementation
  };
  
  const handleRuleReorder = (result) => {
    // Implementation
  };
  
  const handleRuleUpdate = (ruleId, updatedRule) => {
    // Implementation
  };
  
  const generatePreview = (sourceData, transformations, step) => {
    // Implementation
  };
  

  const handleShowSuggestions = (row) => {
    console.log('Show suggestions for:', row);
  };

  const handleShowProfiler = (row) => {
    console.log('Show profiler for:', row);
  };

  const handleMapping = (sourceId, targetColumn) => {
    console.log('Map source:', sourceId, 'to target:', targetColumn);
  };

  const handleAutoMap = async () => {
    setIsProcessing(true);
    try {
      const unmappedRows = mappingRows.filter(row => !row.targetColumn);
      for (const row of unmappedRows) {
        const suggestions=[]
        // const suggestions = await getMLPredictions({
        //   name: row.sourceName,
        //   type: row.sourceType
        // });
        
        if (suggestions.confidence > 0.7) {
          handleMapping(row.id, suggestions.suggestedClassification);
        }
      }
    } catch (error) {
      console.error('Auto mapping failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchProfile = async () => {
    setIsProcessing(true);
    try {
      const selectedRows = mappingRows.filter(row => row.selected);
      const profilingTasks = selectedRows.map(row => ({
        id: row.id,
        type: 'profiling',
        status: 'pending',
        progress: 0
      }));
      
      setTasks(current => [...current, ...profilingTasks]);
      // Implement profiling logic here
    } catch (error) {
      console.error('Batch profiling failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const CustomToolbar = () => {
    return (
      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
        <Button
          startIcon={<AutoFixHighIcon />}
          variant="contained"
          onClick={() => handleAutoMap()}
        >
          Auto Map All
        </Button>
        <Button
          startIcon={<Assessment />}
          variant="outlined"
          onClick={() => handleBatchProfile()}
        >
          Profile Selected
        </Button>
      </Box>
    );
  };

  const columns = [
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip 
          size="small"
          label={params.row.mappingStatus}
          color={getMappingStatusColor(params.row.mappingStatus)}
        />
      )
    },
    {
      field: 'sourceName',
      headerName: 'Source Column',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {params.value}
          <Tooltip title="View sample data">
            <IconButton size="small">
              <PreviewIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      field: 'sourceType',
      headerName: 'Source Type',
      width: 120
    },
    {
      field: 'mapping',
      headerName: 'Mapping',
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size="small"
            onClick={() => handleShowSuggestions(params.row)}
          >
            <AutoFixHighIcon color={params.row.aiSuggestion ? "primary" : "disabled"} />
          </IconButton>
          <IconButton 
            size="small"
            onClick={() => handleShowProfiler(params.row)}
          >
            <Assessment />
          </IconButton>
        </Box>
      )
    },
    {
      field: 'targetName',
      headerName: 'Target Column',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Autocomplete
            size="small"
            options={targetColumns}
            value={params.row.targetColumn}
            onChange={(_, newValue) => handleMapping(params.row.id, newValue)}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
            sx={{ minWidth: 200 }}
          />
          <Tooltip title="Compare columns">
            <IconButton size="small">
              <Compare />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      field: 'confidence',
      headerName: 'Confidence',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <LinearProgress 
            variant="determinate" 
            value={params.row.confidence * 100}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: getConfidenceColor(params.row.confidence)
            }} 
          />
          <Typography variant="caption">
            {`${(params.row.confidence * 100).toFixed(0)}%`}
          </Typography>
        </Box>
      )
    },
    {
      field: 'tasks',
      headerName: 'Tasks',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {params.row.tasks.map(task => (
            <Chip
              key={task.id}
              label={task.type}
              size="small"
              color={getTaskStatusColor(task.status)}
            />
          ))}
        </Box>
      )
    }
  ];


// Add comparison view component
const CompareView = () => {
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <DataGrid
        rows={selectedRows}
        columns={[
          {
            field: 'sourceName',
            headerName: 'Source Column',
            flex: 1,
            renderCell: (params) => (
              <Box>
                <Typography>{params.value}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {params.row.sourceType}
                </Typography>
              </Box>
            )
          },
          {
            field: 'sampleData',
            headerName: 'Sample Data',
            flex: 2,
            renderCell: (params) => (
              <DataPreview data={params.row.sampleData} />
            )
          }
        ]}
      />
    </Box>
  );
};

// Add visual mapping view
const VisualView = () => {
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <MappingCanvas
        sourceNodes={mappingRows}
        targetNodes={targetColumns}
        connections={Array.from(activeMappings.entries())}
        onConnect={handleMapping}
      />
    </Box>
  );
};

// Add data preview component
const DataPreview = ({ data }) => {
  return (
    <Box sx={{ p: 1 }}>
      {data.slice(0, 3).map((value, index) => (
        <Chip
          key={index}
          label={value}
          size="small"
          sx={{ m: 0.5 }}
        />
      ))}
    </Box>
  );
};  

// Add advanced filtering toolbar
const AdvancedFilterToolbar = () => {
  const [filterModel, setFilterModel] = useState({
    status: [],
    confidence: [0, 100],
    type: []
  });

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search columns..."
            InputProps={{
              startAdornment: <SearchIcon />
            }}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <MultiSelect
            label="Status"
            options={['mapped', 'pending', 'error', 'in-progress']}
            value={filterModel.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Slider
            value={filterModel.confidence}
            onChange={(_, value) => handleFilterChange('confidence', value)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
          />
        </Grid>
        <Grid item xs={3}>
          <MultiSelect
            label="Data Type"
            options={['VARCHAR', 'TIMESTAMP', 'DECIMAL', 'BOOLEAN']}
            value={filterModel.type}
            onChange={(value) => handleFilterChange('type', value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button 
            variant="outlined" 
            startIcon={<FilterListOffIcon />}
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

// Add batch operations component
const BatchOperationsPanel = () => {
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="subtitle2" gutterBottom>
        Batch Operations ({selectedRows.length} selected)
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          startIcon={<AutoFixHighIcon />}
          onClick={handleBatchAutoMap}
          disabled={selectedRows.length === 0}
        >
          Auto Map Selected
        </Button>
        <Button
          startIcon={<AssessmentIcon />}
          onClick={handleBatchProfile}
          disabled={selectedRows.length === 0}
        >
          Profile Selected
        </Button>
        <Button
          startIcon={<RuleIcon />}
          onClick={handleBatchValidate}
          disabled={selectedRows.length === 0}
        >
          Validate Selected
        </Button>
      </Stack>
    </Box>
  );
};

// Add validation rules panel
const ValidationRulesPanel = () => {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'Type Compatibility',
      enabled: true,
      severity: 'error'
    },
    {
      id: 2,
      name: 'Format Validation',
      enabled: true,
      severity: 'warning'
    },
    {
      id: 3,
      name: 'Range Check',
      enabled: true,
      severity: 'error'
    }
  ]);

  // Add handlers for the new components
const handleApplyTransformation = (transformationId) => {
  setSuggestions(current =>
    current.map(suggestion =>
      suggestion.id === transformationId
        ? { ...suggestion, applied: !suggestion.applied }
        : suggestion
    )
  );
  
  // Apply transformation to selected mappings
  const updatedMappings = mappingRows.map(row => {
    if (selectedRows.includes(row.id)) {
      return {
        ...row,
        transformations: [...row.transformations, transformationId]
      };
    }
    return row;
  });
  
  setMappingRows(updatedMappings);
};

const handleApplyPattern = (patternId) => {
  const pattern = patterns.find(p => p.id === patternId);
  if (!pattern) return;

  // Apply historical pattern to similar columns
  const updatedMappings = mappingRows.map(row => {
    if (row.sourceName.toLowerCase().includes(pattern.sourceName.toLowerCase())) {
      return {
        ...row,
        targetColumn: { id: pattern.targetName, label: pattern.targetName },
        confidence: pattern.frequency / 100,
        mappingStatus: 'mapped'
      };
    }
    return row;
  });

  setMappingRows(updatedMappings);
};


  
  return (
    <List>
      {rules.map(rule => (
        <ListItem key={rule.id}>
          <ListItemIcon>
            <Switch
              checked={rule.enabled}
              onChange={(e) => handleRuleToggle(rule.id, e.target.checked)}
            />
          </ListItemIcon>
          <ListItemText 
            primary={rule.name}
            secondary={`Severity: ${rule.severity}`}
          />
          <ListItemSecondaryAction>
            <IconButton onClick={() => handleEditRule(rule.id)}>
              <EditIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

// Add transformation suggestions component
const TransformationSuggestions = ({ sourceColumn, targetColumn }) => {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      type: 'Case Transformation',
      confidence: 0.95,
      description: 'Convert to uppercase',
      preview: 'JOHN DOE → JOHN DOE',
      applied: false
    },
    {
      id: 2,
      type: 'Date Format',
      confidence: 0.88,
      description: 'Convert to ISO format',
      preview: '01/01/2023 → 2023-01-01',
      applied: true
    },
    {
      id: 3,
      type: 'Trim Spaces',
      confidence: 0.92,
      description: 'Remove leading/trailing spaces',
      preview: '  John  → John',
      applied: false
    }
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Suggested Transformations
      </Typography>
      <List>
        {suggestions.map(suggestion => (
          <ListItem 
            key={suggestion.id}
            sx={{ 
              bgcolor: suggestion.applied ? 'action.selected' : 'background.paper',
              borderRadius: 1,
              mb: 1
            }}
          >
            <ListItemIcon>
              <Checkbox
                checked={suggestion.applied}
                onChange={() => handleApplyTransformation(suggestion.id)}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  {suggestion.type}
                  <Chip 
                    label={`${(suggestion.confidence * 100).toFixed(0)}%`}
                    size="small"
                    color={suggestion.confidence > 0.9 ? 'success' : 'warning'}
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2">{suggestion.description}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Preview: {suggestion.preview}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

// Add historical mapping patterns component
const HistoricalMappings = () => {
  const [patterns, setPatterns] = useState([
    {
      id: 1,
      sourceName: 'customer_id',
      targetName: 'Physical Column Name',
      frequency: 85,
      lastUsed: '2023-10-15',
      projects: ['Project A', 'Project B']
    },
    {
      id: 2,
      sourceName: 'transaction_date',
      targetName: 'Date Format',
      frequency: 72,
      lastUsed: '2023-10-14',
      projects: ['Project C']
    }
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Historical Mapping Patterns
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Source Pattern</TableCell>
              <TableCell>Target Pattern</TableCell>
              <TableCell align="right">Usage</TableCell>
              <TableCell>Last Used</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patterns.map(pattern => (
              <TableRow key={pattern.id}>
                <TableCell>{pattern.sourceName}</TableCell>
                <TableCell>{pattern.targetName}</TableCell>
                <TableCell align="right">
                  <Tooltip title={`Used in ${pattern.projects.length} projects`}>
                    <Chip 
                      label={`${pattern.frequency}%`}
                      size="small"
                      color="primary"
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>{pattern.lastUsed}</TableCell>
                <TableCell>
                  <IconButton 
                    size="small"
                    onClick={() => handleApplyPattern(pattern.id)}
                  >
                    <AutoFixHighIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Add smart mapping suggestions based on column analysis
const SmartMappingSuggestions = () => {
  const [suggestions, setSuggestions] = useState([
    {
      sourceColumns: ['customer_id', 'user_id', 'account_id'],
      targetType: 'Physical Column Name',
      confidence: 0.98,
      reason: 'Pattern match: Identifier columns typically map to physical names'
    },
    {
      sourceColumns: ['created_at', 'updated_at', 'timestamp'],
      targetType: 'Date Format',
      confidence: 0.95,
      reason: 'Data type and naming convention match'
    }
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Smart Mapping Groups</Typography>
      {suggestions.map((group, index) => (
        <Paper key={index} sx={{ p: 2, my: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">
              {group.targetType}
              <Chip 
                size="small" 
                label={`${(group.confidence * 100).toFixed(0)}%`}
                color="primary"
                sx={{ ml: 1 }}
              />
            </Typography>
            <Button
              size="small"
              startIcon={<AutoFixHighIcon />}
              onClick={() => handleApplyGroupMapping(group)}
            >
              Apply All
            </Button>
          </Box>
          <Box sx={{ mt: 1 }}>
            {group.sourceColumns.map(col => (
              <Chip key={col} label={col} sx={{ m: 0.5 }} />
            ))}
          </Box>
          <Typography variant="caption" color="textSecondary">
            {group.reason}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

// Add data quality insights
const DataQualityInsights = ({ columnId }) => {
  const [insights, setInsights] = useState({
    completeness: 98,
    accuracy: 95,
    consistency: 92,
    patterns: ['###-##-####', '###.##.####'],
    anomalies: [
      { type: 'outlier', value: '000-00-0000', frequency: 3 },
      { type: 'pattern_mismatch', value: 'ABC-12-34XY', frequency: 1 }
    ]
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Data Quality Insights</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <QualityMetric
          title="Completeness"
          value={insights.completeness}
          icon={<CheckCircleIcon />}
        />
        <QualityMetric
          title="Accuracy"
          value={insights.accuracy}
          icon={<VerifiedIcon />}
        />
        <QualityMetric
          title="Consistency"
          value={insights.consistency}
          icon={<TrendingUpIcon />}
        />
      </Grid>
      
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Common Patterns</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        {insights.patterns.map((pattern, idx) => (
          <Chip key={idx} label={pattern} size="small" />
        ))}
      </Box>

      <Typography variant="subtitle2" sx={{ mt: 2 }}>Anomalies</Typography>
      <List dense>
        {insights.anomalies.map((anomaly, idx) => (
          <ListItem key={idx}>
            <ListItemIcon>
              <WarningIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary={anomaly.value}
              secondary={`${anomaly.type} (${anomaly.frequency} occurrences)`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

// Mapping Rules Engine
const MappingRulesEngine = () => {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'ID Column Mapping',
      condition: 'column.name.includes("id") && column.type === "VARCHAR"',
      action: 'map_to_physical_name',
      priority: 1,
      enabled: true
    },
    {
      id: 2,
      name: 'Date Format Standardization',
      condition: 'column.type === "TIMESTAMP"',
      action: 'apply_iso_format',
      priority: 2,
      enabled: true
    }
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Mapping Rules</Typography>
      <DragDropContext onDragEnd={handleRuleReorder}>
        <Droppable droppableId="rules-list">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {rules.map((rule, index) => (
                <Draggable key={rule.id} draggableId={`rule-${rule.id}`} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}
                    >
                      <RuleEditor rule={rule} onUpdate={handleRuleUpdate} />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

// Data Transformation Preview
const TransformationPreview = ({ sourceData, transformations }) => {
  const [previewData, setPreviewData] = useState([]);
  const [selectedStep, setSelectedStep] = useState(0);

  useEffect(() => {
    generatePreview(sourceData, transformations, selectedStep);
  }, [sourceData, transformations, selectedStep]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Transform Preview</Typography>
      <Stepper activeStep={selectedStep}>
        {transformations.map((transform, index) => (
          <Step key={index} onClick={() => setSelectedStep(index)}>
            <StepLabel>{transform.type}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <TableContainer sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Original</TableCell>
              <TableCell>Transformed</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {previewData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.original}</TableCell>
                <TableCell>{row.transformed}</TableCell>
                <TableCell>
                  <TransformationStatus status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};



// Add mapping suggestions component
const MappingSuggestionsPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  
  const handleSuggestionClick = (suggestion) => {
    handleMapping(selectedRow.id, suggestion);
    setAnchorEl(null);
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <List sx={{ width: 300 }}>
        {suggestions.map((suggestion, idx) => (
          <ListItem 
            key={idx}
            button
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <ListItemText
              primary={suggestion.label}
              secondary={
                <Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={suggestion.confidence * 100}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                  <Typography variant="caption">
                    {(suggestion.confidence * 100).toFixed(0)}% confidence
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Popover>
  );
};

// Add search functionality
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useCallback(
    debounce((term) => {
      const filtered = mockMappingRows.filter(row => 
        row.sourceName.toLowerCase().includes(term.toLowerCase()) ||
        row.sourceType.toLowerCase().includes(term.toLowerCase())
      );
      setMappingRows(filtered);
    }, 300),
    []
  );

  return (
    <TextField
      size="small"
      placeholder="Search columns..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
      }}
      InputProps={{
        startAdornment: <SearchIcon fontSize="small" />,
        sx: { fontSize: '0.875rem' }
      }}
    />
  );
};

// Automated Validation Workflow
const ValidationWorkflow = () => {
  const [validationSteps, setValidationSteps] = useState([
    {
      id: 1,
      name: 'Data Type Compatibility',
      status: 'completed',
      results: { passed: 150, failed: 2 }
    },
    {
      id: 2,
      name: 'Format Validation',
      status: 'in_progress',
      results: { passed: 89, failed: 0 }
    },
    {
      id: 3,
      name: 'Business Rules',
      status: 'pending',
      results: null
    }
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Validation Progress</Typography>
      <Timeline>
        {validationSteps.map((step) => (
          <TimelineItem key={step.id}>
            <TimelineStatusDot  status={step.status} />
            <TimelineContent>
              <Typography variant="subtitle2">{step.name}</Typography>
              {step.results && (
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label={`${step.results.passed} passed`}
                    color="success"
                    size="small"
                  />
                  <Chip 
                    icon={<ErrorIcon />} 
                    label={`${step.results.failed} failed`}
                    color="error"
                    size="small"
                  />
                </Box>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

const compactStyles = {
  '& .MuiDataGrid-root': {
    '& .MuiDataGrid-cell': {
      padding: '4px 8px',
      fontSize: '0.875rem',
    },
    '& .MuiDataGrid-columnHeader': {
      padding: '4px 8px',
      height: '40px',
    },
    '& .MuiDataGrid-row': {
      maxHeight: '40px!important',
      minHeight: '40px!important',
    }
  },
  '& .MuiTextField-root': {
    '& input': {
      padding: '6px 8px',
      fontSize: '0.875rem',
    }
  }
};

const SidebarPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Box
      sx={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: isExpanded ? '350px' : '48px',
        transition: 'width 0.3s ease',
        bgcolor: 'background.paper',
        borderLeft: 1,
        borderColor: 'divider',
        zIndex: 1200,
      }}
    >
      <IconBar onTabClick={(tab) => {
        setIsExpanded(true);
        setSidebarTab(tab);
      }}/>
      
      <Slide direction="left" in={isExpanded}>
        <Box sx={{ width: '350px', height: '100%' }}>
          <IconButton 
            onClick={() => setIsExpanded(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <ChevronRightIcon />
          </IconButton>
          
          {sidebarTab === 0 && <TransformationSuggestions />}
          {sidebarTab === 1 && <HistoricalMappings />}
          {sidebarTab === 2 && <ValidationRulesPanel />}
          {sidebarTab === 3 && <AIChatInterface />}
        </Box>
      </Slide>
    </Box>
  );
};

const AIChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleQuery = async (query) => {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        query,
        context: {
          columns: mappingRows.map(row => row.sourceName),
          sampleData: mappingRows.reduce((acc, row) => ({
            ...acc,
            [row.sourceName]: row.sampleData
          }), {})
        }
      })
    });
    
    const result = await response.json();
    setMessages(prev => [...prev, 
      { type: 'user', content: query },
      { type: 'assistant', content: result.response }
    ]);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
      </Box>
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your data..."
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleQuery(input)}>
                <SendIcon />
              </IconButton>
            )
          }}
        />
      </Box>
    </Box>
  );
};


return (
  <Box sx={{ mt:3,  height: '100%', display: 'flex', flexDirection: 'column' }}>
    <AdvancedFilterToolbar />
    
    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <BatchOperationsPanel />
        <DataGrid
          rows={mappingRows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
          components={{
            Toolbar: CustomToolbar
          }}
          style={compactStyles}
        />
      </Box>
      
      <Box sx={{ width: 350, borderLeft: 1, borderColor: 'divider' }}>
        <Tabs value={sidebarTab} onChange={(_, newValue) => setSidebarTab(newValue)}>
          <Tab label="Transformations" />
          <Tab label="History" />
          <Tab label="Validation" />
        </Tabs>
        
        {sidebarTab === 0 && (
          <TransformationSuggestions 
            sourceColumn={selectedRows[0]} 
            targetColumn={mappingRows.find(r => r.id === selectedRows[0])?.targetColumn} 
          />
        )}
        {sidebarTab === 1 && <HistoricalMappings />}
        {sidebarTab === 2 && <ValidationRulesPanel />}
      </Box>
    </Box>
  </Box>
);
}
export default SchemaMapping;
