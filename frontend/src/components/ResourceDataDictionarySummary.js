// frontend/src/components/ResourceDataDictionarySummary.js
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, 
  Button, Chip, Stack, IconButton,
  LinearProgress, Step, StepLabel, Stepper
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import SchemaIcon from '@mui/icons-material/Schema';
import CategoryIcon from '@mui/icons-material/Category';
import SaveIcon from '@mui/icons-material/Save';
import { initDB, getData } from '../utils/storageUtils';
import { postResource } from '../services/resourceService';
import { postBulkResourceAttribute } from '../services/resourceAttributeService';
import { postResourceProfile } from '../services/resourceProfileService';
import PIIIcon from '@mui/icons-material/Security';
import PHIIcon from '@mui/icons-material/HealthAndSafety';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AlertComponent from './AlertComponent';


const ResourceDataDictionarySummary = ({ wizardState }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ddResourceSchemaConfig, setDDResourceSchemaConfig] = useState([]);
  const [ddResourceSchemaData, setDDResourceSchemaData] = useState([]);
  const [generalConfigData, setGeneralConfigData] = useState({});
  const [ddResourceGeneralConfig, setDDResourceGeneralConfig] = useState({});
  const [saveProgress, setSaveProgress] = useState({
      activeStep: 0,
      completed: false,
      error: null
  });

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    severity: 'info'
  });
  
  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };
  

  const saveSteps = [
      'Saving Data Dictionary Configuration',
      'Processing Schema Information',
      'Creating Column Definitions',
      'Setting up Metadata'
  ];

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await initDB();
                
                // Load data from localStorage
                const wizardStateEssential = await localStorage.getItem('wizardStateEssential');
                const generalConfigData = typeof wizardStateEssential === 'string'
                    ? JSON.parse(wizardStateEssential)
                    : wizardStateEssential;

                const rawDDResourceGeneralConfig = await localStorage.getItem('ddResourceGeneralConfig') || {};
                const ddResourceGeneralConfig = typeof rawDDResourceGeneralConfig === 'string'
                    ? JSON.parse(rawDDResourceGeneralConfig)
                    : rawDDResourceGeneralConfig;

                // Poll for IndexedDB data until it's available
                const checkData = async () => {
                    const schemaConfig = await getData('ddResourcePreviewRows');
                    const schemaData = await getData('ddResourceProcessedData');
                    if (schemaConfig && Object.keys(schemaConfig).length > 0 && schemaData && Object.keys(schemaData).length > 0) {
                        setDDResourceSchemaConfig(schemaConfig);
                        setDDResourceSchemaData(schemaData);
                        setGeneralConfigData(generalConfigData);
                        setDDResourceGeneralConfig(ddResourceGeneralConfig);
                        setIsLoading(false);
                    } else {
                        setTimeout(checkData, 500);
                    }
                };
                
                await checkData();
            } catch (error) {
                console.error('Error loading data:', error);
                setIsLoading(false);
            }
        };

        loadData();   
    }, []);

  
    if (isLoading) {
        return <Box sx={{ width: '100%' }}><LinearProgress /></Box>;
    }

    console.log('Resource wizardState:', wizardState);
    console.log('Resource ddResourceGeneralConfig:', ddResourceGeneralConfig);
    console.log('Resource generalConfigData:', generalConfigData);
    console.log('Resource ddResourceSchemaConfig:', ddResourceSchemaConfig);
    console.log('Resource ddResourceSchemaData:', ddResourceSchemaData); 


    // console.log('Table column counts:', ddResourceSchemaData.map(table => ({
    //     tableName: table.tableName,
    //     columnCount: table.columns?.length
    //   })));
      
    //   const totalColumns = ddResourceSchemaData.reduce((acc, table) => {
    //     const columnCount = Array.isArray(table.columns) ? table.columns.length : 0;
    //     console.log(`Table ${table.tableName}: ${columnCount} columns`);
    //     return acc + columnCount;
    //   }, 0);

              // Add this check at the start of calculations
      const schemaConfig = Array.isArray(ddResourceGeneralConfig) ? ddResourceGeneralConfig : [];

      // Dictionary Details Card metrics
      const dictionarySchemaMetrics = {
          resourceName: wizardState?.ddResourceSetup?.resourceName,
          resourceDescription: wizardState?.ddResourceSetup?.resourceDescription,
          resourceType: wizardState?.ddResourceSetup?.resourceType,
          standardizedSourceName: wizardState?.ddResourceSetup?.standardizedSourceName,
          versionText: wizardState?.ddResourceSetup?.versionText,
          resourceTags: wizardState?.ddResourceSetup?.resourceTags,
          name: ddResourceGeneralConfig?.resourceInfo?.name,
          type: ddResourceGeneralConfig?.resourceInfo?.type,
          distinctTables: 1,
          totalColumns: new Set(ddResourceSchemaConfig.map(col => col.id)).size,
          phiColumns: ddResourceSchemaConfig.reduce((acc, table) => acc + table.isPHI, 0) || 0,
          piiColumns: ddResourceSchemaConfig.reduce((acc, table) => acc + table.isPHI, 0) || 0,
          disabledColumns: ddResourceSchemaConfig.reduce((acc, table) => acc + table.isDisabled, 0) || 0,          
          size: ddResourceSchemaConfig?.resourceInfo?.size,
          runRows: ddResourceSchemaConfig?.resourceInfo?.fullNumRows,
          lastModified: ddResourceSchemaConfig?.resourceInfo?.lastModified,
          invalidTables: ddResourceSchemaData.filter(table => table.isInvalid).length,
          invalidColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.columns.filter(col => col.isInvalid).length, 0),
          classifiedColumns: schemaConfig.filter(col => col.schemaClassification?.value).length,
      };
      console.log('Resource dictionarySchema Metrics:', dictionarySchemaMetrics); 

      // Dictionary Details Card metrics
      const dictionaryDataMetrics = {
        resourceName: wizardState?.ddResourceSetup?.resourceName,
        resourceDescription: wizardState?.ddResourceSetup?.resourceDescription,
        resourceType: wizardState?.ddResourceSetup?.resourceType,
        standardizedSourceName: wizardState?.ddResourceSetup?.standardizedSourceName,
        versionText: wizardState?.ddResourceSetup?.versionText,
        resourceTags: wizardState?.ddResourceSetup?.resourceTags,
        name: ddResourceGeneralConfig?.resourceInfo?.name,
        type: ddResourceGeneralConfig?.resourceInfo?.type,
        distinctTables: new Set(ddResourceSchemaData.map(col => col.tableName)).size,
        totalColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.totalColumns, 0) || 0,
        nullableColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.nullableColumns, 0) || 0,
        phiColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.phiColumns, 0) || 0,
        piiColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.piiColumns, 0) || 0,
        pkColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.primaryKeys?.pk, 0) || 0,
        fkColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.foreignKeys?.fk, 0) || 0,
        disabledColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.foreignKeys?.fk, 0) || 0,   
        size: ddResourceGeneralConfig?.resourceInfo?.size,
        runRows: ddResourceGeneralConfig?.resourceInfo?.fullNumRows,
        lastModified: ddResourceGeneralConfig?.resourceInfo?.lastModified,
        invalidTables: ddResourceSchemaData.filter(table => table.isInvalid).length,
        invalidColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.columns.filter(col => col.isInvalid).length, 0)
    };
    console.log('Resource dictionaryData Metrics:', dictionaryDataMetrics);       

      // Classification Overview metrics
      const classificationMetrics = {
          classifiedColumns: schemaConfig.filter(col => col.schemaClassification?.value).length,
          piiColumns: schemaConfig.filter(col => col.isPII).length,
          phiColumns: schemaConfig.filter(col => col.isPHI).length,
          disabledColumns: schemaConfig.filter(col => col.isDisabled).length
      };

      console.log("dictionaryDataMetrics",dictionaryDataMetrics)
      console.log("classificationMetrics",classificationMetrics)


    const handleSave = async () => {
        try {
            setIsProcessing(true);
            setSaveProgress(prev => ({ ...prev, activeStep: 0 }));

            // 1.  Save General Config
            const ddResourceSchema = {
              stdiz_abrvd_attr_grp_nm: generalConfigData?.ddResourceSetup?.standardizedSourceName,
              dsstrc_attr_grp_nm: generalConfigData?.ddResourceSetup?.resourceName,
              dsstrc_attr_grp_shrt_nm: generalConfigData?.ddResourceSetup?.standardizedSourceName,
              dsstrc_attr_grp_desc: generalConfigData?.ddResourceSetup?.resourceDescription,
              dsstrc_attr_grp_src_typ_cd: 'Data Dictionary Schema',
              phi_ind: dictionaryDataMetrics.phiColumns > 0 ? true : false,
              pii_ind: dictionaryDataMetrics.piiColumns > 0 ? true : false,
              user_tag_cmplx: JSON.stringify(generalConfigData?.ddResourceSetup?.resourceTags || []),
              usr_cmt_txt: generalConfigData?.ddResourceSetup?.resourceDescription,
              oprtnl_stat_cd: 'Active'
            };
      
            console.log('Sending Data Dictionary Schema resource data:', ddResourceSchema);
            const savedDDResourceSchemaResponse = await postResource(ddResourceSchema);
    
            const savedDDResourceSchema = {
              dsstrc_attr_grp_id: savedDDResourceSchemaResponse.dsstrc_attr_grp_id,
              stdiz_abrvd_attr_grp_nm: savedDDResourceSchemaResponse.stdiz_abrvd_attr_grp_nm,
              isSaved: true
            };  
            console.log('--> Step 1. Data Dictionary Schema Prior Saved Info :', savedDDResourceSchema);
    
            // ---------------------------------------------------------------
          

          // 2. Save Schema Config
          console.log('Data Dictionary Schema Config:', ddResourceSchemaConfig);
          // Log the resource data being sent
          
          const ddColumnData = ddResourceSchemaConfig?.map((column) => ({
            ds_id: 0,
            abrvd_attr_nm: column.name || null,
            dsstrc_attr_grp_id: savedDDResourceSchema.dsstrc_attr_grp_id,
            stdiz_abrvd_attr_grp_nm: savedDDResourceSchema.stdiz_abrvd_attr_grp_nm,
            dsstrc_attr_nm: column.name,
            dsstrc_alt_attr_nm: column?.alternativeName || null,
            stdiz_abrvd_attr_nm: column.name,
            stdiz_abrvd_alt_attr_nm: column?.alternativeName || null,
            dsstrc_attr_desc: column?.description || null,
            dsstrc_attr_seq_nbr: column.id,
            physcl_data_typ_nm: column.type || 'string',
            mand_ind: column?.isNullable || false,
            pk_ind: column?.isPrimaryKey || false,
            fk_ind: column?.isForeignKey || false,
            encrypt_ind: false,
            pii_ind: column?.isPII || false,
            phi_ind: column?.isPHI || false,
            disabld_ind: column?.isDisabled || false,
            ai_tag_cmplx: JSON.stringify(column?.ai_tag_cmplx || []),
            user_tag_cmplx: JSON.stringify(column?.tags || []),
            meta_tag_cmplx: JSON.stringify({
              ...(column?.schemaClassification?.value && {
                  schemaClassification: {
                      label: column.schemaClassification.label,
                      value: column.schemaClassification.value
                  }
              }),
              ...(column.column_similarity_score && {
                  column_similarity_score: column.column_similarity_score
              })
          }) || JSON.stringify([]),
            usr_cmt_txt: column.comment || null,
            oprtnl_stat_cd: 'Active'
        })
    );
        
          console.log('Sending Data Dictionary Schema attribute data:', ddColumnData);
          const savedDDSourceAttributeSchemaResponse = await postBulkResourceAttribute({ attributes: ddColumnData }); 
          console.log('Recevied Data Dictionary Schema saved attribute data:', savedDDSourceAttributeSchemaResponse);
    
          
          const savedDDResourceSchemaAttributes = savedDDSourceAttributeSchemaResponse.map(column => ({
            dsstrc_attr_grp_id: column.dsstrc_attr_grp_id,
            stdiz_abrvd_attr_grp_nm: column.stdiz_abrvd_attr_grp_nm,
            dsstrc_attr_id: column.dsstrc_attr_id,
            stdiz_abrvd_attr_nm: column.stdiz_abrvd_attr_nm,
            meta_tag_cmplx: column.meta_tag_cmplx,
            isSaved: true
          }));
          console.log('-- Step 2. Data Dictionary Resource Attributes Prior Saved Info :', savedDDResourceSchemaAttributes); 


          

      // 3. Save Resource Profile Configuration
      const ddResourceProfileData = {
        dsstrc_attr_grp_id: savedDDResourceSchema.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedDDResourceSchema.stdiz_abrvd_attr_grp_nm,
        ds_instc_data_cntnt_typ_cd: ddResourceGeneralConfig?.resourceType,
        ds_instc_data_cntnt_nm: ddResourceGeneralConfig?.resourceInfo?.type,
        ds_instc_data_cntnt_min_dt: null,
        ds_instc_data_cntnt_max_dt: null,
        par_ds_instc_id: null,
        ds_instc_physcl_nm: ddResourceGeneralConfig?.resourceInfo?.name,
        ds_instc_loc_txt: ddResourceGeneralConfig?.resourceInfo?.sourceLocation,
        ds_instc_arrival_dt: ddResourceGeneralConfig?.resourceInfo?.lastModified,
        ds_instc_publd_dt: ddResourceGeneralConfig?.resourceInfo?.lastModified,
        ds_instc_row_cnt: ddResourceGeneralConfig?.resourceInfo?.fullNumRows,
        ds_instc_col_cnt: ddResourceGeneralConfig?.resourceInfo?.numCols,
        ds_instc_size_nbr: ddResourceGeneralConfig?.resourceInfo?.size,
        ds_instc_comprsn_ind: null,
        ds_instc_file_cnt: 1,
        ds_instc_ingstn_prop_cmplx: JSON.stringify(ddResourceGeneralConfig?.ingestionSettings),
        ds_instc_chksum_id: ddResourceGeneralConfig?.resourceInfo?.checksum,
        ds_instc_part_ind: false,
        ds_instc_late_arrival_ind: false,
        ds_instc_resupply_ind: false,
        pii_ind: wizardState?.ddResourceConfig?.processedSchema?.some(col => col?.isPII) || false,
        phi_ind: wizardState?.ddResourceConfig?.processedSchema?.some(col => col?.isPHI) || false,
        ai_tag_cmplx: null,
        user_tag_cmplx: JSON.stringify(ddResourceGeneralConfig?.resourceSetup?.resourceTags || []),
        usr_cmt_txt: ddResourceGeneralConfig?.resourceSetup?.resourceDescription,
        oprtnl_stat_cd: 'Active'
      };

      console.log('Sending Data Dictionary Resource Profile data:', ddResourceProfileData);
      const savedDDResourceProfileData = await postResourceProfile(ddResourceProfileData);

      const savedResourceProfile = {
        id: savedDDResourceProfileData.ds_attr_grp_instc_prof_id,
        name: savedDDResourceProfileData.ds_instc_physcl_nm,
        isSaved: true
      };
      console.log('--> Step 3. Data Dictionary Resource Profile Prior Saved Info :', savedResourceProfile);
    
        //   // ---------------------------------------------------------------
            

    // 4.  Save Resource Schema Data ( the data from the data dictionary )
    const ddResourceData = ddResourceSchemaData.flatMap(table => ({
        stdiz_abrvd_attr_grp_nm: table.tableName,
        dsstrc_attr_grp_nm: table.logicalName,
        dsstrc_attr_grp_shrt_nm: table.tableName,
        dsstrc_attr_grp_desc: table.tableDescription,
        dsstrc_attr_grp_src_typ_cd: 'Data Dictionary Data',
        phi_ind: table.phiColumns > 0 ? true : false,
        pii_ind: table.piiColumns > 0 ? true : false,
        user_tag_cmplx: JSON.stringify(generalConfigData?.ddResourceSetup?.resourceTags || []),
        usr_cmt_txt: null,
        oprtnl_stat_cd: 'Active'
    }));

    console.log('Sending Data Dictionary Data resource data:', ddResourceData);
    const savedDDResourceResponse = await postResource(ddResourceData);

    const savedDDResources = savedDDResourceResponse.map(table => ({
        dsstrc_attr_grp_id: table.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: table.stdiz_abrvd_attr_grp_nm,
        isSaved: true
      }));
      console.log('-- Step 4. Data Dictionary Resource Attributes Prior Saved Info :', savedDDResources); 


    // ---------------------------------------------------------------        


    //       // 2. Save Schema Config
    //       console.log('Data Dictionary Schema Data:', ddResourceSchemaData);
    //       // Log the resource data being sent
          
    //       const ddColumnData = ddResourceSchemaData.flatMap(table => 
    //         table.columns.map(column => ({
    //         ds_id: 0,
    //         abrvd_attr_nm: column.physicalName || null,
    //         dsstrc_attr_grp_id: savedDDResource.dsstrc_attr_grp_id,
    //         stdiz_abrvd_attr_grp_nm: column.physicalName,
    //         dsstrc_attr_nm: column.logicalName || column.physicalName,
    //         dsstrc_alt_attr_nm: column.alternativeName || null,
    //         stdiz_abrvd_attr_nm: column.physicalName,
    //         stdiz_abrvd_alt_attr_nm: column?.alternativeName || null,
    //         dsstrc_attr_desc: column.description || null,
    //         dsstrc_attr_seq_nbr: column.columnOrder || column.id,
    //         physcl_data_typ_nm: column.dataType || 'string',
    //         mand_ind: column?.isNullable || false,
    //         pk_ind: column?.isPrimaryKey || false,
    //         fk_ind: column?.isForeignKey || false,
    //         encrypt_ind: false,
    //         pii_ind: column.isPII || false,
    //         phi_ind: column.isPHI || false,
    //         disabld_ind: column.isDisabled,
    //         ai_tag_cmplx: JSON.stringify(column?.ai_tag_cmplx || []),
    //         user_tag_cmplx: JSON.stringify(column?.tags || []),
    //         meta_tag_cmplx: JSON.stringify({
    //           ...(column?.schemaClassification?.value && {
    //               schemaClassification: {
    //                   label: column.schemaClassification.label,
    //                   value: column.schemaClassification.value
    //               }
    //           }),
    //           ...(column.column_similarity_score && {
    //               column_similarity_score: column.column_similarity_score
    //           })
    //       }) || JSON.stringify([]),
    //         usr_cmt_txt: column.comment || null,
    //         oprtnl_stat_cd: 'Active'
    //     }))
    // );
        
    //       console.log('Sending Data Dictionary attribute data:', ddColumnData);
    //       const savedDDSourceAttributeData = await postBulkResourceAttribute({ attributes: ddColumnData }); 
    //       console.log('Recevied Data Dictionary saved attribute data:', savedDDSourceAttributeData);
    
          
    //       const savedDDResourceAttributes = savedDDSourceAttributeData.map(column => ({
    //         dsstrc_attr_grp_id: column.dsstrc_attr_grp_id,
    //         stdiz_abrvd_attr_grp_nm: column.stdiz_abrvd_attr_grp_nm,
    //         dsstrc_attr_id: column.dsstrc_attr_id,
    //         stdiz_abrvd_attr_nm: column.stdiz_abrvd_attr_nm,
    //         meta_tag_cmplx: column.meta_tag_cmplx,
    //         isSaved: true
    //       }));
    //       console.log('-- Step 2. Data Dictionary Resource Attributes Prior Saved Info :', savedDDResourceAttributes); 
    
    //     //   // ---------------------------------------------------------------
          
    
        //   // 3. Save Resource Profile Configuration
        //   const ddResourceProfileData = {
        //     dsstrc_attr_grp_id: savedDDResource.dsstrc_attr_grp_id,
        //     stdiz_abrvd_attr_grp_nm: savedDDResource.stdiz_abrvd_attr_grp_nm,
        //     ds_instc_data_cntnt_typ_cd: ddResourceGeneralConfig?.resourceType,
        //     ds_instc_data_cntnt_nm: ddResourceGeneralConfig?.resourceInfo?.type,
        //     ds_instc_data_cntnt_min_dt: null,
        //     ds_instc_data_cntnt_max_dt: null,
        //     par_ds_instc_id: null,
        //     ds_instc_physcl_nm: ddResourceGeneralConfig?.resourceInfo?.name,
        //     ds_instc_loc_txt: ddResourceGeneralConfig?.resourceInfo?.sourceLocation,
        //     ds_instc_arrival_dt: ddResourceGeneralConfig?.resourceInfo?.lastModified,
        //     ds_instc_publd_dt: ddResourceGeneralConfig?.resourceInfo?.lastModified,
        //     ds_instc_row_cnt: ddResourceGeneralConfig?.resourceInfo?.fullNumRows,
        //     ds_instc_col_cnt: ddResourceGeneralConfig?.resourceInfo?.numCols,
        //     ds_instc_size_nbr: ddResourceGeneralConfig?.resourceInfo?.size,
        //     ds_instc_comprsn_ind: null,
        //     ds_instc_file_cnt: 1,
        //     ds_instc_ingstn_prop_cmplx: JSON.stringify(ddResourceGeneralConfig?.ingestionSettings),
        //     ds_instc_chksum_id: ddResourceGeneralConfig?.resourceInfo?.checksum,
        //     ds_instc_part_ind: false,
        //     ds_instc_late_arrival_ind: false,
        //     ds_instc_resupply_ind: false,
        //     pii_ind: wizardState?.ddResourceConfig?.processedSchema?.some(col => col?.isPII) || false,
        //     phi_ind: wizardState?.ddResourceConfig?.processedSchema?.some(col => col?.isPHI) || false,
        //     ai_tag_cmplx: null,
        //     user_tag_cmplx: JSON.stringify(ddResourceGeneralConfig?.resourceSetup?.resourceTags || []),
        //     usr_cmt_txt: ddResourceGeneralConfig?.resourceSetup?.resourceDescription,
        //     oprtnl_stat_cd: 'Active'
        //   };
    
        //   console.log('Sending Data Dictionary Resource Profile data:', ddResourceProfileData);
        //   const savedDDResourceProfileData = await postResourceProfile(ddResourceProfileData);
    
        //   const savedResourceProfile = {
        //     id: savedDDResourceProfileData.ds_attr_grp_instc_prof_id,
        //     name: savedDDResourceProfileData.ds_instc_physcl_nm,
        //     isSaved: true
        //   };
        //   console.log('--> Step 3. Data Dictionary Resource Profile Prior Saved Info :', savedResourceProfile);





            setSaveProgress(prev => ({ ...prev, completed: true }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred while saving';
            setAlert({
                show: true,
                severity: 'error',
                message: `Save failed: ${errorMessage}`
              });
            console.error('Save error:', error);
            setSaveProgress(prev => ({ ...prev, error: error.message }));
        } finally {
            setIsProcessing(false);
        }
    };

    const renderProgressSection = () => (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Stepper activeStep={saveProgress.activeStep}>
                {saveSteps.map((label, index) => (
                    <Step key={label} completed={saveProgress.activeStep > index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {isProcessing && <LinearProgress sx={{ mt: 2 }} />}
        </Box>
    );

  
          return (
              <Box sx={{ p: 2 }}>
                    {alert.show && (
                <AlertComponent 
                    severity={alert.severity}
                    message={alert.message}
                    onClose={handleCloseAlert}
                />
                )}
                  <Grid container spacing={2}>
                      {/* Dictionary Details Card */}
                      <Grid item xs={4}>
                          <Card sx={{ height: '100%' }}>
                              <CardContent sx={{ p: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <StorageIcon sx={{ mr: 1 }} color="primary" />
                                      <Typography variant="h6">Dictionary Details</Typography>
                                  </Box>
                                  <Stack spacing={1}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Resource Name</Typography>
                                          <Typography variant="body2">{dictionaryDataMetrics.resourceName ?? 'N/A'}</Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Name</Typography>
                                          <Typography variant="body2">{dictionaryDataMetrics.name ?? 'N/A'}</Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Type</Typography>
                                          <Chip size="small" label={dictionaryDataMetrics.type ?? 'N/A'} />
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Size</Typography>
                                          <Typography variant="body2">{dictionaryDataMetrics?.size ? `${ddResourceGeneralConfig.resourceInfo.size} bytes` : 'N/A'}</Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Last Modified</Typography>
                                          <Typography variant="body2">{dictionaryDataMetrics?.lastModified ?? 'N/A'}</Typography>
                                      </Box>
                                  </Stack>
                              </CardContent>
                          </Card>
                      </Grid>

                      {/* Schema Overview Card */}
                      <Grid item xs={4}>
                          <Card sx={{ height: '100%' }}>
                              <CardContent sx={{ p: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <SchemaIcon sx={{ mr: 1 }} color="primary" />
                                      <Typography variant="h6">Schema Overview</Typography>
                                  </Box>
                                  <Stack spacing={1}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Total Tables</Typography>
                                          <Chip size="small" label={dictionaryDataMetrics.distinctTables ?? 0} />
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Total Columns</Typography>
                                          <Chip size="small" label={dictionaryDataMetrics.totalColumns ?? 0} />
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">PII Columns</Typography>
                                          <Chip 
                                              size="small" 
                                              icon={<PIIIcon sx={{ fontSize: 16 }} />}
                                              label={dictionaryDataMetrics.piiColumns ?? 0}
                                              color="warning"
                                          />
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">PHI Columns</Typography>
                                          <Chip 
                                              size="small"
                                              icon={<PHIIcon sx={{ fontSize: 16 }} />} 
                                              label={dictionaryDataMetrics.phiColumns ?? 0}
                                              color="error"
                                          />
                                      </Box>
                                  </Stack>
                              </CardContent>
                          </Card>
                      </Grid>

                      {/* Classification Overview Card */}
                      <Grid item xs={4}>
                          <Card sx={{ height: '100%' }}>
                              <CardContent sx={{ p: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <CategoryIcon sx={{ mr: 1 }} color="primary" />
                                      <Typography variant="h6">Classification Overview</Typography>
                                  </Box>
                                  <Stack spacing={1}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Classified Columns</Typography>
                                          <Chip 
                                              size="small"
                                              label={ddResourceSchemaConfig?.filter(col => col?.schemaClassification?.value)?.length ?? 0}
                                              color="success"
                                          />
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Primary Keys</Typography>
                                          <Chip size="small" label={dictionaryDataMetrics.pkColumns ?? 0} />
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Foreign Keys</Typography>
                                          <Chip size="small" label={dictionaryDataMetrics.fkColumns ?? 0} />
                                      </Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                          <Typography variant="body2" color="text.secondary">Required Fields</Typography>
                                          <Chip size="small" label={dictionaryDataMetrics.nullableColumns ?? 0} />
                                      </Box>
                                  </Stack>
                              </CardContent>
                          </Card>
                      </Grid>

                      {/* Action Button */}
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button 
                              variant="contained" 
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Saving...' : 'Save Data Dictionary'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ResourceDataDictionarySummary;
