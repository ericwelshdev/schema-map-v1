// DataDictionaryClassificationSummary.js
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Card, Typography, Chip, CardContent, Grid, IconButton, Collapse, Stack, LinearProgress } from '@mui/material';
import { DataGrid, GridCell } from '@mui/x-data-grid';
import { initDB, getData, setData } from '../utils/storageUtils';
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


const DataDictionaryClassificationSummary = ({ classificationData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ddResourceSchemaConfig, setDDResourceSchemaConfig] = useState([]);
  const [ddResourceSchemaData, setDDResourceSchemaData] = useState([]);
  const [generalConfigData, setGeneralConfigData] = useState({});
  const [ddResourceProcessedData, setDDResourceProcessedData] = useState([]);
  const [ddResourceGeneralConfig, setDDResourceGeneralConfig] = useState({});
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [validationMetrics, setValidationMetrics] = useState({
    invalidTables: 0,
    invalidColumns: 0
  });


  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();

        const rawDDResourceGeneralConfig = await localStorage.getItem('ddResourceGeneralConfig') || {};
        const ddResourceGeneralConfig = typeof rawDDResourceGeneralConfig === 'string'
          ? JSON.parse(rawDDResourceGeneralConfig)
          : rawDDResourceGeneralConfig;

        // Poll for IndexedDB data until it's available
        const checkData = async () => {
          const schemaData = await getData('ddResourcePreviewRows');
          if (schemaData && Object.keys(schemaData).length > 0) {
            setDDResourceSchemaConfig(schemaData);
            setGeneralConfigData(generalConfigData);
            setDDResourceGeneralConfig(ddResourceGeneralConfig);
            setIsLoading(false);
          } else {
            setTimeout(checkData, 500);
          }
          console.log('!!ddResourceSchemaConfig:', ddResourceSchemaConfig);

          const dataDictionaryData = await getData('ddResourceFullData');
          if (dataDictionaryData && Object.keys(dataDictionaryData).length > 0) {
            setDDResourceSchemaData(dataDictionaryData);
            setIsLoading(false);
          } else {
            setTimeout(checkData, 500);
          }
          console.log('dataDictionaryData:', dataDictionaryData);

        };
        

        await checkData();
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (ddResourceSchemaData && Object.keys(ddResourceSchemaData).length > 0) {
      const processedData = processSchemaData();
      setData('ddResourceProcessedData', processedData);
      
      const invalidTables = processedData.filter(table => table.isInvalid).length;
      const invalidColumns = processedData.reduce((acc, table) => acc + table.columns.filter(col => col.isInvalid).length, 0);
  
      setValidationMetrics({
        invalidTables,
        invalidColumns
      });
      console.log('validationMetrics:', { invalidTables, invalidColumns });
    }
  }, [ddResourceSchemaData]);



  const getDataTypeIcon = (dataType) => {
    const baseType = dataType?.split('(')[0]?.toUpperCase();
    // console.log('Data type:', dataType, 'base type:', baseType);
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

 

  const [sourceData, setSourceData] = useState({
    ddClassifiedPreviewRows: null,
  });

  // const getClassifiedColumns = useCallback((classificationType) => {
  //   return ddResourceSchemaConfig?.filter(
  //     (column) => column.schemaClassification?.value === classificationType
  //   );
  // }, [ddResourceSchemaConfig]);


  const processSchemaData = () => {
    if (!ddResourceSchemaConfig || !ddResourceSchemaData) return [];



    const getClassifiedColumns = (classificationType) => {
      return ddResourceSchemaConfig.filter(
          (column) => column.schemaClassification?.value === classificationType
      );
  };

    const tableNameColumns = getClassifiedColumns('stdiz_abrvd_attr_grp_nm');
    const columnNameColumns = getClassifiedColumns('stdiz_abrvd_attr_nm');
    console.log('tableNameColumns:', tableNameColumns);
    console.log('columnNameColumns:', columnNameColumns);
    
    const tableNameField = tableNameColumns[0]?.name;
    const columnNameField = columnNameColumns[0]?.name;

    // Group dictionary data by table
    const tableGroups = ddResourceSchemaData.reduce((acc, row) => {
      const tableName = row[tableNameField];
      if (!acc[tableName]) {
        acc[tableName] = [];
      }
      acc[tableName].push(row);
      return acc;
    }, {});


    const processedSchemaData = 
     Object.entries(tableGroups).map(([tableName, rows]) => ({
          
          id: tableName,
          tableName: tableName,
          isInvalid: !(tableName && tableName !== 'undefined' && tableName.trim() !== '' && tableName !== null),
          logicalName: rows[0][getClassifiedColumns('dsstrc_attr_grp_nm')[0]?.name] || '',
          tableDescription: rows[0][getClassifiedColumns('dsstrc_attr_grp_desc')[0]?.name] || '',
          totalColumns: rows.length,
          nullableColumns: rows.filter(row => row['mand_ind'] === 'YES').length,
          classifiedColumns: Math.round((rows.filter(row => row[columnNameField]).length / rows.length) * 100),
          piiColumns: rows.filter(row => row['pii_ind'] === 'YES').length,
          phiColumns: rows.filter(row => row['phi_ind'] === 'YES').length,
          primaryKeys: {
            pk: rows.filter(row => row['pk_ind'] === 'YES').length,
            fk: rows.filter(row => row['fk_ind'] === 'YES').length
          },
        columns: rows.map(row => ({
            id: row[columnNameField],
            physicalName: row[columnNameField],
            isInvalid: !(row[columnNameField] && row[columnNameField] !== 'undefined' && row[columnNameField].trim() !== '' && row[columnNameField] !== null),
            logicalName: row[getClassifiedColumns('dsstrc_attr_nm')[0]?.name],
            dataType: row[getClassifiedColumns('physcl_data_typ_nm')[0]?.name],
            description: row[getClassifiedColumns('dsstrc_attr_desc')[0]?.name],
            classification: row.schemaClassification?.value || 'Unclassified',
            alternativeName: null,
            columnOrder: row[getClassifiedColumns('dsstrc_attr_seq_nbr')[0]?.name] || row[columnNameField],
            isNullable: row['mand_ind'] === 'YES',
            isPrimaryKey: row['pk_ind'] === 'YES',
            isForeignKey: row['fk_ind'] === 'YES',
            isPII: row['pii_ind'] === 'YES',
            isPHI: row['phi_ind'] === 'YES',
            isDisabled: row['disabled_ind'] === 'YES',
            isEncrypted: row['encrypted_ind'] === 'YES',
            attributes: [
              ...(row['pk_ind'] === 'YES' ? ['PK'] : []),
              ...(row['fk_ind'] === 'YES' ? ['FK'] : []),
              ...(row['pii_ind'] === 'YES' ? ['PII'] : []),
              ...(row['phi_ind'] === 'YES' ? ['PHI'] : [])
            ]
        }))
    }));
    console.log('processedSchemaData', processedSchemaData);
    return processedSchemaData;    
};


  if (isLoading) {
    return <Box sx={{ width: '100%' }}><LinearProgress /></Box>;
  }
    
// Add this new component for the summary card
const DataDictionarySummaryCard = ({ data }) => {
    const summary = data.reduce((acc, table) => ({
      totalTables: acc.totalTables + 1,
      totalColumns: acc.totalColumns + table.totalColumns,
      totalPII: acc.totalPII + table.piiColumns,
      totalPHI: acc.totalPHI + table.phiColumns,
      totalPK: acc.totalPK + table.primaryKeys.pk,
      totalFK: acc.totalFK + table.primaryKeys.fk,
    }), {
      totalTables: 0,
      totalColumns: 0,
      totalPII: 0,
      totalPHI: 0,
      totalPK: 0,
      totalFK: 0
    });

    return (
    <Card sx={{ mb: 1 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={2}>
            <Typography variant="subtitle2" color="textSecondary">Tables</Typography>
            <Typography variant="h6">
              {summary.totalTables}
              <Typography 
                component="span" 
                variant="caption" 
                color={validationMetrics.invalidTables > 0 ? 'error' : 'inherit'}
                sx={{ ml: 0.5 }}
              >
                /{validationMetrics.invalidTables||0} 
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2" color="textSecondary">Columns</Typography>
            <Typography variant="h6">
              {summary.totalColumns}
              <Typography 
                component="span" 
                variant="caption" 
                color={validationMetrics.invalidColumns > 0 ? 'error' : 'inherit'}
                sx={{ ml: 0.5 }}
              >
                /{validationMetrics.invalidColumns||0}
              </Typography>
            </Typography>
          </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2" color="textSecondary">PII</Typography>
              <Typography variant="h6" color="warning.main">{summary.totalPII}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2" color="textSecondary">PHI</Typography>
              <Typography variant="h6" color="error.main">{summary.totalPHI}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2" color="textSecondary">Primary Keys</Typography>
              <Typography variant="h6">{summary.totalPK}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle2" color="textSecondary">Foreign Keys</Typography>
              <Typography variant="h6">{summary.totalFK}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
};   




const tableMetrics = {
  columns: [
    {
      field: 'icon',
      headerName: '',
      width: 5,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
           <FontAwesomeIcon icon={faTable} />
        </Box>
      )
    },
    { field: 'tableName', headerName: 'Table Name', flex: 1 },
    { field: 'logicalName', headerName: 'Entity Name', flex: 1 },
    { field: 'tableDescription', headerName: 'Table Description', flex: 1 },
    { field: 'totalColumns', headerName: 'Total Columns', width: 130 },
    { 
      field: 'piiColumns', 
      headerName: 'PII', 
      width: 50,
      renderCell: (params) => params.value > 0 && (
        <Chip label={params.value} color="warning" size="small" />
      )
    },
    { 
      field: 'phiColumns', 
      headerName: 'PHI', 
      width: 50,
      renderCell: (params) => params.value > 0 && (
        <Chip label={params.value} color="error" size="small" />
      )
    },
    {
      field: 'primaryKeys',
      headerName: 'Keys',
      width: 120,
      renderCell: (params) => {
        const pk = params.value?.pk || 0;
        const fk = params.value?.fk || 0;
        return (
          <Stack direction="row" spacing={1}>
            <Chip label={`PK: ${pk}`} size="small" />
            <Chip label={`FK: ${fk}`} size="small" />
          </Stack>
        );
      }
    }
  ]
};

const columnDetails = {
  columns: [
    {
      field: 'dataType',
      headerName: '',
      width: 2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FontAwesomeIcon icon={getDataTypeIcon(params.value)} />
        </Box>
      )
    },
    { field: 'physicalName', headerName: 'Column Name', flex: 1  },
    { field: 'logicalName', headerName: 'Attribute Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { 
      field: 'attributes', 
      headerName: 'Attributes', 
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          {params.value.map(attr => (
            <Chip key={attr} label={attr} size="small" />
          ))}
        </Stack>
      )
    }
  ]
};


const handleRowClick = (rowId) => {
  setExpandedRowId(expandedRowId === rowId ? null : rowId); // Toggle expansion
};

const processedRows = processSchemaData().flatMap((row) => [
  row,
  ...(expandedRowId === row.id
    ? [{
        id: `${row.id}-expanded`,
        isExpandedRow: true,
        columns: row.columns.filter(col => col.field !== 'expand'),
        tableName: '',
        logicalName: '',
        tableDescription: '',
        totalColumns: '',
        piiColumns: '',
        phiColumns: '',
        primaryKeys: ''
      }]
    : [])
]);




  return (
    <Box sx={{ height: '100%', width: '100%', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Data Dictionary Classification Summary
      </Typography>

    <DataDictionarySummaryCard data={processSchemaData()} />
      <Box sx={{ height: 400, width: '100%', overflow: 'auto' }}>
      <DataGrid
      rows={processedRows}
        columns={[
          {
            field: 'content',
            headerName: '',
            width: 1,
            renderCell: (params) => {
              if (params.row.isExpandedRow) {
                return (
                  <Box sx={{position: 'absolute', left: 0, right: 0, pl: 0,pr: 0, bgcolor: '#deebff', height:250}}>
                    <DataGrid
                      rows={params.row.columns}
                      columns={columnDetails.columns}
                      columnHeaderHeight={40}
                      rowHeight={40}
                      density="compact"
                      hideFooter
                      disableColumnMenu
                      disableSelectionOnClick
                      isRowSelectable={() => false}
                      getRowClassName={(params) => params.row.isInvalid ? 'invalid-row' : ''}
                      sx={{
                        '.MuiDataGrid-cell': {
                          cursor: 'pointer',
                          userSelect: 'none'
                        },
                        '& .invalid-row': {
                        bgcolor: '#ffebee',
                        '&:hover': {
                          bgcolor: '#ffcdd2',
                        },
                      }
                                      }}
                    />
                  </Box>
                );
              }
              return null;
            }
          },
          ...tableMetrics.columns.filter(col => col.field !== 'expand')
        ]}
        columnHeaderHeight={40}
        rowHeight={40}
        density="compact"
        onRowClick={(params) => {
          if (!params.row.isExpandedRow) {
            handleRowClick(params.row.id);
          }
        }}
        disableSelectionOnClick
        isRowSelectable={() => false}
        getRowClassName={(params) => params.row.isInvalid ? 'invalid-row' : ''}
        sx={{
          '.MuiDataGrid-cell': {
            cursor: 'pointer',
            userSelect: 'none'
          },
          '& .invalid-row': {
        bgcolor: '#ffebee',
        '&:hover': {
          bgcolor: '#ffcdd2',
        },
      }
        }}
      />


      </Box>
    </Box>
  );

    };
      
    export default DataDictionaryClassificationSummary;